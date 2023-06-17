import React, { useEffect } from 'react'
import request from '../../../request'
import { Button, Table, Tag, notification } from 'antd'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';



export default function AuditList() {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))

  const navigate = useNavigate()
  useEffect(() => {
    // 查找作者是自己，auditState大于等于0，并且发布状态小于等于一的
    request.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1`)
      .then(res => {
        setDataSource(res.data)
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
      dataIndex: 'categoryId',
      render: categoryId => {
        const categoryList = ['时事新闻', '环球经济', '科学技术', '军事世界', '世界体育', '生活理财']
        return <Tag color={'blue'}>{categoryList[categoryId]}</Tag>
      },
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['black', 'blue', 'green', 'red']
        const auditList = ['未审核', '审核中', '已通过', '未通过']
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <>
            {
              item.auditState == 1 && <Button type="danger" style={{ marginRight: '10px', borderRadius: '5px' }}
                onClick={() => revert(item)}>撤销</Button>
            }
            {
              item.auditState == 2 && <Button type="ghost" style={{ marginRight: '10px', borderRadius: '5px' }}
                onClick={() => publish(item)}>发布</Button>
            }
            {
              item.auditState == 3 && <Button type="primary" style={{ marginRight: '10px', borderRadius: '5px' }}
                onClick={() => update(item)} >更新</Button>
            }
          </>
        )
      }
    },
  ];

  const revert = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))

    request.patch(`/news/${item.id}`, {
      "auditState": 0
    }).then(res => {
      notification.info({
        message: `通知`,
        description: `已撤销审核,您可以到草稿箱中查看`,
        placement: 'bottomRight',
      });
    })
  }

  const update = (item) => {
    // 跳转到更新页面
    navigate(`/news-manage/update/${item.id}`)
  }

  const publish = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))

    request.patch(`/news/${item.id}`, {
      "publishState": 2
    }).then(res => {
      notification.info({
        message: `通知`,
        description: `已发布,您可以到发布管理中查看`,
        placement: 'bottomRight',
      });
    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{ pageSize: 5 }} rowKey={item => item.id}
      />
    </div>
  )
}
