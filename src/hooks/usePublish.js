import  { useEffect, useState } from 'react'
import request from '../request'
import {notification} from 'antd'

function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState()

  useEffect(() => {
    request.get(`/news?author=${username}&publishState=${type}&_expand=category`)
      .then(res => {
        setDataSource(res.data)
      })
  }, [username,type])

  // 上线
  const handelPublish = (id)=>{
    setDataSource(dataSource.filter(item=>item.id !== id))

    request.patch(`/news/${id}`, {
      "publishState": 2,
      "publishTime":Date.now()
    }).then(res => {
      notification.info({
        message: `通知`,
        description: `已发布上线,您可以到【发布管理/已发布】中查看`,
        placement: 'bottomRight',
      });
    })
  }

  // 下线
  const handelSunset = (id)=>{
    setDataSource(dataSource.filter(item=>item.id !== id))

    request.patch(`/news/${id}`, {
      "publishState": 3
    }).then(res => {
      notification.info({
        message: `通知`,
        description: `已下线,您可以到【发布管理/已下线】中查看`,
        placement: 'bottomRight',
      });
    })
  }

  // 删除
  const handelDelete = (id)=>{
    setDataSource(dataSource.filter(item=>item.id !== id))

    request.delete(`/news/${id}`, ).then(res => {
      notification.info({
        message: `通知`,
        description: `已删除!`,
        placement: 'bottomRight',
      });
    })
  }

  return {
    dataSource,
    handelPublish,
    handelSunset,
    handelDelete
  }
}

export default usePublish