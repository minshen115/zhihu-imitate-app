import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
// 改变rem换算比例
import 'lib-flexible'
import './index.less'
import { Provider } from 'react-redux';
import store from './store';

// 处理最大宽度
(function(){
  const handleMax = () =>{
    let html = document.documentElement,
     root = document.getElementById('root'),
     deviceW = html.clientWidth;
    root.style.maxWidth = '750px';
    if(deviceW >= 750){ 
      html.style.fontSize = '75px';
    }
  };
  handleMax()
})();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>


);

