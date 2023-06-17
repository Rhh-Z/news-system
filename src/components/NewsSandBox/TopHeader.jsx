import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeCollapsed } from '../../redux/features/collapsedSlice';
const { Header } = Layout;

export default function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate()
  // 派发器
  const dispatch = useDispatch()
  const { collapsed } = useSelector(item => item.collapsed)
  // 导入登录用户信息
  const user = JSON.parse(localStorage.getItem('token'))

  const changeCollspsed = () => {
    dispatch(changeCollapsed(!collapsed))
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  const menu = (
    <Menu style={{ marginTop: '15px' }}
      items={[
        {
          key: '1',
          label: (
            <NavLink to={'/users'}>
              {user.role.roleName}
            </NavLink>
          )
        },
        {
          key: '4',
          danger: true,
          label: (
            <a onClick={() => logout()}>
              退出
            </a>
          )
        },
      ]}
    />
  );

  return (
    <>
      <Header className="site-layout-background" style={{ padding: ' 0 16px' }}>
        {
          collapsed ? <MenuUnfoldOutlined onClick={changeCollspsed} /> : <MenuFoldOutlined onClick={changeCollspsed} />
        }
        <div style={{ float: 'right' }}>
          <span style={{ marginRight: '10px' }}>欢迎{user.username}回来!</span>
          <Dropdown overlay={menu} style={{ backgroundColor: 'red', }}>
            <a onClick={e => e.preventDefault()}>
              <Avatar size="large" icon={<UserOutlined />} />
            </a>
          </Dropdown>
        </div>
      </Header>
    </>
  )
}
