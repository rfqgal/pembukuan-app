import { useState } from 'react';
import {
  Button, DatePicker, Form, Input, InputNumber, Popconfirm, Table,
} from 'antd';
import {
  CheckOutlined, CloseOutlined, DeleteFilled, EditFilled,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const originData = [];

for (let i = 0; i < 100; i += 1) {
  const thousands = [10000, 100000];
  originData.push({
    key: i.toString(),
    description: 'Contoh satu kalimat deskripsi.',
    nominal: (Math.floor(Math.random() * 10) + 1) * thousands[Math.floor(Math.random() * 1) + 0],
    date: '2023-11-18',
  });
}

function EditableCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) {
  let inputNode;

  switch (inputType) {
    case 'number':
      inputNode = <InputNumber />;
      break;
    case 'date':
      inputNode = <DatePicker format="YYYY-MM-DD" defaultValue={dayjs(record[dataIndex])} />;
      break;
    default:
      inputNode = <Input />;
      break;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          className="m-0"
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} tidak boleh kosong!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}

export default function EditableTableComponent() {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date, 'YYYY-MM-DD') : '',
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          date: row.date ? dayjs(row.date, 'YYYY-MM-DD').format('YYYY-MM-DD') : '',
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = (value) => {
    console.log(`delete ${value}`);
  };

  const columns = [
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
      inputType: 'number',
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      editable: true,
      inputType: 'date',
    },
    {
      title: '',
      dataIndex: 'operation',
      width: '5%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <div className="flex space-x-2">
            <Button
              type="primary"
              onClick={() => save(record.key)}
              icon={<CheckOutlined />}
            />
            <Popconfirm
              title="Apakah Anda yakin untuk membatalkan edit data?"
              onConfirm={cancel}
            >
              <Button
                icon={<CloseOutlined />}
                danger
              />
            </Popconfirm>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button
              type="primary"
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              icon={<EditFilled />}
            />
            <Popconfirm
              title="Apakah Anda yakin untuk menghapus data ini?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button
                type="primary"
                disabled={editingKey !== ''}
                icon={<DeleteFilled />}
                danger
              />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
}
