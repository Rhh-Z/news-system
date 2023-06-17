import React, { useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import { useParams } from 'react-router-dom'
import { useEffect } from 'react';
import request from '../../../request';
import moment from 'moment';

export default function NewsPreview() {
  // 获取传过来的id,用来获取对应文章
  const { id } = useParams()

  const [newsInfo, setNewsInfo] = useState(null)

  // 文章状态
  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const publishList = ['未发布', '待发布', '已上线', '已下线']
  // 状态文字颜色
  const colorList = ['black', 'orange', 'green', 'red']
  const auditColorList = ['black', 'blue', 'green', 'red']
  // 获取文章相关信息
  useEffect(() => {
    request.get(`news/${id}?_expand=category&_expand=role`).then(res => {
      setNewsInfo(res.data)
    })
  }, [id])

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
              subTitle={newsInfo.category.title}
            >
              <Descriptions size="small" column={3}>
                <Descriptions.Item label="发布作者">{newsInfo.author}</Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="发布时间">{
                  newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss') : '-'
                }</Descriptions.Item>
                <Descriptions.Item label="区域">{newsInfo.region === '' ? '全球' : newsInfo.region}</Descriptions.Item>
                <Descriptions.Item label="审核状态" contentStyle={{ color: auditColorList[newsInfo.auditState] }}>
                  {auditList[newsInfo.auditState]}
                </Descriptions.Item>
                <Descriptions.Item label="发布状态" contentStyle={{ color: colorList[newsInfo.publishState] }}>
                  {publishList[newsInfo.publishState]}
                </Descriptions.Item>
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
