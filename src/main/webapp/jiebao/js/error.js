/**
 * API对应Error处理类
 * @class JlrError
 */
const CODE_MAP = {
    SUCCESS: 0
}
const APP_ERROR = {
    LoginPop: {"errorCode": 5001, "errorMessage": "QA环境报错,LoginPop拉起异常"},
    DestError: {"errorCode": 5002, "errorMessage": "QA环境报错,获取目的地异常"},
    NoMockData: {"errorCode": 5003, "errorMessage": "DEV环境报错,没有模拟数据"}
}
class JlrError {
    constructor() {

    }

    /**
     * @description CP的错误码
     * @function JlrError.CP_CODE
     * @static
     * @return {number}
     */
    static get CP_CODE() {
        return 1308;
    }

    /**
     * @description CP的系统错误集合
     * @return Array
     * @static
     * @function JlrError.CPSystemErrorCode
     */
    static get CPSystemErrorCode() {
        //code mapping中整理的错误列表
        return [1, 2, 3, 4, 5, 6, 7, 8, 20100, 20101, 20102, 20106, 20208, 20408, 20501, 21001, 21002]
    }


    /**
     * @description 判断是否属于CP的错误
     * @function JlrError.isCPsystemError
     *  @static
     * @param codeArray
     */
    static  isCPsystemError(codeArray) {
        //codeArray中有一个存在在系统错误列表中，那么就判断为系统错误
        codeArray.forEach(i => {
            if (JlrError.CPSystemErrorCode.indexOf(i) >= 0) {
                return true;
            }
        })
    }

    /**
     * @description 错误类型判断及弹出Pop-up
     * @function JlrError.notifyError
     * @static
     * @param response
     * @param api
     */
    static notifyError(response, api) {
        let errorCode = JlrError.getErrorCode(response);
        console.log(errorCode)
        /* {
         cccode: 1308,
         cpcode:[20102,3]
         }*/
        if (errorCode && errorCode.cccode) {
            if (errorCode.cccode !== JlrError.CP_CODE) {
                //非1308错误
                JlrError.CCcommonError();
            }
            else {
                if (errorCode.cpcode && errorCode.cccode === JlrError.CP_CODE) {//如果存在CP错误
                    //如果provider的长度为2即为业务错误
                    if (errorCode.cpcode.length >= 2) {
                        JLRNotify.open(api.error);
                    }
                    else {
                        //如果不是系统错误及为业务错误
                        if (JlrError.isCPsystemError(errorCode.cpcode)) {
                            JLRNotify.open(api.error.system)
                            // JLRNotify.open(notifyType.CP_SYSTEM_COMMON_ERROR)
                        }
                        else {
                            JLRNotify.open(api.error.business);
                        }
                    }
                }
                else {
                    //1308错误但CPcode不存在
                    JlrError.CCcommonError();
                }
            }
        }
        else {
            //错误码解析失败
            JlrError.CCcommonError();
        }
    }

    /**
     *@description CC的系统错误
     * @function JlrError.CCcommonError
     * @static
     */
    static CCcommonError() {
        JLRNotify.open(notifyType.CCCommonError);
    }

    /**
     *@description  解析response获取错误码
     * @param response
     * @static
     * @function JlrError.getErrorCode
     * @return {{cccode: undefined, cpcode: undefined}}
     */
    static getErrorCode(response) {
        let errorcode = {
            cccode: undefined,
            cpcode: undefined
        }
        if (response && response.code && response.errorData) {
            errorcode.cccode = response.code;
            if (response.providers && response.providers.length > 0) {
                let cpcodeArray = [];
                response.providers.forEach(providername => {
                    //response.errorData[providername].code===0的时候回出bug
                    if (response.errorData[providername] && response.errorData[providername].code) {
                        cpcodeArray.push(response.errorData[providername].code)
                    }
                })
                errorcode.cpcode = cpcodeArray;
            }
        }
        return errorcode;
    }


    /**
     * @description 判断是否是phoenix错误
     *  @static
     * @function JlrError.isPhoenix
     * @param errorObj
     * @return {boolean}
     */
    static isPhoenix(errorObj) {
        if ("errorCode" in errorObj) {
            return true;
        }
    }


    /**
     * @description dev模式下打印错误在控制台和simulator界面
     * @function JlrError.print
     * @static
     * @param errorObj
     */
    static print(errorObj) {
        try {
            if (JlrError.isPhoenix(errorObj)) {
                if (!phoenix) {
                    console.warn("phoenix  is no defined")
                    return;
                }
                if (errorObj.errorCode >= 5000) {
                    JLRNotify.open({
                        contentTitle: "QA环境错误-" + errorObj.errorCode,
                        behavior: 'persistent',
                        category: 'reminder',
                        priority: 'default',
                        contentText: errorObj.errorMessage,
                        timeout: 4000
                    })
                }
                else {
                    JLRNotify.open(notifyType.PhoenixError);
                }
            }
            //if the debug model is on
            console.error("jlrError:", errorObj)
        }
        catch (e) {
            console.error(e)
        }

    }

    /**
     * @description 通用的错误处理模式
     *  @static
     * @function JlrError.catchError
     * @param errorObj
     */
    static  catchError(errorObj) {
        //only string or Object can be processed
        //string will be a customer error  from developer
        //object will be a phoenix error or  js error
        if (typeof errorObj !== "string" && typeof errorObj !== "object") {
            console.warn("unknow error type:", errorObj)
            return;
        }
        JlrError.print(errorObj)
    }
}