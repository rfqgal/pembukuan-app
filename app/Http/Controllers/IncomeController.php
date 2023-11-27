<?php

namespace App\Http\Controllers;

use App\Http\Response\APIResponse;
use App\Models\Balance;
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

    public function indexApi(Request $request)
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
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Income/CreatePage');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $balance = Balance::createIncome($request->nominal);
        
        $create = Income::create([
            'nominal' => $request->nominal,
            'description' => $request->description,
            'date' => $request->date,
            'balance_before' => $balance->before,
            'balance_after' => $balance->after,
        ]);

        if ($create) {
            return APIResponse::success('Pemasukan telah berhasil dibuat!', $create);
        }
        return APIResponse::error('Pemasukan gagal dibuat!', $create);
    }

    /**
     * Display the specified resource.
     */
    public function show(Income $income)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Income $income)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Income $income)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Income $income)
    {
        //
    }
}
