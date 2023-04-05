import axios from 'axios'
import _ from '../assets/utils'
import {history} from "./history"

// 创建实例
const http = axios.create({
    baseURL: 'http://localhost:7100',
    timeout: 1000
})

// 添加请求拦截器
http.interceptors.request.use( config => {
    let token = _.storage.get('tk');
    if(token){
        config.headers.Authorization = token
    }
    return config
},error =>{
    console.dir(error)
    // 没有提供身份认证或身份认证失败
    if(error.response.status === 401){
        // 删除token
        _.storage.remove('tk')
        history.push('/login')
    }
    return Promise.reject(error)
})
// 响应拦截器
http.interceptors.response.use(response =>{
    return response.data
},error =>{
    return Promise.reject(error)
})



export default http