import { Head, useForm } from '@inertiajs/react';
import {
  Button,
  DatePicker, Form, Input, InputNumber, notification,
} from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CardSubLayout from '@/Layouts/SubLayouts/CardSubLayout';
import TableComponent from '@/Components/Tables/TableComponent';

export default function Create({ auth }) {
  const inertiaForm = useForm();

  const onFinish = async (values) => {
    const form = {
      ...values,
      date: dayjs(values.date).format('YYYY-MM-DD'),
    };

    axios.post(route('outcome.store'), form)
      .then(({ data: res }) => {
        notification.success({
          message: res.success ? 'Sukses' : 'Gagal',
          description: res.message,
          placement: 'bottomRight',
        });
      })
      .finally(() => {
        inertiaForm.get(route('outcome.create'));
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <AuthenticatedLayout user={auth.user} hideFilter>
      <Head title="Pengeluaran" />

      <div className="flex space-x-4">
        <CardSubLayout className="basis-3/5 h-fit" heading="Buat Pengeluaran Baru">
          <Form layout="vertical" name="outcome" onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <div className="flex space-x-2">
              <Form.Item
                className="grow"
                label="Nominal"
                name="nominal"
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item
                label="Tanggal"
                name="date"
              >
                <DatePicker format="DD/MM/YYYY" />
              </Form.Item>
            </div>
            <Form.Item
              label="Deskripsi"
              name="description"
            >
              <Input.TextArea rows={4} allowClear />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Simpan
              </Button>
            </Form.Item>
          </Form>
        </CardSubLayout>
        <CardSubLayout className="basis-2/5" heading="Pengeluaran Terbaru">
          <TableComponent
            route={route('outcome.index.api')}
            columns={[
              { title: 'Deskripsi', dataIndex: 'description', width: '45%' },
              {
                title: 'Nominal',
                dataIndex: 'nominal',
                render: (text) => text.toLocaleString('id-ID', { maximumFractionDigits: 0 }),
                sorter: true,
              },
              { title: 'Tanggal', dataIndex: 'date', sorter: true },
            ]}
            pageSize={5}
          />
        </CardSubLayout>
      </div>
    </AuthenticatedLayout>
  );
}
