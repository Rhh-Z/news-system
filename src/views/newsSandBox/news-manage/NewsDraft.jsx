import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Table, notification } from 'antd'
import request from '../../../request'
import { Link, useNavigate } from 'react-router-dom'
import {
  DeleteOutlined,
  EditOutlined,
  ToTopOutlined
} from '@ant-design/icons';

export default function NewsDraft() {
  const navigate = useNavigate()
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    request.get(`/news?author=${username}&auditState=0&_expand=category`)
      .then(res => {
        setDataSource(res.data)
      })
  }, [username])

  const deleteMethod = (item) => {
    setDataSource((dataSource.filter(data => data.id !== item.id)))
    request.delete(`/news/${item.id}`)
  }

  const handleCheck = (item, auditState) => {
    request.patch(`/news/${item.id}`, {
      auditState: 1
    }).then(res => {
      navigate('/audit-manage/list')
      // 刷新页面
      location.reload()

      notification.info({
        message: `通知`,
        description: `已提交审核`,
        placement: 'bottomRight',
      });
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, info) => {
        return <Link to={`/news-manage/preview/${info.id}`}>{title}</Link>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category, info) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <>
            <Button type="danger" style={{ marginRight: '10px' }}
              onClick={() => deleteMethod(item)}
              shape="circle" icon={<DeleteOutlined />} />

            <Button type="primary" shape="circle" style={{ marginRight: '10px' }}
              icon={<EditOutlined />}
              onClick={() => navigate(`/news-manage/update/${item.id}`, { repalce: true })}
            />

            <Button type="primary" shape="circle" icon={<ToTopOutlined />}
              onClick={() => handleCheck(item, 1)}
            />
          </>
        )
      }
    },
  ];



  return (
    <>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />
    </>
  )
}
