import { Head, Link } from '@inertiajs/react';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CardSubLayout from '@/Layouts/SubLayouts/CardSubLayout';
import EditableTableComponent from '@/Components/Tables/EditableTableComponent';
import ExportButton from '@/Components/ExportButton';

export default function Index({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Pemasukan" />

      <CardSubLayout>
        <div className="flex justify-between">
          <Typography.Title level={3}>Rincian Pemasukan</Typography.Title>
          <div className="flex space-x-3">
            <ExportButton routeName="income.export" />
            <Link href={route('income.create')}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
              >
                Buat pemasukan baru
              </Button>
            </Link>
          </div>
        </div>
        <EditableTableComponent
          routeName="income"
          columns={[
            {
              title: 'Deskripsi',
              dataIndex: 'description',
              editable: true,
            },
            {
              title: 'Nominal',
              dataIndex: 'nominal',
              render: (text) => text.toLocaleString('id-ID', { maximumFractionDigits: 0 }),
              editable: true,
              sorter: true,
              inputType: 'number',
            },
            {
              title: 'Tanggal',
              dataIndex: 'date',
              editable: true,
              sorter: true,
              inputType: 'date',
            },
          ]}
        />
      </CardSubLayout>
    </AuthenticatedLayout>
  );
}
