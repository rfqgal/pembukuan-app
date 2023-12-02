import { useState } from 'react';
import {
  Layout, Menu, Button, theme, Select,
} from 'antd';
import {
  DownCircleOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UpCircleOutlined,
} from '@ant-design/icons';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';

export default function AuthenticatedLayout({ user, children, hideFilter }) {
  const { Header, Sider, Content } = Layout;

  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();

  const onChangeYear = (value) => {
    console.log(`selected ${value}`);
  };
  const onChangePeriod = (value) => {
    console.log(`selected ${value}`);
  };

  const navbarMenu = [{
    key: 'dashboard',
    icon: <HomeOutlined />,
    label: <Link href={route('dashboard')}>Dashboard</Link>,
  }, {
    key: 'income',
    icon: <DownCircleOutlined />,
    label: <Link href={route('income.index')}>Pemasukan</Link>,
  }, {
    key: 'outcome',
    icon: <UpCircleOutlined />,
    label: <Link href={route('outcome.index')}>Pengeluaran</Link>,
  }];

  return (
    <Layout>
      <Sider
        className="!sticky !top-0 left-0 h-screen z-10 shadow"
        collapsible
        trigger={null}
        collapsed={collapsed}
        style={{ background: colorBgContainer }}
      >
        <div className="app-logo flex items-center justify-center h-16">
          <ApplicationLogo className="block h-9 w-auto fill-current text-gray-600" />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={route().current()}
          items={navbarMenu}
          style={{ background: colorBgContainer }}
        />
      </Sider>
      <Layout>
        <Header
          className="sticky top-0 z-10 shadow flex justify-between"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div className="flex pr-6 items-center space-x-4">
            {!hideFilter && (
              <>
                <div className="flex space-x-2">
                  <Select
                    defaultValue="2023"
                    style={{
                      width: 80,
                    }}
                    onChange={onChangeYear}
                    options={[
                      { value: '2022', label: '2022' },
                      { value: '2023', label: '2023' },
                    ]}
                  />
                  <Select
                    defaultValue="MTD"
                    style={{
                      width: 100,
                    }}
                    onChange={onChangePeriod}
                    options={[
                      { value: 'Today', label: 'Hari ini' },
                      { value: 'MTD', label: 'Bulanan' },
                      { value: 'YTD', label: 'Tahunan' },
                      { value: 'All', label: 'Semua' },
                    ]}
                  />
                </div>
                <div className="py-3 h-full">
                  <div className="w-[0.5px] h-full bg-gray-400/50" />
                </div>
              </>
            )}
            <Dropdown>
              <Dropdown.Trigger>
                <span className="inline-flex rounded-md">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                  >
                    {user.name}
                    <svg
                      className="ms-2 -me-0.5 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Link href={route('profile.edit')}>
                  Profil saya
                </Dropdown.Link>
                <Dropdown.Link
                  href={route('logout')}
                  method="post"
                  as="button"
                >
                  Logout
                </Dropdown.Link>
              </Dropdown.Content>
            </Dropdown>
          </div>
        </Header>
        {children
          ? <main className="min-h-screen p-6 space-y-4">{children}</main>
          : (
            <main className="min-h-screen p-6">
              <Content
                className="min-h-[280px] p-6"
                style={{ background: colorBgContainer }}
              >
                Content
              </Content>
            </main>
          )}
      </Layout>
    </Layout>
  );
}
