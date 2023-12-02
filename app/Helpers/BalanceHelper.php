<?php

namespace App\Helpers;

use App\Models\Balance;

class BalanceHelper
{
    /**
     * Balance trigger by income.
     *
     * @param integer $income
     * @return object
     */
    public static function createIncome(int $income)
    {
        $balance = Balance::find(1);
        $balanceBefore = $balance->nominal;

        $balanceAfter = $balanceBefore + $income;

        $balance->nominal = $balanceAfter;
        $balance->save();

        return (object)['before' => $balanceBefore, 'after' => $balanceAfter];
    }

    /**
     * Balance trigger by income.
     *
     * @param integer $income
     * @param integer $id
     * @return object
     */
    public static function updateIncome(int $income, $id)
    {
        $balance = Balance::find(1);
        $balanceBefore = $balance->nominal;

        $balanceAfter = $balanceBefore + $income;
        $balanceDifference = $balanceAfter - $balanceBefore;

        $balance->nominal = $balanceDifference;
        // $balance->save();

        return (object)[
            'before' => $balanceBefore,
            'after' => $balanceAfter,
            'difference' => $balanceDifference,
        ];
    }

    /**
     * Balance trigger by income.
     *
     * @param integer $income
     * @return object
     */
    public static function deleteIncome(int $income)
    {
        $balance = Balance::find(1);
        $balanceBefore = $balance->nominal;

        $balanceAfter = $balanceBefore - $income;

        // $balance->nominal = $balanceAfter;
        // $balance->save();

        return (object)['before' => $balanceBefore, 'after' => $balanceAfter];
    }
}