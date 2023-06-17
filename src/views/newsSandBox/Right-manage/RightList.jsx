import React from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import { useState } from 'react';
import { useEffect } from 'react';
import request from '../../../request';

import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';



export default function RightList() {
  const [dataSource, setDataSource] = useState([])

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [currentItem, setCurrentItem] = useState()

  // 点击ok后删除
  const handleOk = (item) => {
    // loading加载
    setConfirmLoading(true)
    if (item.grade === 1) {
      // 过滤删除的数据
      const newData = dataSource.filter(v => v.id !== item.id)
      setDataSource(newData)
      // 后端同步删除
      request.delete(`/rights/${item.id}`)
    } else if (item.grade === 2) {
      // 找出删除子级的父级
      const list = dataSource.filter(v => v.id === item.rightId)
      // 在找到的父级的children中筛选出要删除的子级  此时是浅复制，原来的dataSource的children也被会改变
      list[0].children = list[0].children.filter(v => v.id !== item.id)
      // 前端同步删除数据
      setDataSource([...dataSource])
      // 后端同步删除数据
      request.delete(`/children/${item.id}`)
    }
    setOpen(false)
    setConfirmLoading(false);
  };

  const deleteItem = (item) => {
    // 显示Modal
    setOpen(true)
    setCurrentItem(item)
  }

  useEffect(() => {
    request.get('/rights?_embed=children')
      .then(res => {
        res.data.forEach(item => {
          if (item.children.length === 0) {
            item.children = ""
          }
        })
        setDataSource(res.data)
      })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '权限名称',
      dataIndex: 'label',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: text => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <>
            <Button type="danger" style={{ marginRight: '10px' }}
              onClick={() => deleteItem(item)}
              shape="circle" icon={<DeleteOutlined />} />

            <Popover title={'配置项'}
              content={<div style={{ textAlign: 'center' }}>
                <Switch checked={item.pagepermisson} onChange={() => {

                  item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
                  // 前端同步渲染
                  setDataSource([...dataSource])
                  // 后端修改数据
                  request.patch(`/rights/${item.id}`, {
                    pagepermisson: item.pagepermisson
                  })
                }}>123</Switch>
              </div>} trigger={item.pagepermisson === undefined ? '' : 'click'}>
              <Button type="primary" shape="circle" icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              />
            </Popover>

          </>
        )
      }
    },
  ];


  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{ pageSize: 5 }}
      />;
      <Modal
        title="警告"
        open={open}
        onOk={() => handleOk(currentItem)}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
      >
        <p>您确认要删除吗?</p>
      </Modal>
    </div>
  )
}
