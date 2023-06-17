import { Button, Table, Modal, Tree } from 'antd'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import request from '../../../request/index.js'

const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setDataSource] = useState()

  // 操作结构
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <>
            <Button type="danger" style={{ marginRight: '10px' }}
              shape="circle" onClick={() => showDeleteConfirm(item)} icon={<DeleteOutlined />} />
            <Button type="primary" onClick={() => {
              setOpen(true)
              setCurrentRights(item.rights)
              setCurrentId(item.id)
            }} shape="circle" icon={<EditOutlined />} />
          </>
        )
      },
    }
  ]

  // 请求角色数据接口
  useEffect(() => {
    request.get('/roles')
      .then(res => {
        setDataSource(res.data)
      })
  }, [])

  // 请求权限数据接口
  useEffect(() => {
    request.get('/rights?_embed=children')
      .then(res => {
        let data = changeName(res.data)
        setRightList(data)
      })
  }, [])

  // 自定义函数处理label和title的渲染问题
  function changeName(value) {
    // 新数组保存旧数组的value
    let newValue = []
    value.map(item => {
      let newItem = []
      // 全部label替换为title  /g表示全局匹配
      newItem = JSON.parse(JSON.stringify(item).replace(/label/g, 'title'))

      // 将修改完后的数据存入新的数组
      newValue.push(newItem)

    })
    return newValue
  }


  const showDeleteConfirm = (item) => {
    confirm({
      title: '您确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复!',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const newData = dataSource.filter(v => v.id !== item.id)
        setDataSource(newData)
        // 后端同步删除
        request.delete(`/roles/${item.id}`)
      },
    });
  };

  // 权限列表
  const [rightList, setRightList] = useState([])
  // 模态框中树形结构默认选中的权限
  const [currentRights, setCurrentRights] = useState()
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // 当前选中的
  const [currentId, setCurrentId] = useState(0)

  const handleOk = () => {
    // loading加载
    setConfirmLoading(true)
    // 同步dataSource
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    // 同步后端修改 
    request.patch(`/roles/${currentId}`, {
      rights: currentRights
    })
    setOpen(false)
    setConfirmLoading(false);
  };

  // 改变选中
  const onCheck = (checkedKeys) => {
    setCurrentRights(checkedKeys.checked)
  };

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        rowKey={(item) => item.id}
      />
      <Modal
        title="警告"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
      >
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
