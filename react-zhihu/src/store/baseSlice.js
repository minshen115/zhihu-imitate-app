import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/http";

// 异步请求
export const queryUserInfoAsync = createAsyncThunk(
    'base/queryUserInfo',
    async ()=>{
        const res = await http.get('/user_info');
        return res.data;
    }
)

const baseSlice = createSlice({
    name: 'base',
    initialState: {
        info: null,
    },
    reducers: {
        clearUserInfo: state =>{
            state.info = null;
        }
    },
    extraReducers:
    builder =>{
        builder
        .addCase(queryUserInfoAsync.fulfilled,(state,action)=>{
            state.info = action.payload;
            console.log("state.info:",state.info);
        })
    }
})

export const{ clearUserInfo } = baseSlice.actions

export default baseSlice.reducer