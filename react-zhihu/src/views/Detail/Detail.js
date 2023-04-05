import React,{useState,useEffect, useMemo} from "react";
import "./Detail.less"
import { LeftOutline, MessageOutline ,LikeOutline,StarOutline,MoreOutline} from "antd-mobile-icons"
import { Badge, Toast } from "antd-mobile"
import http from "../../utils/http"
import SkeletonAgain from "../SkeletonAgain"
import { flushSync }from "react-dom"
import {useDispatch,useSelector} from "react-redux"
import {queryUserInfoAsync} from "../../store/baseSlice"
import {queryStoreListAsync, removeStoreListById} from "../../store/storeSlice"


function Detail(props){
    let { navigate,params,location } = props;


    // 定义状态
    let [info,setInfo] =useState(null),
        [extra,setExtra] = useState(null)

    // 插入css样式
    let link;
    const handleStyle = (result)=>{
        let { css } = result;
        // console.log("handlestyle",result);
        if(!Array.isArray(css)) return;
        css = css[0];
        if(!css) return;
        // 创建<LINK>导入样式
        link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = css;
        document.head.appendChild(link);
    };
    const handleImage = (result) =>{
        let imgPlaceHolder = document.querySelector('.img-place-holder');
        if(!imgPlaceHolder) return;
        let tempImg = new Image;
        tempImg.src = result.image;
        tempImg.onload = () =>{
            imgPlaceHolder.appendChild(tempImg);
        }
        tempImg.onerror = ()=>{
            let parent = imgPlaceHolder.parentNode;
            parent.parentNode.removeChild(parent);
        }
    }

    // 第一次渲染完毕：获取数据
    // 新闻详情
    useEffect(()=>{
        (async()=>{
            try{
                let result = await http.get("/news_info", {
                    params: {
                        id: params.id
                    }
                })
                // console.log(result);
                flushSync(()=>{
                    setInfo(result);
                    handleStyle(result);
                })
                handleImage(result);
            }catch(_){}
        })()

        // 销毁组件：移除创建的样式
        return()=>{
            if(link) document.head.removeChild(link);
        }
    },[])
    // 点赞评论
    useEffect(()=>{
        (async()=>{
            try{
                let result = await http.get("/story_extra",{
                    params: {
                        id: params.id
                    }
                })
                console.log(result);
                setExtra(result);

            }catch(_){}
        })()
    },[])

    // 登录/收藏
    const dispatch = useDispatch();
    let {list : storeList} = useSelector(state => state.store);
    let {info: userInfo} =useSelector(state=>state.base)

    useEffect(()=>{
        (async()=>{
            // 第一次渲染完，如果userInfo不存在，派发任务同步登录者信息。
            if(!userInfo){
                let { info } = dispatch(queryUserInfoAsync());
                userInfo = info;
            }
            // 如果已经登录 && 没有收藏列表信息：派发任务同步收藏列表
            if(userInfo && !storeList){
                dispatch(queryStoreListAsync())
            }
        })();
    },[])

    // 依赖于收藏列表和路径参数，计算是否收藏
    const isStore = useMemo(()=>{
        // 收藏列表为空
        if(!storeList) return false;
        // 不为空
        // some() 方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个 Boolean 类型的值。
        return storeList.some(item =>{
            return +item.news.id === +params.id;
        })
    },[storeList,params]);

    const handleStore = async()=>{
        // 未登录
        if(!userInfo){
            Toast.show({
                icon : 'fail',
                content: "请先登录"
            })
            navigate(`/login?to=${location.pathname}`,{replace:true});
        }
        // 已登录，收藏或者移除收藏
        if(isStore){
            // 移除收藏
            let item = storeList.find(item=>{
                return +item.news.id === +params.id;
            });
            if(!item) return;
            let { code } = await http.get("/store_remove",{
                params: {
                    id:item.id
                }
            });
            if(+code !==0){
                Toast.show({
                    icon:'fail',
                    content:'操作失败'
                });
                return;
            }
            Toast.show({
                icon:'success',
                content:'操作成功'
            });
            dispatch(removeStoreListById(item.id));//告诉redux也把这一项移除
            return;
        };
        // 收藏
        try {
            let { code } = await http.post("/store",{newsId : params.id})
            if(+code !== 0 ){
                Toast.show({
                    icon: 'fail',
                    content: '收藏失败'
                })
                return;
            }
            Toast.show({
                icon: 'success',
                content:'收藏成功'
            });
            dispatch(queryStoreListAsync())//同步最新的收藏列表到redux容器中
        } catch (_) { }
    }


    return (
        <div className="detail-box">
            {/* 新闻内容 */}
            {!info ? <SkeletonAgain /> : <div className="content" 
            dangerouslySetInnerHTML={{__html:info.body}}>

                </div>}
            
            {/* 底部图标 */}
            <div className="tab-bar">
                <div className="back" onClick={()=>{navigate(-1)}}>
                <LeftOutline />
                </div>
                <div className="icons">
                    <Badge content={extra ? extra.comments : 0}><MessageOutline /></Badge>
                    <Badge content={extra ? extra.popularity : 0}><LikeOutline /></Badge>
                    <span className={isStore ? 'stored' : ''} onClick={handleStore}><StarOutline /></span>
                    <span><MoreOutline /></span>
                </div>
            </div>
        </div>
    )
}

export default Detail;