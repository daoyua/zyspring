/**
 * Created by sunxinhan on 2019/8/13.
 */


/**
 * JLRAPI
 * @class
 */
class JLRAPI {
    constructor() {

    }

    /**
     * Url Object list
     * @property {List.Object}  url object list
     */
        //todo:在测试结束后上线前需要删除devurl

    static get api() {
        //todo:在测试结束后上线前需要删除devurl
        return {
            PASSCODE: {
                url: '/authentication/passcode',
                method: 'POST',
                params: {
                    passcode: undefined,
                },
            },
            SEND_VERIFICATION_CODE: {
                url: '/user/phone',
                devurl: './mock/uservechile.json',
                method: 'GET',
                params: {
                    phoneNumber: undefined,
                    countryCode: undefined
                },
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.PhoneVcodeError,
                }
            },
            VERIFY_VERIFICATION_CODE: {
                url: '/user/phone',
                devurl: './mock/uservechile.json',
                method: 'POST',
                params: {
                    phoneNumber: undefined,
                    countryCode: undefined,
                    code: undefined
                },
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.PhoneVcodeError,
                }
            },
            GET_USER_VEHICLE_INFO: {
                url: '/parking/vehicle',
                devurl: './mock/uservechile.json',
                method: 'GET',
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.PhoneVcodeError,
                }
            },
            REGISTER_VEHICLE: {
                url: '/parking/vehicle',
                devurl: './mock/regstervechile.json',
                method: 'POST',
                params: {
                    providers: undefined,
                    plateNumber: undefined,
                    phoneNumber: undefined,
                    countryCode: undefined,
                },
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.VechileInfoFail,
                }
            },
            UNREGISTER_VEHICLE: {
                url: '/parking/vehicle',
                method: 'DELETE',
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.VechilesetupError,
                }
            },
            SET_PIN_FREE: {
                url: '/parking/pinFree',
                devurl: './mock/pinfree.json',
                method: 'POST',
                params: {
                    provider: undefined
                },
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.VechilesetupError,
                }
            },
            UNSET_PIN_FREE: {
                url: '/parking/pinFree',
                method: 'DELETE',
                params: {
                    provider: undefined
                },
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.VechilesetupError,
                }
            },
            PAY_MANUALLY: {
                url: '/parking/pinFree',
                method: 'PUT',
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.VechilesetupError,
                }
            },
            PARKING_STATUS: {
                url: '/parking/status',
                method: 'GET',
                devurl: './mock/parknow.json',
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.VechilesetupError,
                }
            },
            PAY_DEBT: {
                url: '/parking/pinFree',
                method: 'GET',
                params: {
                    orderId: undefined,
                    payType: undefined
                },
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.VechilesetupError,
                }
            },
            GET_HISTORY_LIST: {
                url: '/place/recents',
                devurl: './mock/history.json',
                method: 'GET',
                params: {
                    type: undefined
                },
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.VechilesetupError,
                }
            },
            DELETE_HISTORY: {
                url: '/place/recents',
                devurl: './mock/history.json',
                method: 'DELETE',
                params: {
                    toDeleteAll: undefined
                },
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.HistoryDel_Error,
                }
            },
            DETAIL_PARKING: {
                url: '/place/details',
                devurl: './mock/parkdetail.json',
                method: 'GET',
                params: {
                    provider: undefined,
                    id: undefined,
                    schema: undefined,
                    placeType: undefined,
                },
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.HistoryDel_Error,
                }
            },
            SEARCH_PARKING: {
                url: '/place/search',
                devurl: './mock/searchlist.json',
                method: 'POST',
                params: {
                    provider: undefined,
                    id: undefined,
                    schema: undefined,
                    placeType: undefined
                },
                error: {
                    system: notifyType.CP_SYSTEM_COMMON_ERROR,
                    business: notifyType.HistoryDel_Error,
                }
            },
            NOTIFICATION_SESSION_PARK: {
                url: '/events/place',
                method: 'POST'
            },

            TERMS_CONDITION: {
                // url: './staticpage/tc.html',
                // url: 'http://40.73.16.153/web/termsconditions.html'
                url: 'https://s3.amazonaws.com/assets.cloudcar.com/provider_assets/future_move/tc.html',
            }
        }
    }

    /**
     * 根据Method和环境进行url拼接
     * @param api {JLR.api} api Object
     * @return {string} 完整的url信息
     */
    static  getUrl(api) {
        //todo:此处应在上线前做修改，目前方便调试
        if (api.url.lastIndexOf('.json') >= 0) {
            return api.url;
        }
        else {
            if (api.method === "GET") {
                return window.env_qa.requestDomain + JLRAPI.urlParams(api.url, api.params);
            }
            else {
                return window.env_qa.requestDomain + api.url;
            }
        }
    }

    /**
     * 处理get请求,将参数拼接到url后
     * @param url {string} url链接
     * @param params {object} josn对象,需要传输的数据
     * @return {string} url
     */
    static  urlParams(url, params) {
        if (params) {
            let paramsArray = [];
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        return url;
    }


    /**
     * 共用的数据请求function
     * @param api {JLRApi.api} api对象，包含method,url
     * @param params 需要传递的参数
     * @return promise
     */
    static async commonRequest(api, params) {
        try {
            // todo:测试结束或者上线前需要删除
            if (window.ENV === "dev") {
                let wait_res = await DEV.wait()
                let result = {};
                if (api.mockData) {
                    result = api.mockData;
                }
                else {
                    result = {
                        code: 5002
                    }
                }
                if (result && result.code !== 0) {
                    JlrError.notifyError(result, api)
                }
                return result;

            }
            else {
                api.params = params;
                let result = await  JLRAPI.request(api);
                if (result && result.code !== 0) {
                    console.log("commonRequest", result, api)
                    JlrError.notifyError(result, api)
                }
                return result;
            }
        }
        catch (e) {
            console.log(e)
        }
    }


    static async request(api) {
        try {
            let url = JLRAPI.getUrl(api);
            let parmas = api.params ? api.params : {};
            let res = await fetch(url, {
                method: api.method,
                headers: {
                    'Accept': 'application/json',
                    'appid': window.env_qa.appid,
                    'content-type': 'application/json',
                    'productID': window.env_qa.productID,
                    'productVersion': window.env_qa.productVersion,
                },
                body: api.method !== "GET" ? JSON.stringify(parmas) : undefined
            });
            if (res.ok) {
                return await res.json();
            }
            else {

            }
        }
        catch (e) {
            console.log(e)
        }
    }

    /**
     * 请求服务器上的html文件
     * @param api {JLRApi.api} api对象,包含url
     * */
    static async getStaticHtml(url) {
        // let url = JLRAPI.getUrl(api);
        try {
            let res = await  fetch(url, {
                method: 'get'
            });
            return await res.text();
        }
        catch (e) {
            console.log(e)
        }
    }


    static async ETCP_EnterParkingLot() {
        try {
            let res = await  fetch("https://cn-staging.cloudcar.oneiotworld.com/api/internal/etcp/carSimulation", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'cc-cookie': 'spoof:898e6ec3-dc0f-360a-8a98-bba23fb9ed9b:JPIVI_CN:browser:cloudcar',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({"plateNumber": "京AG9999"})
            });
            return await res.json();
        }
        catch (e) {
            console.log(e)
        }
    }

    /**
     * 删除所有所有历史记录的方法
     * @return {Promise.<void>}
     */
    static async deleteAllHistory() {
        let history_debt = await  JLRAPI.commonRequest(JLRAPI.api.GET_HISTORY_LIST);
        let hasDebt = false;

        for (let i = 0; i < history_debt.length; i++) {
            if (history_debt[i] && history_debt[i].order && history_debt[i].order.isDebt) {
                hasDebt = true;
            }
        }

        if (hasDebt) {
            //todo:需要定制notifyType
            JLRNotify.open(notifyType.Destination)
        }
        else {
            await  JLRAPI.commonRequest(JLRAPI.api.DELETE_HISTORY)
        }

    }


    static async unbind_user_vechile() {
        //检查是否在停车场内
        //检查是否有坏账信息
        //解绑车辆接口调用
    }

}