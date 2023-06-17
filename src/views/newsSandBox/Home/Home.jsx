import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined
} from '@ant-design/icons';
import request from '../../../request';
import { Link } from 'react-router-dom';
import * as echarts from 'echarts';
import _ from 'lodash'
const { Meta } = Card;

export default function Home() {
  const [mostView, setMostView] = useState([])
  const [mostLike, setMostLike] = useState([])
  const [pieChart, setPiechart] = useState(null)
  const [allList, setAllList] = useState([])
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  const barRef = useRef()
  const pieRef = useRef()
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
    setTimeout(async () => {
      // 显示抽屉时渲染饼状图
      renderPie(allList)
    }, 0)
  }


  const onClose = () => {
    setOpen(false);
  }


  useEffect(() => {
    request.get('/news?publishState=2&_expand=category&sort=view&order=desc&_limit=8')
      .then(res => {
        setMostView(res.data)
      })

    //组件销毁时清除onresize事件 
    return () => {
      window.onresize = null
    }
  }, [])

  useEffect(() => {
    request.get('/news?publishState=2&_expand=category&sort=star&order=desc&_limit=8')
      .then(res => {
        setMostLike(res.data)
      })
  }, [])

  useEffect(() => {
    request.get('/news?publishState=2&_expand=category').then(res => {
      renderBar(_.groupBy(res.data, item => item.category.title))
      setAllList(res.data)
    })
  }, [])

  const renderBar = (data) => {
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类示意图'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(data),
        axisLabel: {
          rotate: '45'
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(data).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    // 响应式
    window.onresize = () => {
      myChart.resize()
    }
  }


  const renderPie = (data) => {
    // 数据处理
    const currentList = data.filter(item => item.author === username)
    let gruopData = _.groupBy(currentList, item => item.category.title)
    console.log(gruopData);
    let list = []
    for (let key in gruopData) {
      list.push({
        name: key,
        value: gruopData[key].length
      })
    }

    // 判断是否已初始化
    var myChart
    if (!pieChart) {
      myChart = echarts.init(pieRef.current)
      setPiechart(myChart)
    } else {
      myChart = pieChart
    }
    var option;

    option = {
      title: {
        text: '当前用户新闻分类',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              dataSource={mostView}
              renderItem={item => (
                <List.Item>
                  <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8} >
          <Card title="用户最多点赞" bordered={true} >
            <List
              dataSource={mostLike}
              renderItem={item => (
                <List.Item >
                  <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => showDrawer()} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b style={{ marginRight: '20px' }}>{region ? region : ' 全球'}</b>
                  <span style={{ fontSize: '16px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer title="饼状图" placement="right" width={'500px'}
        onClose={onClose} open={open}>
        <div ref={pieRef} style={{ width: '100%', height: '30rem', marginTop: '1em' }}></div>
      </Drawer>
      <div ref={barRef} style={{ width: '100%', height: '30rem', marginTop: '1em' }}></div>
    </div>
  )
}
