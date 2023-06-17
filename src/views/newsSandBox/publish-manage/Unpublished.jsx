import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../hooks/usePublish'
export default function Unpublished() {
  const { dataSource, handelPublish } = usePublish(1)

  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button type='primary'
        onClick={() => handelPublish(id)}>发布上线</Button>}></NewsPublish>
    </div>
  )
}

