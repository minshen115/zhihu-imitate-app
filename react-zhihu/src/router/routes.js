import { lazy } from "react";
import Home from "../views/Home/Home";
import { withKeepAlive } from 'keepalive-react-component';


const routes = [{
    name: 'home',
    path: '/',
    component: withKeepAlive(Home, { cacheId: 'home', scroll: true }),
    meta: {
        title: '知乎日报-webApp'
    }
},{
    name: 'detail',
    path: '/detail/:id',
    component: lazy(()=>import('../views/Detail/Detail')),
    meta: {
        title: '新闻详情-知乎日报'
    }
},{
    name: 'personal',
    path: '/personal',
    component: lazy(()=>import('../views/Personal/Personal')),
    meta: {
        title: '个人中心-知乎日报'
    }
},{
    name: 'login',
    path: '/login',
    component: lazy(()=>import('../views/Login/Login')),
    meta: {
        title: '登录/注册-知乎日报'
    }
},
{
    name: 'store',
    path: '/store',
    component: lazy(()=>import('../views/Store/Store')),
    meta: {
        title: '我的收藏-知乎日报'
    }
},{
    name: 'update',
    path: '/update',
    component: lazy(()=>import('../views/Update/Update')),
    meta: {
        title: '修改个人信息-知乎日报'
    }
},]

export default routes