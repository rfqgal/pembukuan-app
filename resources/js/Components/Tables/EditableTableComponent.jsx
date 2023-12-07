import { useEffect, useState } from 'react';
import {
  Button, DatePicker, Form, Input, InputNumber, Popconfirm, Table, notification,
} from 'antd';
import {
  CheckOutlined, CloseOutlined, DeleteFilled, EditFilled,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import { renderNotification } from '@/Utils/ResponseHelper';

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

export default function EditableTableComponent({ columns, routeName, pageSize = 20 }) {
  const urlParams = new URLSearchParams(window.location.search);
  const filterUrl = {
    year: urlParams.get('year') || null,
    period: urlParams.get('period') || null,
  };

  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize,
    },
    order: columns.find((column) => column.defaultSortOrder)?.defaultSortOrder,
    field: columns.find((column) => column.defaultSortOrder)?.dataIndex,
  });

  const fetchData = () => {
    setLoading(true);

    const params = {
      page: tableParams.pagination.current,
      pageSize: tableParams.pagination.pageSize,
      order: tableParams.order,
      field: tableParams.field,
      ...filterUrl,
    };
    axios.get(route(`${routeName}.index.api`), { params })
      .then(({ data: result }) => {
        setData(result.data);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: result.total,
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const isEditing = (record) => record.id === editingKey;
  const edit = (e, record) => {
    e.preventDefault();
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date, 'YYYY-MM-DD') : '',
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (e, id) => {
    e.preventDefault();

    try {
      const row = await form.validateFields();

      axios.put(route(`${routeName}.update`, { id }), {
        ...row,
        date: dayjs(row.date).format('YYYY-MM-DD'),
      }).then(({ data: res }) => {
        renderNotification(res);
        setEditingKey('');
        fetchData();
      }).catch(() => {
        notification.error({
          message: 'Gagal',
          description: 'Data gagal diubah!',
        });
      });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = (e, id) => {
    e.preventDefault();

    axios.delete(route(`${routeName}.destroy`, { id }))
      .then(({ data: res }) => {
        renderNotification(res);
        fetchData();
      })
      .catch(() => {
        notification.error({
          message: 'Error',
          description: 'Data gagal diubah!',
        });
      });
  };

  const tableColumns = [
    ...columns,
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
              onClick={(e) => save(e, record.id)}
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
              onClick={(e) => edit(e, record)}
              icon={<EditFilled />}
            />
            <Popconfirm
              title="Apakah Anda yakin untuk menghapus data ini?"
              onConfirm={(e) => handleDelete(e, record.id)}
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

  const mergedColumns = tableColumns.map((col) => {
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
        loading={loading}
        pagination={{
          onChange: cancel,
          ...tableParams.pagination,
        }}
        onChange={handleTableChange}
      />
    </Form>
  );
}
