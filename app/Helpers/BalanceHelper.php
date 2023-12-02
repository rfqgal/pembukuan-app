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
     * @return object
     */
    public static function updateIncome(int $income)
    {
        $balance = Balance::find(1);
        $balanceBefore = $balance->nominal;

        $balanceAfter = $balanceBefore + $income;
        $balanceDifference = $balanceAfter - $balanceBefore;

        $balance->nominal += $balanceDifference;
        $balance->save();

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

        $balance->nominal = $balanceAfter;
        $balance->save();

        return (object)['before' => $balanceBefore, 'after' => $balanceAfter];
    }
    
    /**
     * Balance trigger by outcome.
     *
     * @param integer $outcome
     * @return object
     */
    public static function createOutcome(int $outcome)
    {
        $balance = Balance::find(1);
        $balanceBefore = $balance->nominal;

        $balanceAfter = $balanceBefore - $outcome;

        $balance->nominal = $balanceAfter;
        $balance->save();

        return (object)['before' => $balanceBefore, 'after' => $balanceAfter];
    }

    /**
     * Balance trigger by outcome.
     *
     * @param integer $outcome
     * @return object
     */
    public static function updateOutcome(int $outcome)
    {
        $balance = Balance::find(1);
        $balanceBefore = $balance->nominal;

        $balanceAfter = $balanceBefore - $outcome;
        $balanceDifference = $balanceAfter - $balanceBefore;

        $balance->nominal += $balanceDifference;
        $balance->save();

        return (object)[
            'before' => $balanceBefore,
            'after' => $balanceAfter,
            'difference' => $balanceDifference,
        ];
    }

    /**
     * Balance trigger by outcome.
     *
     * @param integer $outcome
     * @return object
     */
    public static function deleteOutcome(int $outcome)
    {
        $balance = Balance::find(1);
        $balanceBefore = $balance->nominal;

        $balanceAfter = $balanceBefore + $outcome;

        $balance->nominal = $balanceAfter;
        $balance->save();

        return (object)['before' => $balanceBefore, 'after' => $balanceAfter];
    }
}