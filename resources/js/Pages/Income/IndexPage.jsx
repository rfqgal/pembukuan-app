import { Head, Link } from '@inertiajs/react';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CardSubLayout from '@/Layouts/SubLayouts/CardSubLayout';
import EditableTableComponent from '@/Components/Tables/EditableTableComponent';

export default function Index({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Pemasukan" />

      <CardSubLayout>
        <div className="flex justify-between">
          <Typography.Title level={3}>Rincian Pemasukan</Typography.Title>
          <Link href={route('income.create')}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
            >
              Buat pemasukan baru
            </Button>
          </Link>
        </div>
        <EditableTableComponent />
      </CardSubLayout>
    </AuthenticatedLayout>
  );
}
