import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CardStatistic from '@/Components/Charts/CardStatistic';
import CardSubLayout from '@/Layouts/SubLayouts/CardSubLayout';

export default function Dashboard({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />

      <div className="grid grid-cols-3 gap-4">
        <CardStatistic className="bg-yellow-300" value={57000000} description="Saldo saat ini" />
        <CardStatistic className="bg-green-500" value={5000000} description="Pemasukan bulan ini" />
        <CardStatistic className="bg-red-500" value={3000000} description="Pengeluaran bulan ini" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CardSubLayout heading="Pemasukan">
          Table
        </CardSubLayout>
        <CardSubLayout heading="Pengeluaran">
          Table
        </CardSubLayout>
      </div>
    </AuthenticatedLayout>
  );
}
