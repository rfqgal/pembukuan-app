<?php

namespace App\Helpers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FilterHelper
{
    /**
     * Get years filter
     *
     * @return array
     */
    public static function getYears()
    {
        $incomeYears = DB::table('incomes')
            ->selectRaw('MIN(YEAR(date)) AS min_year, MAX(YEAR(date)) AS max_year')
            ->first();
        $outcomeYears = DB::table('outcomes')
            ->selectRaw('MIN(YEAR(date)) AS min_year, MAX(YEAR(date)) AS max_year')
            ->first();

        $years = collect([$incomeYears, $outcomeYears]);
            
        $minYear = $years->min('min_year');
        $maxYear = $years->max('max_year');
        
        if ($minYear === $maxYear) {
            return [
                ['value' => $minYear, 'label' => $minYear]
            ];
        }

        $yearOptions = [];
        for ($i = $minYear; $i <= $maxYear; $i++) { 
            $yearOptions[] = ['value' => $i, 'label' => $i];
        }
        return $yearOptions;
    }

    /**
     * Get periods filter
     *
     * @return array
     */
    public static function getPeriods()
    {
        return [
            ['value' => 'Today', 'label' => 'Hari ini'],
            ['value' => 'MTD', 'label' => 'Bulan ini'],
            ['value' => 'YTD', 'label' => 'Tahun ini'],
            ['value' => 'All', 'label' => 'Semua'],
        ];
    }

    /**
     * Get months filter
     *
     * @return array
     */
    public static function getMonths()
    {
        return [
            ['value' => 'January', 'label' => 'Januari'],
            ['value' => 'February', 'label' => 'Februari'],
            ['value' => 'March', 'label' => 'Maret'],
            ['value' => 'April', 'label' => 'April'],
            ['value' => 'May', 'label' => 'Mei'],
            ['value' => 'June', 'label' => 'Juni'],
            ['value' => 'July', 'label' => 'Juli'],
            ['value' => 'August', 'label' => 'Agustus'],
            ['value' => 'September', 'label' => 'September'],
            ['value' => 'October', 'label' => 'Oktober'],
            ['value' => 'November', 'label' => 'November'],
            ['value' => 'December', 'label' => 'Desember'],
        ];
    }

    /**
     * Set filter time between
     *
     * @param Request $request
     * @return array
     */
    public static function setTimeBetween(Request $request)
    {
        if ($request->has('year', 'month')) {
            $time = Carbon::createFromFormat('d F Y', 1 . ' ' . $request->month . ' ' . $request->year);
            
            $startMonth = $time->startOfMonth()->toDateString();
            $endMonth = $time->endOfMonth()->toDateString();

            return [$startMonth, $endMonth];
        }

        if ($request->has('year')) {
            $time = Carbon::createFromFormat('Y', $request->year);

            $startYear = $time->startOfYear()->toDateString();
            $endYear = $time->endOfYear()->toDateString();

            return [$startYear, $endYear];
        }

        if ($request->has('period')) {
            switch ($request->period) {
                case 'YTD':
                    return [Carbon::now()->startOfYear()->toDateString(), Carbon::now()->toDateString()];
                case 'MTD':
                    return [Carbon::now()->startOfMonth()->toDateString(), Carbon::now()->toDateString()];
                case 'Today':
                    return [Carbon::now()->startOfDay()->toDateString(), Carbon::now()->toDateString()];
            }
        }

        return [Carbon::now()->startOfMonth()->toDateString(), Carbon::now()->toDateString()];
    }
}