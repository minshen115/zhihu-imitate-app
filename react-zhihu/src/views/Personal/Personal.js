import NavBarAgain from "../NavBarAgain"
import { Link, useNavigate } from "react-router-dom"
import { Toast } from "antd-mobile";
import { RightOutline } from 'antd-mobile-icons';
import _ from '../../assets/utils';
import { useSelector, useDispatch } from "react-redux";
import { clearUserInfo } from "../../store/baseSlice";
import "./Personal.less"

function Personal(){
    let { info } =useSelector(state=>state.base)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    // 退出登录
    const signout = ()=>{
        // 清除redux中的信息
        dispatch(clearUserInfo());
        // 清除token
        _.storage.remove('tk');
        // 提示
        Toast.show({
            icon: 'success',
            content:'您已安全退出'
        })
        // 跳转
        navigate('/login?to=/personal',{replace: true});
    }

    return (
        <>
            <NavBarAgain title="个人中心" />
            <div className="baseInfo">
                <Link to='/update'>
                    <img className="pic" src={info.pic} alt="" />
                    <p className="name">{info.name}</p>
                </Link>
            </div>
            <div>
                <Link to='/store' className="tab">
                    我的收藏
                    <RightOutline />
                </Link>
                <div className="tab" onClick={signout}>
                    退出登录
                    <RightOutline />
                </div>
            </div>
        </>
    )
}

export default Personal;