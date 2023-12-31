import { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';

export default function TableComponent({
  columns, route, pageSize = 20, reload = false,
}) {
  const urlParams = new URLSearchParams(window.location.search);
  const filterUrl = {
    year: urlParams.get('year') || null,
    period: urlParams.get('period') || null,
  };

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
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

    axios.get(route, { params })
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
  }, [JSON.stringify(tableParams), reload]);

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
  return (
    <Table
      bordered
      columns={columns}
      rowKey={(record) => record.id}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
}
