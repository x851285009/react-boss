import axios from 'axios';
// const BASE_URL = 'http://localhost:4000'

export default function ajax(url = '', data = {}, type = 'GET'){
    // url = BASE_URL + url;
    if(type === 'GET') {
        //准备url query参数数据
        let dataStr = '';//数据拼接字符串
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&';
        });
        if(dataStr !== '') {
            dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));//将最后一个多余的&符号去除
            url +=  '?' + dataStr;
        }
        return axios.get(url);
    } else {
        //post请求
        return axios.post(url, data);
    }
}