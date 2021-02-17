import axios from 'axios'
import qs from 'qs'

var fastParser = require('fast-xml-parser')
var he = require('he')


// 创建 axios 实例
const request = axios.create({
    // API 请求的默认前缀
    baseURL: "https://card.qzone.qq.com/cgi-bin", //process.env.VUE_APP_API_BASE_URL,
    withCredentials: true,
    timeout: 1000 // 请求超时时间
})

// request interceptor
request.interceptors.request.use(config => {
    if (config.type == 'formData' || config.method != 'post') {
        return config
    }
    config.data = qs.stringify(config.data)

    config.headers['Content-type'] = 'application/x-www-form-urlencoded'

    return config
})

// response interceptor
request.interceptors.response.use((response) => {
    var options = {
        attributeNamePrefix: '',
        attrNodeName: false, //default is 'false'
        textNodeName: '#text',
        ignoreAttributes: false,
        ignoreNameSpace: false,
        allowBooleanAttributes: false,
        parseNodeValue: true,
        parseAttributeValue: false,
        trimValues: true,
        cdataTagName: 'QQHOME', //default is 'false'
        cdataPositionChar: '\\c',
        parseTrueNumberOnly: false,
        arrayMode: false, //"strict"
        attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
        tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
        stopNodes: ['parse-me-as-string']
    }
    if (fastParser.validate(response.data) === true) { //optional (it'll return an object in case it's not valid)
        var jsonObj = fastParser.parse(response.data, options)
        if (jsonObj.QQHOME.code === '0') {
            // console.log(jsonObj.QQHOME)
            return jsonObj.QQHOME
        }

    }
})


export default request

export {
    //   installer as VueAxios,
    request as axios
}
