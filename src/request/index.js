import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true
})

// 导出axios实例
export default request