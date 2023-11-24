<?php

namespace Database\Seeders;

use App\Models\Balance;
use App\Models\Income;
use App\Models\Outcome;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IncomeOutcomeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nominals = [10000, 5000];
        
        for ($iteration = 0; $iteration < 50; $iteration++) { 
            $balance = Balance::find(1);
            $balanceBefore = $balance->nominal;

            $income = rand(1, 100) * $nominals[rand(0, count($nominals) - 1)];
            $balanceAfter = $balanceBefore + $income;

            $balance->nominal = $balanceAfter;
            $balance->save();

            Income::create([
                'nominal' => $income,
                'description' => fake('id')->sentence(4),
                'date' => Carbon::now(),
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
            ]);

            if (rand(0, 1)) {
                $balance = Balance::find(1);
                $balanceBefore = $balance->nominal;

                $outcome = rand(1, 100) * $nominals[rand(0, count($nominals) - 1)];
                $balanceAfter = $balanceBefore - $outcome;

                $balance->nominal = $balanceAfter;
                $balance->save();

                Outcome::create([
                    'nominal' => $outcome,
                    'description' => fake('id')->sentence(4),
                    'date' => Carbon::now(),
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                ]);
            }
        }
    }
}
