import { DownOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';

export default function ExportButton({ routeName = '' }) {
  const urlParams = new URLSearchParams(window.location.search);
  const filterUrl = {
    year: urlParams.get('year') || null,
    period: urlParams.get('period') || null,
  };

  const items = [
    {
      label: (
        <a href={route(routeName, { type: 'xlsx', ...filterUrl })} target="_blank" rel="noreferrer">
          Excel
        </a>
      ),
      key: 'xlsx',
    },
    {
      label: (
        <a href={route(routeName, { type: 'csv', ...filterUrl })} target="_blank" rel="noreferrer">
          CSV
        </a>
      ),
      key: 'csv',
    },
  ];

  const menuProps = { items };

  return (
    <Dropdown menu={menuProps}>
      <Button>
        <Space>
          <ExportOutlined />
          Export
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
