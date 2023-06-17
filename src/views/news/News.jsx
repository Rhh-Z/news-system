import React, { useEffect } from 'react'
import request from '../../request/index'
import { PageHeader, Card, Col, Row, List } from 'antd'
import { useState } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
export default function News() {
  const [list, setList] = useState([])
  useEffect(() => {
    request.get('/news?publishState=2&_expand=category')
      .then(res => {
        setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
      })
  }, [])

  return (
    <div style={{
      width: '95%',
      margin: '0 auto'
    }}>
      <PageHeader
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看标题"
      />
      <div className="site-card-wrapper">
        <Row gutter={[16, 16]}>
          {
            list.map(item =>
              <Col span={8} key={item[0]}>
                <Card title={item[0]} bordered={true} hoverable={true}>
                  <List
                    size="small"
                    bordered
                    dataSource={item[1]}
                    pagination={{ size: 3 }}
                    renderItem={data => <List.Item>
                      <Link to={`/detail/${data.id}`}>{data.title}</Link>
                    </List.Item>}
                  />
                </Card>
              </Col>
            )
          }
        </Row>
      </div>
    </div>
  )
}
