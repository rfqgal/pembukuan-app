<?php

namespace App\Http\Controllers;

use App\Models\Balance;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // dd($this->incomeApi($request));
        
        $income = DB::table('incomes')
            ->selectRaw('SUM(nominal) AS total')
            ->first();
        $outcome = DB::table('outcomes')
            ->selectRaw('SUM(nominal) AS total')
            ->first();
        $balance = Balance::find(1);
        
        $statistics = [
            'balance' => (int)$balance->nominal,
            'income' => (int)$income->total,
            'outcome' => (int)$outcome->total,
        ];
        
        return Inertia::render('Dashboard', compact('statistics'));
    }

    /**
     * Serve the Income's API summary
     *
     * @param Request $request
     * @return 
     */
    public function incomeApi(Request $request)
    {
        return DB::table('incomes')
            ->when($request->has('order', 'field'), function (Builder $query) use ($request) {
                $order = substr($request->order, 0, 3) === 'asc'
                    ? substr($request->order, 0, 3)
                    : substr($request->order, 0, 4);
                $query->orderBy($request->field, $order);
            })
            ->when(!$request->has('order', 'field'), function (Builder $query) use ($request) {
                $query->orderByDesc('date');
            })
            ->paginate($request->pageSize);
    }

    /**
     * Serve the Outcome's API summary
     *
     * @param Request $request
     * @return 
     */
    public function outcomeApi(Request $request)
    {
        return DB::table('outcomes')
            ->when($request->has('order', 'field'), function (Builder $query) use ($request) {
                $order = substr($request->order, 0, 3) === 'asc'
                    ? substr($request->order, 0, 3)
                    : substr($request->order, 0, 4);
                $query->orderBy($request->field, $order);
            })
            ->when(!$request->has('order', 'field'), function (Builder $query) use ($request) {
                $query->orderByDesc('date');
            })
            ->paginate($request->pageSize);
    }
}
