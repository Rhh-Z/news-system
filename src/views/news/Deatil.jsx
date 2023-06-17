import React, { useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import { useParams } from 'react-router-dom'
import { useEffect } from 'react';
import request from '../../request';
import moment from 'moment';
import { HeartTwoTone } from '@ant-design/icons'

export default function Detail() {
  // 获取传过来的id,用来获取对应文章
  const { id } = useParams()

  const [newsInfo, setNewsInfo] = useState(null)

  // 获取文章相关信息
  useEffect(() => {
    request.get(`news/${id}?_expand=category&_expand=role`).then(res => {
      setNewsInfo({
        ...res.data,
        // 浏览量+1
        view: res.data.view + 1
      })
      // 同步后端
      request.patch(`news/${id}?_expand=category&_expand=role`, {
        view: res.data.view + 1
      })
    })
  }, [id])

  // 点赞处理
  const handleStar = () => {
    setNewsInfo({
      ...newsInfo,
      // 点赞量+1
      star: newsInfo.star + 1
    })
    // 同步后端
    request.patch(`news/${id}?_expand=category&_expand=role`, {
      star: newsInfo.view + 1
    })
  }

  return (
    <div>
      {
        newsInfo && <>
          <div style={{
            padding: '24px',
            backgroundColor: '#f5f5f5'
          }}>

            <PageHeader
              ghost={false}
              onBack={() => window.history.back()}
              title={newsInfo.title}
              subTitle={
                <div>
                  {newsInfo.category.title}
                  <HeartTwoTone style={{ cursor: 'pointer' }}
                    onClick={() => handleStar()}
                    twoToneColor={'#eb2f96'} />
                </div>
              }
            >
              <Descriptions size="small" column={3}>
                <Descriptions.Item label="发布作者">{newsInfo.author}</Descriptions.Item>
                <Descriptions.Item label="发布时间">{
                  newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss') : '-'
                }</Descriptions.Item>
                <Descriptions.Item label="区域">{newsInfo.region === '' ? '全球' : newsInfo.region}</Descriptions.Item>
                <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                <Descriptions.Item label="评论数量">0</Descriptions.Item>
              </Descriptions>
            </PageHeader>
          </div>
          <div dangerouslySetInnerHTML={{ __html: newsInfo.content }}
            style={{ padding: '24px' }}
          ></div>
        </>
      }
    </div>
  )
}
