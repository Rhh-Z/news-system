import React from 'react'
import TopHeader from '../../components/NewsSandBox/TopHeader'
import SideMenu from '../../components/NewsSandBox/SideMenu'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from 'antd';
import { Spin } from 'antd'
const { Content } = Layout
import './NewsSandBoxView.scss'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useSelector, useDispatch } from 'react-redux/es/exports'
import request from '../../request'
import { changeIsLoading } from '../../redux/features/loadingSlice'

export default function NewsSandBoxView() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading } = useSelector(item => item.loading)

  // 显示首页时直接显示Home的内容
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home', { replace: true })
    }
  }, [])

  // 进度条
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  })

  // 添加请求拦截器
  request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 显示loading
    dispatch(changeIsLoading(true))
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  })

  // 添加响应拦截器
  request.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // 隐藏loading
    dispatch(changeIsLoading(false))
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });

  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />

        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Spin size="large" spinning={isLoading}>
            {/* 子路由显示区域 */}
            <Outlet />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  )
}
