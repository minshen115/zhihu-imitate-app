import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../utils/http";

// 异步获取收藏列表
export const queryStoreListAsync = createAsyncThunk(
    'store/queryStoreListAsync',
    async()=>{
        console.log("###########queryStoreListAsync###########");
        const res = await http.get('/store_list');
        console.log("***storeList",res);
        return res.data;
    }
)

const storeSlice = createSlice({
    name: 'store',
    initialState: {
        list: null
    },
    reducers:{
        // 清空收藏列表
        clearStoreList: state =>{
            state.list = null;
        },
        // 移除某一项收藏
        removeStoreListById: (state,action)=>{
            if(Array.isArray(state.list)){
                state.list = state.list.filter(item =>{
                    return +item.id !== action.payload;
                });
            }
        }
    },
    extraReducers:
    (builder)=>{
        builder
            .addCase(queryStoreListAsync.fulfilled,(state,action)=>{
                state.list = action.payload;
                console.log("***state.list",state.list);
            })
    }
})

export const {clearStoreList,removeStoreListById} = storeSlice.actions;

export default storeSlice.reducer