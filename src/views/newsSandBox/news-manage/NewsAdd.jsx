import React, { useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import { useState } from 'react';
import style from './News.module.scss'
import { useEffect } from 'react'
import request from '../../../request/index.js'
import NewsEditor from '../../../components/news-manage/NewsEditor'
import { useNavigate } from 'react-router-dom'

const { Option } = Select
const { Step } = Steps
export default function NewsAdd() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')

  const newsForm = useRef()

  useEffect(() => {
    request.get('/categories').then(res => {
      setCategoryList(res.data)
    })
  }, [])

  const handleNext = () => {
    if (current === 0) {
      newsForm.current.validateFields().then(res => {
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch(err => {
        console.log(err);
      })
    } else {
      // content去重 防止输入回车也能点击下一步
      let arr = content.split('\n')
      console.log(arr);
      let newArr = [...new Set(arr)].join('').trim()
      console.log(newArr);
      if (content === '' || newArr === '<ol><li></li></ol>' || newArr === '<p></p>' || newArr === '<ul><li></li></ul>') {
        message.error('新闻内容不能为空')
      } else {
        setCurrent(current + 1)
      }
    }

  }

  const handlePreiew = () => {
    setCurrent(current - 1)
  }

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const user = JSON.parse(localStorage.getItem('token'))

  // 保存草稿箱和提交审核
  const handleSave = (auditState) => {
    request.post('/news', {
      ...formInfo,
      "content": content,
      "region": user.region,
      "author": user.username,
      "roleId": user.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0
    }).then(res => {
      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      // 刷新页面
      location.reload()

      notification.info({
        message: `通知`,
        description: `已${auditState === 0 ? '保存草稿' : '提交审核'}`,
        placement: 'bottomRight',
      });
    })
  }


  return (
    <>
      <PageHeader
        className="site-page-header"
        title="新闻撰写"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : style.hidden}>

          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 17 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            ref={newsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Select>
                {
                  categoryList.map(item =>
                    <Option key={item.id} value={item.id}>{item.title}</Option>
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className={current === 1 ? '' : style.hidden}>
        <NewsEditor getContent={(value) => {
          setContent(value)
        }}></NewsEditor>
      </div>
      <div className={current === 2 ? '' : style.hidden}>3333</div>


      <div style={{ marginTop: "50px" }}>
        {
          current === 2 && <span>
            <Button type="primary" onClick={() => handleSave(0)}>保存草稿</Button>
            <Button onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type='Primary' onClick={handleNext}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={handlePreiew}>上一步</Button>
        }
      </div>
    </>
  )
}
