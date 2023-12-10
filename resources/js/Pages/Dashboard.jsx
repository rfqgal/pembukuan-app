import { Head } from '@inertiajs/react';
import { Typography } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CardStatistic from '@/Components/Charts/CardStatistic';
import CardSubLayout from '@/Layouts/SubLayouts/CardSubLayout';
import TableComponent from '@/Components/Tables/TableComponent';
import ExportButton from '@/Components/ExportButton';

export default function Dashboard({ auth, statistics }) {
  const columns = [
    { title: 'Deskripsi', dataIndex: 'description', width: '55%' },
    {
      title: 'Nominal',
      dataIndex: 'nominal',
      render: (text) => text.toLocaleString('id-ID', { maximumFractionDigits: 0 }),
      sorter: true,
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      width: '22%',
      sorter: true,
      defaultSortOrder: 'descend',
    },
  ];

  const urlParams = new URLSearchParams(window.location.search);
  const filterUrl = {
    year: urlParams.get('year') || null,
    period: urlParams.get('period') || null,
  };

  let period;

  switch (filterUrl.period) {
    case 'YTD':
      period = 'tahun ini';
      break;
    case 'MTD':
      period = 'bulan ini';
      break;
    case 'Today':
      period = 'hari ini';
      break;
    case 'All':
      period = 'keseluruhan';
      break;

    default:
      period = 'bulan ini';
      break;
  }

  if (filterUrl.year) {
    period = `tahun ${filterUrl.year}`;
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />

      <div className="grid grid-cols-3 gap-4">
        <CardStatistic className="bg-blue-500" value={statistics.balance} description="Saldo saat ini" />
        <CardStatistic className="bg-green-500" value={statistics.income} description={`Pemasukan ${period}`} />
        <CardStatistic className="bg-red-500" value={statistics.outcome} description={`Pengeluaran ${period}`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CardSubLayout>
          <div className="flex justify-between">
            <Typography.Title level={3}>Pemasukan</Typography.Title>
            <ExportButton routeName="income.export" />
          </div>
          <TableComponent
            route={route('dashboard.api.income')}
            columns={columns}
            pageSize={7}
          />
        </CardSubLayout>
        <CardSubLayout>
          <div className="flex justify-between">
            <Typography.Title level={3}>Pemasukan</Typography.Title>
            <ExportButton routeName="outcome.export" />
          </div>
          <TableComponent
            route={route('dashboard.api.outcome')}
            columns={columns}
            pageSize={7}
          />
        </CardSubLayout>
      </div>
    </AuthenticatedLayout>
  );
}
