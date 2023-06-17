import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../hooks/usePublish'
export default function Published() {
  const { dataSource, handelSunset } = usePublish(2)

  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button type='primary'
        onClick={() => handelSunset(id)}>下线</Button>}></NewsPublish>
    </div >
  )
}
