import React,{ Suspense }from "react";
import {Routes,Route,useNavigate,useLocation,useParams,useSearchParams, Navigate } from "react-router-dom" ;
import routes from "./routes";
import { Mask,DotLoading } from "antd-mobile";
import { useSelector } from "react-redux";

// 统一路由配置
// 是否需要检查登录
const isCheckLogin = (path,info)=>{
    // 要检查登录的页面
    let checkList = ['/personal','/store'];
    // 是与用户相关的界面并且当前无登录，返回true，否则返回false
    return !info && checkList.includes(path);
};

const Element = function Element(props){
    let{ component : Component, meta, path} = props
    // 解构得到用户信息
    let { info } = useSelector(state => state.base)
    // 要登录，则当前页面先不展示，不用登录，则展示页面
    let isShow = !isCheckLogin(path,info)
    // 修改页面title
    let {title = "知乎日报-webApp"} = meta || {}
    document.title = title

    // 获取路由信息，基于属性传给组件
    const navigate = useNavigate(),
        location = useLocation(),
        params = useParams(),
        [usp] = useSearchParams();
    return <>
    { (isShow || info ) ? 
        <Component navigate={navigate}
            location = {location}
            params = {params}
            usp = {usp} />: <Navigate replace={true} to={"/login"} state={{from :`${location.pathname}${location.search}`}}></Navigate>
        }
    </>
    
}

export default function RouterView(){
    return <Suspense fallback={<Mask visible={true} opacity="thick">
        <DotLoading color="white"></DotLoading>
        </Mask>}>
        <Routes>
            {routes.map((item) =>{
                let  {name, path} = item;
                return <Route key={name} 
                        path={path}
                        element={<Element {...item}/>}/>
            })}
        </Routes>
    </Suspense>
}