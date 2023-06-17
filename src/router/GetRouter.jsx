import { Navigate, useRoutes } from 'react-router-dom'
import LoginView from '../views/Login/LoginView'
import NewsSandBoxView from '../views/newsSandBox/NewsSandBoxView'
import Home from '../views/newsSandBox/Home/Home'
import UserList from '../views/newsSandBox/User-manage/UserList'
import RightList from '../views/newsSandBox/Right-manage/RightList'
import RoleList from '../views/newsSandBox/Role-manage/RoleList'
import NoMatch from '../views/NoMatch/NoMatch'
import NewsDraft from '../views/newsSandBox/news-manage/NewsDraft'
import NewsAdd from '../views/newsSandBox/news-manage/NewsAdd'
import NewsCategory from '../views/newsSandBox/news-manage/NewsCategory'
import Published from '../views/newsSandBox/publish-manage/Published'
import UnPublished from '../views/newsSandBox/publish-manage/Unpublished'
import Sunset from '../views/newsSandBox/publish-manage/Sunset'
import Audit from '../views/newsSandBox/audit-manage/Audit'
import AuditList from '../views/newsSandBox/audit-manage/AuditList'
import NewsPreview from '../views/newsSandBox/news-manage/NewsPreview'
import NewsUpdate from '../views/newsSandBox/news-manage/NewsUpdate'

import { useEffect, useState } from 'react'
import request from '../request'
import News from '../views/news/News'
import Deatil from '../views/news/Deatil'

const Router = () => {
  const [dataSource, setDataSource] = useState([])

  const [rights, setRights] = useState()

  useEffect(() => {
    Promise.all([
      request.get('/rights'),
      request.get('/children')
    ]).then(res => {
      setDataSource([...res[0].data, ...res[1].data])
    })
  }, [])


  const LocalRouterMap = {
    "*": <NoMatch />,
    "/": <Home />,
    "/home": <Home />,
    "/login": <LoginView />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/published": <Published />,
    "/publish-manage/unpublished": <UnPublished />,
    "/publish-manage/sunset": <Sunset />,
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
      setRights(rights)
    }
  }, [localStorage.getItem('token')])

  let arr = []
  dataSource.forEach(item => {
    for (let key in LocalRouterMap) {
      // 判断pagepermission是否为1,，判断登录用户是否权限是否包含该路径，是才创建对应路由
      if ((item.pagepermisson || item.routepermission) && rights?.includes(key) && item.key === key) {
        arr.push({
          path: item.key,
          element: LocalRouterMap[key]
        })
      }
    }
    return arr
  })


  return useRoutes([
    {
      path: '/',
      element: localStorage.getItem('token') ?
        <NewsSandBoxView /> :
        <Navigate replace to='/login' />,
      children: [
        // 404页面
        {
          path: '*',
          element: arr.length > 0 && <NoMatch />
        },
        // 将合并好的数组中的对象展开
        ...arr
      ]
    },
    {
      path: '/login',
      element: <LoginView />
    },
    {
      path: '/news',
      element: <News />
    },
    {
      path: '/detail/:id',
      element: <Deatil />
    }
  ])
}

export default Router