import { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';

export default function TableComponent({ columns, route, pageSize = 20 }) {
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
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: result.total,
          },
        });
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
  return (
    <Table
      columns={columns}
      rowKey={(record) => record.id}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
}
