import React, { useRef } from 'react'
import { Button, Table, Modal, Switch } from 'antd'
import { useState } from 'react';
import { useEffect } from 'react';
import request from '../../../request';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal;


export default function UserList() {
  // 渲染用户列表table的数据
  const [dataSource, setDataSource] = useState([])
  // 角色列表数据
  const [roleList, setRoleList] = useState([])
  // 地区列表数据
  const [regionList, setRegionList] = useState([])

  // 获取Modal的表单
  const addForm = useRef(null)
  // 获取更新Modal的表单
  const updateForm = useRef(null)

  // 添加模态框状态
  const [open, setOpen] = useState(false);
  // 更新模态框状态
  const [updateOpen, setUpdateOpen] = useState(false)

  // 设置更新模态框的禁用状态
  const [isUpdateDisable, setIsUpdateDisable] = useState(false)

  const [currentItem, setCurrentItem] = useState([])

  const user = JSON.parse(localStorage.getItem('token'))

  // console.log(JSON.parse(localStorage.getItem('token')));

  // 权限对象

  useEffect(() => {
    request.get('/users?_expand=role')
      .then(res => {
        let data = res.data
        const list = user.role.roleName === '超级管理员' ? data : [
          // 筛选同一区域
          ...data.filter(item => item.region === user.region)
        ]
        setDataSource(list)
      })
  }, [])
  useEffect(() => {
    request.get('/roles').then(res => {
      setRoleList(res.data)
    })
  }, [])
  useEffect(() => {
    request.get('/regions').then(res => {
      setRegionList(res.data)
    })
  }, [])


  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <div>{region === '' || undefined ? '全球' : region}</div>
      },
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: '全球'
        }
      ],
      // 筛选地区
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ''
        } else {
          return item.region === value
        }
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, info) => {
        return <Switch checked={roleState} onChange={() => handleSwitch(info)} disabled={info.default} ></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <>
            <Button type="danger" style={{ marginRight: '10px' }}
              onClick={() => showDeleteConfirm(item)}
              shape="circle" disabled={item.default} icon={<DeleteOutlined />} />

            <Button type="primary" shape="circle" icon={<EditOutlined />}
              disabled={item.default} onClick={() => handleUpdate(item)}
            />
          </>
        )
      }
    },
  ];


  // 更新Switch状态
  const handleSwitch = (item) => {
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    // 后端同步修改state
    request.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  const showDeleteConfirm = (item) => {
    confirm({
      title: '您确定要删除该用户吗?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        // 删除状态同步
        setDataSource(dataSource.filter(data => data.id !== item.id))
        // 后端删除
        request.delete(`/users/${item.id}`)
      },
    });
  };


  // 确认添加用户处理
  const onOk = () => {
    addForm.current.validateFields().then(res => {
      // 模态框消失
      setOpen(false)

      // 重置表单
      addForm.current.resetFields()

      // post到后端，生成id，再设置dataSource,方便以后的删除和更新
      request.post('/users', {
        ...res,
        region: res.region,
        "roleState": true,
        "default": false
      }).then(res => {
        // 有了id后更新dataSource
        setDataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === res.data.roleId)[0]
        }])
      }).catch(err => console.warn(err))
    })
  }

  // 显示更新Modal
  const handleUpdate = (item) => {
    setUpdateOpen(true)

    // 状态更新和热更新不一定同步用异步将其改为同步
    setTimeout(() => {
      if (item.roleId === 1) {
        setIsUpdateDisable(true)
      } else {
        setIsUpdateDisable(false)
      }
      if (updateForm !== null) {
        // 将要更新的值填入Modal
        updateForm.current.setFieldsValue(item)
      }
    }, 0)

    setCurrentItem(item)
  }

  // 确认更新用户处理
  const onUpdateOk = () => {
    // 提交更新后的值
    updateForm.current.validateFields().then(res => {
      // 模态框消失
      setUpdateOpen(false)
      // 前端修改状态
      setDataSource(dataSource.map(item => {
        if (item.id === currentItem.id) {
          return {
            ...item,
            ...res,
            role: roleList.filter(data => data.id === res.roleId)[0]
          }
        }
        return item
      }))
      // 后端修改数据
      request.patch(`/users/${currentItem.id}`, res)
    })
  }

  return (
    <div>
      <Button type='primary' onClick={() => setOpen(true)}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={item => item.id}
      />

      {/* 添加模态框 */}
      <Modal
        open={open}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setOpen(false)
        }}
        onOk={onOk}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      {/* 更新模态框 */}
      <Modal
        open={updateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setUpdateOpen(false)
          setIsUpdateDisable(!isUpdateDisable)
        }}
        onOk={() => onUpdateOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisable={isUpdateDisable} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
