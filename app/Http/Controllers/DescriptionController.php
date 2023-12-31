<?php

namespace App\Http\Controllers;

use App\Models\Description;
use Illuminate\Http\Request;

class DescriptionController extends Controller
{
    /**
     * Get descriptions for income.
     *
     * @return \Illuminate\Support\Collection
     */
    public function income()
    {
        return Description::select('value')
            ->where('type', Description::INCOME_TYPE)
            ->get();
    }
    
    /**
     * Get descriptions for outcome.
     *
     * @return \Illuminate\Support\Collection
     */
    public function outcome()
    {
        return Description::select('value')
            ->where('type', Description::OUTCOME_TYPE)
            ->get();
    }
}
