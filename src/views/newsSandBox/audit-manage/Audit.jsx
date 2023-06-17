import React from 'react'
import { useEffect, useState } from 'react'
import request from '../../../request'
import { Table, Tag, Button, notification } from 'antd'
import { Link } from 'react-router-dom'


export default function Audit() {

  const [dataSource, setDataSource] = useState([])
  const user = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    request.get(`/news?auditState=1&_expand=category`)
      .then(res => {
        let data = res.data
        const list = user.role.roleName === '超级管理员' ? data : [
          // 筛选同一区域
          ...data.filter(item => item.region === user.region)
        ]
        setDataSource(list)
      })
  }, [])

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
      }
    },
    {
      title: '作者名称',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: category => <Tag color={'blue'}>{category.title}</Tag>,
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <>
            <Button type="primary" style={{ marginRight: '10px', borderRadius: '5px' }}
              onClick={() => pass(item, 2, 1)}>通过</Button>
            <Button type="danger" style={{ borderRadius: '5px' }}
              onClick={() => reject(item, 3, 0)}>驳回</Button>
          </>
        )
      }
    },
  ];

  const pass = (item, auditState, publishState) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    request.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      notification.info({
        message: '通知',
        description: `您可以到审核列表中查看您的新闻`,
        placement: 'bottomRight'
      })
    })
  }

  const reject = (item, auditState, publishState) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    request.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      notification.info({
        message: '通知',
        description: `已驳回，您可以到审核列表中查看您的新闻`,
        placement: 'bottomRight'
      })
    })
  }


  return (
    <>
      <Table dataSource={dataSource} columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={item => item.id}
      />
    </>
  )
}
