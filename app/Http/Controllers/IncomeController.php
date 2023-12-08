<?php

namespace App\Http\Controllers;

use App\Exports\IncomesExport;
use App\Helpers\FilterHelper;
use App\Http\Response\APIResponse;
use App\Helpers\BalanceHelper;
use App\Models\Income;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Income/IndexPage');
    }

    /**
     * Serve the API for Index page's table.
     *
     * @param Request $request
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function indexApi(Request $request)
    {
        return DB::table('incomes')
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
    }

    /**
     * Handle export of the datasource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response|\Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function export(Request $request)
    {
        $fileName = 'pemasukan-' . date('d-m-Y') . '.' . $request->type;
        $data = (object)['request' => $request];
        
        return (new IncomesExport($data))->download($fileName);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Income/CreatePage');
    }

    /**
     * Serve the API for Create page's table.
     *
     * @param Request $request
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function createApi(Request $request)
    {
        return DB::table('incomes')
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
            
            $balance = BalanceHelper::createIncome($request->nominal);
        
            $create = Income::create([
                'nominal' => $request->nominal,
                'description' => $request->description,
                'date' => $request->date,
                'balance_before' => $balance->before,
                'balance_after' => $balance->after,
            ]);
            
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();

            return APIResponse::error('Pemasukan gagal dibuat!', [
                'message' => $th->getMessage(),
                'error' => $th->getTraceAsString(),
            ]);
        }
        
        return APIResponse::success('Pemasukan telah berhasil dibuat!', $create);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Income $income)
    {
        try {
            DB::beginTransaction();

            $nominal = $request->nominal - $income->nominal;
            $balance = BalanceHelper::updateIncome($nominal);
    
            $income->nominal = $request->nominal;
            $income->date = $request->date;
            $income->description = $request->description;
            $income->balance_after += $balance->difference;
            $income->save();
            
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();

            return APIResponse::error('Pemasukan gagal diubah!', [
                'message' => $th->getMessage(),
                'error' => $th->getTraceAsString(),
            ]);
        }

        return APIResponse::success('Ubah pemasukan telah berhasil!', $income);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Income $income)
    {
        try {
            DB::beginTransaction();

            BalanceHelper::deleteIncome($income->nominal);
            $income->delete();

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();

            return APIResponse::error('Pemasukan gagal dihapus!', [
                'message' => $th->getMessage(),
                'error' => $th->getTraceAsString(),
            ]);
        }
        
        return APIResponse::success('Hapus pemasukan telah berhasil!', $income);
    }
}
