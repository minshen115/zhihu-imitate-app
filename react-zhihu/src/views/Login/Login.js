import React, { useEffect, useState } from "react";
import NavBarAgain from "../NavBarAgain";
import { Form,Input, Toast} from "antd-mobile";
import ButtonAgain from '../ButtonAgain';
import "./Login.less";
import http from "../../utils/http"
import _ from '../../assets/utils';
import {queryUserInfoAsync} from '../../store/baseSlice'
import { useDispatch } from 'react-redux'; 



/* 自定义表单校验规则 */
const validate = {
    phone(_, value) {
        value = value.trim();
        let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
        if (value.length === 0) return Promise.reject(new Error('手机号是必填项!'));
        if (!reg.test(value)) return Promise.reject(new Error('手机号格式有误!'));
        return Promise.resolve();
    },
    code(_, value) {
        value = value.trim();
        // 6位数字
        let reg = /^\d{6}$/;
        if (value.length === 0) return Promise.reject(new Error('验证码是必填项!'));
        if (!reg.test(value)) return Promise.reject(new Error('验证码格式有误!'));
        return Promise.resolve();
    }
};


function Login(props) {
    let { navigate,usp} = props

    const dispatch = useDispatch()
    const [formIns] = Form.useForm(),
          [disabled,setDisabled] = useState(false),
          [sendText, setSendText] = useState('发送验证码');

    const submit = async ()=>{
      try {
        await formIns.validateFields();
        let {phone , code } = formIns.getFieldValue();
        // console.log(values);
        let {code:codeHttp, token} = await http.post("/login",{ phone, code })
        if(+codeHttp !== 0){
          // 失败
          Toast.show({
            icon: 'fail',
            content: '登录失败'
          })
          formIns.resetFields(['code']);
          return;
        }
        // 登录成功:存储Token、存储登录者信息到redux、提示、跳转
        _.storage.set('tk',token);
        // console.log(token);
        dispatch(queryUserInfoAsync());//派发任务，同步redux中的信息状态
        Toast.show({
          icon: 'success',
          content: '登录/注册成功'
        });
        let to = usp.get('to');
        to ? navigate(to, {replace:true}) : navigate(-1);
      } catch (_) { }
      
    }

    // 发送验证码
    let timer =null,
     num = 31;

    const countdown = ()=>{
      num--;
      if(num === 0 ){
        clearInterval(timer);
        timer = null;
        setSendText('发送验证码');
        setDisabled(false);
        return;
      }
      setSendText(`${num}秒后重发`);
    }

    const send = async ()=>{
      try{
        await formIns.validateFields(['phone']);
        let phone = formIns.getFieldValue('phone');
        let {code,checkcode} = await http.post('/phone_code',{phone})

        // console.log("验证码",code,checkcode);
        formIns.setFieldValue('code',checkcode);
        // 发送失败
        if(+code !== 0 ){
          Toast.show({
            icon: 'fail',
            content: '发送失败'
          })
          return;
        } 
        // 发送成功
        setDisabled(true);
        // setSendText('重新发送')
        countdown();
        if(!timer) timer = setInterval(countdown,1000);
      }catch(_){ }

    }

    // 组件销毁时清除定时器
    useEffect(()=>{
      return()=>{
        if(timer){
          clearInterval(timer);
          timer = null;
        }
      }
    },[])

  return (
    <div className="login-box">
      <NavBarAgain title="登录/注册" />
      <Form
        layout="horizontal"
        style={{'--border-top':'none'}}
        footer={
          <ButtonAgain color='primary'
                        onClick={submit}>
                        提交
          </ButtonAgain>
        }
        form={formIns}
        initialValues={{phone:'',code:''}}
      >
          <Form.Item name='phone' label='手机号' rules={[{validator: validate.phone}]}>
          <Input placeholder='请输入手机号' />
          </Form.Item>

          <Form.Item name='code' label='验证码' rules={[{validator: validate.code}]}
          extra={
              <ButtonAgain size="small" color="primary" 
              disable={disabled}
              onClick={send}>
                  {sendText}
              </ButtonAgain>
          }>
              <Input placeholder='请输入验证码' />
          </Form.Item>


      </Form>
    </div>
  );
}

export default Login;
