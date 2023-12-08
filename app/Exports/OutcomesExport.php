<?php

namespace App\Exports;

use App\Helpers\FilterHelper;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class OutcomesExport implements FromQuery, ShouldAutoSize, WithColumnFormatting, WithHeadings, WithStyles
{
    use Exportable;
    
    /**
     * Define request.
     *
     * @var Request
     */
    private Request $request;
    
    /**
     * Handle the constructor.
     *
     * @param object $data
     */
    public function __construct($data)
    {
        $this->request = $data->request;
    }
    
    /**
     * Prepared query of the datasource.
     *
     * @return Builder
     */
    public function query()
    {
        $request = $this->request;
        
        return DB::table('outcomes')
            ->select('description', 'nominal', DB::raw("DATE_FORMAT(date, '%d/%m/%Y') AS formatted_date"))
            ->when(strtolower($request->period) !== 'all', function (Builder $query) use ($request) {
                $query->whereBetween('date', FilterHelper::setTimeBetween($request));
            })
            ->orderBy('date');
    }

    /**
     * Heading rows.
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'Deskripsi',
            'Nominal',
            'Tanggal',
        ];
    }

    /**
     * @param \App\Models\Outcome $outcome
     */
    public function map($outcome): array
    {        
        return [
            $outcome->description,
            $outcome->nominal,
            Date::stringToExcel($outcome->date),
        ];
    }
    
    /**
     * Handle columns' format.
     *
     * @return array
     */
    public function columnFormats(): array
    {
        return [
            'C' => NumberFormat::FORMAT_DATE_DDMMYYYY,
        ];
    }

    /**
     * Handle the styles.
     *
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            
            'B' => [
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_RIGHT,
                ]
            ],
            'C' => [
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_RIGHT,
                ]
            ],
        ];
    }
}
