import React from "react";
import {NavBar} from 'antd-mobile';
import "./NavBarAgain.less"
import { useNavigate,useLocation,useSearchParams} from "react-router-dom"

// 对NavBar做二次封装，处理一些复杂的业务逻辑
const NavBarAgain = function NavBarAgain(props){
    let { title } = props;
    const navigate = useNavigate(),
        location = useLocation(),
        [usp] = useSearchParams();

    const handleBack = ()=>{
        // 特殊:登录页 & to的值是/deatil/xxx
        let to = usp.get('to');
        if (location.pathname === '/login' && /^\/detail\/\d+$/.test(to)) {
            navigate(to, { replace: true });
            return;
        }
        navigate(-1);
    }

    return <NavBar onBack={handleBack}>
        {title}
    </NavBar>
}
NavBarAgain.defaultProps = {
    title: '个人中心'
}

export default NavBarAgain