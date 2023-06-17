import React, { useState, useEffect } from 'react'
import {
  UserSwitchOutlined,
  HomeOutlined,
  UserOutlined,
  VerifiedOutlined,
  CrownOutlined,
  FileOutlined,
  UsergroupDeleteOutlined,
  FileAddOutlined,
  FileExclamationOutlined,
  FileSearchOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  FileSyncOutlined,
  FileUnknownOutlined,
  FileExcelOutlined,
  FileDoneOutlined,
  TrademarkCircleOutlined,
  FileMarkdownOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import style from './SideMenu.module.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import request from '../../request';
import { useSelector } from 'react-redux';

const { Sider } = Layout;

// 加载图标数组
const iconList = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserOutlined />,
  '/user-manage/list': <UsergroupDeleteOutlined />,
  "/right-manage": <TrademarkCircleOutlined />,
  "/right-manage/role/list": <UserSwitchOutlined />,
  "/right-manage/right/list": <CrownOutlined />,
  "/news-manage/right/list": <VerifiedOutlined />,
  "/news-manage": <FileOutlined />,
  "/news-manage/add": <FileAddOutlined />,
  "/news-manage/draft": <FileExclamationOutlined />,
  "/news-manage/category": <FileMarkdownOutlined />,
  "/audit-manage": <FileTextOutlined />,
  "/audit-manage/audit": <FileSearchOutlined />,
  "/audit-manage/list": <FileProtectOutlined />,
  "/publish-manage": <FileSyncOutlined />,
  "/publish-manage/unpublished": <FileUnknownOutlined />,
  "/publish-manage/published": <FileDoneOutlined />,
  "/publish-manage/sunset": <FileExcelOutlined />,
}

export default function SideMenu() {
  // 折叠状态
  const { collapsed } = useSelector(item => item.collapsed)

  const [list, setList] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  // 设置进入选中的选项关键字
  const [selectKey, setSelectKey] = useState(location.pathname)
  const openKey = ['/' + location.pathname.split('/')[1]]

  // 登录用户信息
  const user = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    request.get('/rights?_embed=children').then(res => {
      setList(res.data)
    })
  }, [])

  const obj = (key, icon, label, children) => {
    return {
      key,
      icon,
      label,
      children,
    }
  }
  const dfs1 = (list) => {
    const arr = []
    list.map((item) => {
      if (item.children && item.children.length !== 0) {
        return checkPagePermission(item) && arr.push(
          obj(item.key, iconList[item.key], item.label, dfs1(item.children))
        )
      } else {
        return (
          checkPagePermission(item) &&
          arr.push(obj(item.key, iconList[item.key], item.label))
        )
      }
    })
    return arr
  }

  const checkPagePermission = (item) => {
    // 显示侧边栏的条件 当前用户的登录权限列表要包含item.pagepermisson
    return item.pagepermisson && user.role.rights.includes(item.key)
  }


  const onClick = (item) => {
    navigate(item.key)
  }

  return (
    <>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ height: '100%' }}>
        <div style={{ display: "flex", height: "100%", flexDirection: 'column' }}>
          <div className={style.logo} >全球新闻发布管理系统</div>
          <div style={{ flex: 1, overflow: "auto" }}>
            <Menu
              defaultOpenKeys={openKey}
              onClick={(e) => onClick(e)}
              theme="dark"
              mode="inline"
              defaultSelectedKeys={selectKey}
              items={dfs1(list)}
            />
          </div>
        </div>
      </Sider>
    </>
  )
}

