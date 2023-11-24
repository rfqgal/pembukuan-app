<?php

namespace Database\Seeders;

use App\Models\Balance;
use App\Models\User;
use Database\Seeders\IncomeOutcomeSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate([
            'name' => 'Super Admin',
        ], [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        Balance::firstOrCreate([
            'id' => 1,
        ], [
            'nominal' => 0,
        ]);

        $this->call([
            IncomeOutcomeSeeder::class,
        ]);
    }
}
