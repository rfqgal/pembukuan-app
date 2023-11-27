<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Balance extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nominal',
    ];

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
}
