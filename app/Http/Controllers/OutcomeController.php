<?php

namespace App\Http\Controllers;

use App\Helpers\BalanceHelper;
use App\Helpers\FilterHelper;
use App\Http\Response\APIResponse;
use App\Models\Outcome;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OutcomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Outcome/IndexPage');
    }

    /**
     * Serve the API for Index page's table.
     *
     * @param Request $request
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function indexApi(Request $request)
    {
        $outcomes = DB::table('outcomes')
            ->when(strtolower($request->period) !== 'all', function (Builder $query) use ($request) {
                $query->whereBetween('date', FilterHelper::setTimeBetween($request));
            })
            ->when($request->has('order', 'field'), function (Builder $query) use ($request) {
                $order = substr($request->order, 0, 3) === 'asc'
                    ? substr($request->order, 0, 3)
                    : substr($request->order, 0, 4);
                $query->orderBy($request->field, $order);
            })
            ->when(!$request->has('order', 'field'), function (Builder $query) use ($request) {
                $query->orderByDesc('created_at');
            })
            ->paginate($request->pageSize);

        $outcomes->map(function ($item) {
            $item->key = $item->id;
            $item->expandable = true;
        });
            
        return $outcomes;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Outcome/CreatePage');
    }

    /**
     * Serve the API for Create page's table.
     *
     * @param Request $request
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function createApi(Request $request)
    {
        return DB::table('outcomes')
            ->when($request->has('order', 'field'), function (Builder $query) use ($request) {
                $order = substr($request->order, 0, 3) === 'asc'
                    ? substr($request->order, 0, 3)
                    : substr($request->order, 0, 4);
                $query->orderBy($request->field, $order);
            })
            ->when(!$request->has('order', 'field'), function (Builder $query) use ($request) {
                $query->orderByDesc('created_at');
            })
            ->paginate($request->pageSize);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            
            $balance = BalanceHelper::createOutcome($request->nominal);
        
            $create = Outcome::create([
                'nominal' => $request->nominal,
                'description' => $request->description,
                'date' => $request->date,
                'balance_before' => $balance->before,
                'balance_after' => $balance->after,
            ]);
            
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();

            return APIResponse::error('Pengeluaran gagal dibuat!', [
                'message' => $th->getMessage(),
                'error' => $th->getTraceAsString(),
            ]);
        }
        
        return APIResponse::success('Pengeluaran telah berhasil dibuat!', $create);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Outcome $outcome)
    {
        try {
            DB::beginTransaction();

            $nominal = $request->nominal - $outcome->nominal;
            $balance = BalanceHelper::updateOutcome($nominal);
            
            $outcome->nominal = $request->nominal;
            $outcome->date = $request->date;
            $outcome->description = $request->description;
            $outcome->balance_after += $balance->difference;
            $outcome->save();
            
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();

            return APIResponse::error('Pengeluaran gagal diubah!', [
                'message' => $th->getMessage(),
                'error' => $th->getTraceAsString(),
            ]);
        }

        return APIResponse::success('Ubah pengeluaran telah berhasil!', $outcome);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Outcome $outcome)
    {
        try {
            DB::beginTransaction();

            BalanceHelper::deleteOutcome($outcome->nominal);
            $outcome->delete();

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();

            return APIResponse::error('Pengeluaran gagal dihapus!', [
                'message' => $th->getMessage(),
                'error' => $th->getTraceAsString(),
            ]);
        }
        
        return APIResponse::success('Hapus pengeluaran telah berhasil!', $outcome);
    }
}
