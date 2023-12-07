import { Head } from '@inertiajs/react';
import {
  Button,
  DatePicker, Form, Input, InputNumber, notification,
} from 'antd';
import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CardSubLayout from '@/Layouts/SubLayouts/CardSubLayout';
import TableComponent from '@/Components/Tables/TableComponent';

export default function Create({ auth }) {
  const [form] = Form.useForm();
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    const data = await form.validateFields();
    setLoading(true);

    axios
      .post(route('income.store'), {
        ...data,
        date: dayjs(data.date).format('YYYY-MM-DD'),
      })
      .then(({ data: res }) => {
        notification.success({
          message: 'Sukses',
          description: res.message,
          placement: 'bottomRight',
        });
      })
      .catch((err) => {
        notification.error({
          message: 'Gagal',
          description: err?.response?.data?.message,
          placement: 'bottomRight',
        });
      })
      .finally(() => {
        form.resetFields();
        setLoading(false);
        setReload(reload + 1);
      });
  };

  const onFinishFailed = ({ errorFields }) => {
    errorFields.forEach((element) => {
      notification.error({
        message: 'Gagal',
        description: element.errors[0],
        placement: 'bottomRight',
      });
    });
  };

  return (
    <AuthenticatedLayout user={auth.user} hideFilter>
      <Head title="Pemasukan" />

      <div className="flex space-x-4">
        <CardSubLayout className="basis-3/5 h-fit" heading="Buat Pemasukan Baru">
          <Form
            form={form}
            layout="vertical"
            name="income"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex space-x-2">
              <Form.Item
                className="grow"
                label="Nominal"
                name="nominal"
                rules={[{ required: true, message: 'Nominal harus diisi.' }]}

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
                rules={[{ required: true, message: 'Tanggal harus diisi.' }]}

              >
                <DatePicker
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </div>
            <Form.Item
              className="pt-4"
              label="Deskripsi"
              name="description"
              rules={[{ required: true, message: 'Deskripsi harus diisi.' }]}
            >
              <Input.TextArea
                rows={4}
                allowClear
              />
            </Form.Item>
            <Form.Item className="pt-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Simpan
              </Button>
            </Form.Item>
          </Form>
        </CardSubLayout>
        <CardSubLayout className="basis-2/5" heading="Pemasukan Terbaru">
          <TableComponent
            route={route('income.create.api')}
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
            reload={reload}
          />
        </CardSubLayout>
      </div>
    </AuthenticatedLayout>
  );
}
