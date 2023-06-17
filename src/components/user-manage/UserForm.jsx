import React from 'react'
import { Form, Input, Select } from 'antd'
import { forwardRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
const { Option } = Select

const UserForm = forwardRef((props, ref) => {
  useEffect(() => {
    setIsdisabled(props.isUpdateDisable)
  }, [props.isUpdateDisable])

  const [isDisabled, setIsdisabled] = useState(false)

  const user = JSON.parse(localStorage.getItem('token'))

  const regionDisable = useCallback((item) => {
    // 如果是超级管理员则不禁用
    if (user.roleId === 1) {
      return false
    } else if (user.roleId === 2 && user.region === item.value) {//如果是区域管理员只能改自己地区
      return false
    } else {
      return true
    }
  }, [])


  const roleDisable = useCallback((item) => {
    if (user.roleId === 1) {
      return false
    } else if (user.roleId === 2 && item.id >= 2) {
      return false
    } else if (user.roleId === 3 && item.id >= 3) {
      return false
    } else {
      return true
    }
  }, [])

  return (
    <>
      <Form
        ref={ref}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '用户名不能为空!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '密码不能为空!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={!isDisabled && [{ required: true, message: '区域不能为空!' }]}
        >
          <Select disabled={isDisabled}>
            {
              props.regionList.map(item =>
                <Option key={item.id} value={item.value}
                  disabled={regionDisable(item)}
                >{item.title}</Option>
              )
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[{ required: true, message: '角色不能为空!' }]}
        >
          <Select onChange={(value) => {
            if (value === 1) {
              setIsdisabled(true)
              // 表单方法修改表单的值
              ref.current.setFieldsValue({
                region: ''
              })
            } else {
              setIsdisabled(false)
            }
          }} >
            {
              props.roleList.map(item =>
                <Option Option key={item.id} value={item.id}
                  disabled={roleDisable(item)}>{item.roleName}</Option>
              )
            }
          </Select>
        </Form.Item>
      </Form>
    </>
  )
})


export default UserForm