import React,{useEffect} from "react";
import "./Store.less"
import "../NavBarAgain"
import NavBarAgain from "../NavBarAgain";
import {useDispatch,useSelector} from "react-redux"
import { SwipeAction, Toast } from "antd-mobile";
import "../Home/NewsItem"
import NewsItem from "../Home/NewsItem";
import "../SkeletonAgain"
import SkeletonAgain from "../SkeletonAgain";
import { queryStoreListAsync, removeStoreListById } from "../../store/storeSlice";
import http from "../../utils/http";

function Store(){
    const dispatch = useDispatch();
    let {list:storeList} = useSelector(state=>state.store)

    useEffect(()=>{
        // 第一次加载完毕:如果redux中没有收藏列表,则异步派发获取
        if(!storeList) dispatch(queryStoreListAsync())
    },[])

    // 移除收藏
    const handleRemove = async (id) =>{
        try {
            let {code} = await http.get('/store_remove',{
                params: {id}
            })
            if (+code !== 0){
                Toast.show({
                    icon:'fail',
                    content: '移除失败'
                })
                return;
            }
            Toast.show({
                icon: 'success',
                content: '移除成功'
            });
            dispatch(removeStoreListById(id));
        } catch (_) { }
    }
    

    return (
        <>
        <NavBarAgain title="我的收藏"/>
        { storeList ? 
        <div className="box">
            {storeList.map(item =>{
                let {id, news } = item;
                return <SwipeAction key={id} rightActions={[{
                    key: 'delete',
                    text: '删除',
                    color: 'danger',
                    onClick: handleRemove.bind(null,id)
                }]}>
                    <NewsItem info={news}/>
                </SwipeAction>
            })}
        </div>:
        <SkeletonAgain />}
        </>
    )
}

export default Store;