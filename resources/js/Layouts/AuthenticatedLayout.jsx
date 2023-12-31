import { useState } from 'react';
import {
  Layout, Menu, Button, theme, Select,
} from 'antd';
import {
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Link, router, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';

export default function AuthenticatedLayout({ user, children, hideFilter }) {
  const { Header, Sider, Content } = Layout;

  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();

  const { filters } = usePage().props;

  const urlParams = new URLSearchParams(window.location.search);
  const filterUrl = {
    year: urlParams.get('year') || null,
    month: urlParams.get('month') || null,
    period: !urlParams.get('year') && !urlParams.get('month')
      ? urlParams.get('period') || 'MTD'
      : null,
  };

  const onChangeYear = (value) => {
    const formData = {
      year: value,
      month: undefined,
      period: undefined,
    };
    Object.keys(formData).forEach((k) => !formData[k] && delete formData[k]);
    router.get(route(route().current()), formData);
  };
  const onChangeMonth = (value) => {
    const formData = {
      year: filterUrl.year,
      month: value,
      period: undefined,
    };
    Object.keys(formData).forEach((k) => !formData[k] && delete formData[k]);
    router.get(route(route().current()), formData);
  };
  const onChangePeriod = (value) => {
    const formData = {
      year: undefined,
      month: undefined,
      period: value,
    };
    Object.keys(formData).forEach((k) => !formData[k] && delete formData[k]);
    router.get(route(route().current()), formData);
  };

  const navbarMenu = [{
    key: 'dashboard',
    icon: <HomeOutlined />,
    label: <Link href={route('dashboard', filterUrl)}>Dashboard</Link>,
  }, {
    key: 'income',
    icon: <LoginOutlined />,
    label: <Link href={route('income.index', filterUrl)}>Pemasukan</Link>,
  }, {
    key: 'outcome',
    icon: <LogoutOutlined />,
    label: <Link href={route('outcome.index', filterUrl)}>Pengeluaran</Link>,
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
                    defaultValue={filterUrl.year}
                    style={{
                      width: 84,
                    }}
                    placeholder="Tahun"
                    onChange={onChangeYear}
                    options={filters.years}
                  />
                  <Select
                    defaultValue={filterUrl.month}
                    style={{
                      width: 108,
                    }}
                    placeholder="Bulan"
                    onChange={onChangeMonth}
                    options={filters.months}
                    disabled={!filterUrl.year}
                  />
                  <Select
                    defaultValue={filterUrl.period}
                    style={{
                      width: 100,
                    }}
                    placeholder="Periode"
                    onChange={onChangePeriod}
                    options={filters.periods}
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
          ? <main className="p-6 space-y-4">{children}</main>
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
