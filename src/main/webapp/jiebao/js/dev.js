async function loaddev() {
    window.scope.localLanguage = "en-US";
    window.scope.debtCount = 5;
    window.scope.locale = {
        t: (keys, values) => {
            let page = keys.split('.')[1];
            let words = keys.split('.')[2];
            if (words) {
                let result = window.env_dev.translateObj[window.scope.localLanguage][page][words];
                if (values) {
                    Object.keys(values).forEach((key) => {
                        result = result.replace(`%{${key}}`, values[key])
                    })
                }
                return result;
            }
            else {
                let result = window.env_dev.translateObj[window.scope.localLanguage][page];
                if (values) {
                    Object.keys(values).forEach((key) => {
                        result = result.replace(`%{${key}}`, values[key])
                    })
                }
                return result;
            }
        }
    };
    if (!window.env_dev.translateObj) {
        window.env_dev.translateObj = await Common.requestGet(`./locales/${window.scope.localLanguage}/translations.json`);
    }
}
/**
 * api dev environment
 * @global
 */
window.env_dev = {
    translateObj: "",
    requestDomain: "http://localhost:11000/api/v1",
    appid: "PARKING_APP_CN",
    productID: "JIPIVI_CN",
    productVersion: "2.0",
}

phoenix.net = {
    NetworkType: {
        Offline: 'offline'
    },
    networkManager: {
        onconnectionchange: () => {

        },
        isConnected: () => {
            return true;//链接默认开启
        }
    }
}
phoenix.users = {
    userManager: {
        availableUsers: async () => {
            return phoenix.user;
        },
        userLoginStateChange: function () {

        },
        addEventListener(e, func){
            this.userLoginStateChange = func;
        },
        userProfile: async function () {
            function buildUser(name, loginstate) {
                let active_class = loginstate === "user-authenticated" ? "dev_login_active dev_user_name" : "dev_user_name"
                return `<div class="${active_class}" data-state="${loginstate}" class="dev_user_name">${name}</div>`;
            }

            let _login_div = document.createElement("div");
            _login_div.className = "dev_login_class";
            _login_div.innerHTML += `<div class="dev_back_appdrawer"></div><div class="dev_btn_area"></div>`;
            for (let i = 0; i < phoenix.user.length; i++) {
                _login_div.innerHTML += buildUser(phoenix.user[i].name, phoenix.user[i].userstate)
            }

            document.body.appendChild(_login_div);
            document.querySelector(".dev_back_appdrawer").onclick = function () {
                document.querySelector(".dev_login_class").remove()
            }
            document.querySelectorAll(".dev_user_name").forEach(i => {
                i.onclick = function () {
                    let user_btn = document.querySelector(".dev_btn_area");
                    let user_btn_text = i.dataset.state === phoenix.oem.jlr.types.PlatformLoginState.UserAuthenticated ? "logout" : "login";
                    let _html = `<div id="dev_btn_${user_btn_text}" data-username="${i.innerText}" data-action="${user_btn_text}" class="dev_login_btn">${i.innerText}-${user_btn_text}</div>`;
                    user_btn.innerHTML = _html;
                    if (user_btn_text === "login") {
                        document.querySelector("#dev_btn_login").onclick = async function () {
                            for (let i = 0; i < phoenix.user.length; i++) {
                                if (phoenix.user[i].name === this.dataset.username) {
                                    document.querySelectorAll(".dev_user_name")[i].dataset.state = phoenix.oem.jlr.types.PlatformLoginState.UserAuthenticated
                                    document.querySelectorAll(".dev_user_name")[i].className = "dev_login_active dev_user_name"
                                    await phoenix.user[i].login()
                                }
                                else {
                                    document.querySelectorAll(".dev_user_name")[i].className = " dev_user_name"
                                    document.querySelectorAll(".dev_user_name")[i].dataset.state = "user-confrimed"

                                    if (phoenix.user[i].userstate === phoenix.oem.jlr.types.PlatformLoginState.UserAuthenticated) {
                                        await phoenix.user[i].logout()
                                    }
                                }
                            }
                        }
                    }
                    else {
                        document.querySelector("#dev_btn_logout").onclick = async function () {
                            for (let i = 0; i < phoenix.user.length; i++) {
                                document.querySelectorAll(".dev_user_name")[i].className = " dev_user_name"
                                document.querySelectorAll(".dev_user_name")[i].dataset.state = "user-confrimed"
                                if (phoenix.user[i].name === this.dataset.username) {
                                    await phoenix.user[i].logout()
                                }
                            }
                        }
                    }


                }

            })
            return "success"
        },
        requestLoginPrompt: async function () {
            function buildUser(name, loginstate) {
                let active_class = loginstate === "user-authenticated" ? "dev_login_active dev_user_name" : "dev_user_name"
                return `<div class="${active_class}" data-state="${loginstate}" class="dev_user_name">${name}</div>`;
            }

            let _login_div = document.createElement("div");
            _login_div.className = "dev_login_class";
            _login_div.innerHTML += `<div class="dev_btn_area"></div>`;
            for (let i = 0; i < phoenix.user.length; i++) {
                _login_div.innerHTML += buildUser(phoenix.user[i].name, phoenix.user[i].userstate)
            }

            document.body.appendChild(_login_div);
            document.querySelectorAll(".dev_user_name").forEach(i => {
                let that = this;
                i.onclick = function () {
                    let user_btn = document.querySelector(".dev_btn_area");
                    let user_btn_text = i.dataset.state === phoenix.oem.jlr.types.PlatformLoginState.UserAuthenticated ? "logout" : "login";
                    let _html = `<div id="dev_btn_${user_btn_text}" data-username="${i.innerText}" data-action="${user_btn_text}" class="dev_login_btn">${i.innerText}-${user_btn_text}</div>`;
                    user_btn.innerHTML = _html;
                    if (user_btn_text === "login") {
                        document.querySelector("#dev_btn_login").onclick = async function () {
                            for (let i = 0; i < phoenix.user.length; i++) {
                                if (phoenix.user[i].name === this.dataset.username) {
                                    await phoenix.user[i].login()
                                    await that.userLoginStateChange(phoenix.user[i])
                                }
                                else {
                                    if (phoenix.user[i].userstate === phoenix.oem.jlr.types.PlatformLoginState.UserAuthenticated) {
                                        await phoenix.user[i].logout()
                                    }
                                }
                            }
                        }
                    }
                    else {
                        document.querySelector("#dev_btn_logout").onclick = async function () {
                            for (let i = 0; i < phoenix.user.length; i++) {
                                if (phoenix.user[i].name === this.dataset.username) {
                                    await phoenix.user[i].logout()
                                    await that.userLoginStateChange(phoenix.user[i])
                                }
                            }
                        }
                    }


                }

            })
            return "success"
        }
    },

}
async function isLoggedIn() {
    return this.userstate;
}
async function login() {
    this.userstate = "user-authenticated"
}
async function logout() {
    this.userstate = "user-confrimed"
}

phoenix.user = [
    {
        userstate: "user-confrimed",
        name: "沙和尚",
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        addEventListener: function () {

        }
    },
    {
        userstate: "user-authenticated",
        name: "孙悟空",
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        addEventListener: function () {

        }
    },
    {
        userstate: "user-confrimed",
        name: "猪八戒",
        _user: this,
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        addEventListener: function () {

        }
    }
]
phoenix.sys.input.inputManager = {
    oninputevent: () => {
    }

}
phoenix.sys.settings.settingsManager = {
    addEventListener: (key, fun) => {

    },
    getValue: function () {

    }
}
phoenix.sys.persistency.appStorage = {
    setItem: function (key, value) {
        localStorage.setItem(key, value)
    },
    getItem: function (key) {
        return localStorage.getItem(key);
    }
}

const exData = {
    parkingExit: {
        "sysData": {
            "time": 1572934364324,
            "type": "SendToAppWithLaunch",
            "messageUuid": "1eebe42e-9747-492e-b692-77b32dc4326b",
            "target": {
                "applicationUuid": "cc.parking.exit",
                "userId": "1307"
            },
            "readReceipt": "https://sgw.qa1-chn-ci.jlrmotor.com/notifications/v1.0/messages/1eebe42e-9747-492e-b692-77b32dc4326b/ack",
            "options": {
                "cspEventUuid": "01b2ed52-ebc2-4e1f-8ef0-c9b7f8269d79"
            }
        },
        "appData": {
            "data": {
                "provider": "tjd",
                "orderId": "9ff3ff11bc804d7583fd0ddf8e3984b1",
                "plateNumber": "京AG9999",
                "locationId": "7715622dff834b34a44448b801c27607",
                "locationName": "开发停车场25",
                "exitTime": 1572934110000,
                "entryTime": 1572934370000,
                "currency": "CNY",
                "parkAmount": 0.02
            },
            "notificationType": "parkingExit",
            "timestamp": 1572934364003
        }
    },
    parkingEnter: {
        "sysData": {
            "time": 1572934364324,
            "type": "SendToAppWithLaunch",
            "messageUuid": "1eebe42e-9747-492e-b692-77b32dc4326b",
            "target": {
                "applicationUuid": "cc.parking.enter",
                "userId": "1307"
            },
            "readReceipt": "https://sgw.qa1-chn-ci.jlrmotor.com/notifications/v1.0/messages/1eebe42e-9747-492e-b692-77b32dc4326b/ack",
            "options": {
                "cspEventUuid": "01b2ed52-ebc2-4e1f-8ef0-c9b7f8269d79"
            }
        },
        "appData": {
            "data": {
                "provider": "tjd",
                "orderId": "9ff3ff11bc804d7583fd0ddf8e3984b1",
                "plateNumber": "京AG9999",
                "locationId": "7715622dff834b34a44448b801c27607",
                "locationName": "开发停车场25",
                "exitTime": 1572934110000,
                "entryTime": 1572934370000,
                "currency": "CNY",
                "parkAmount": 0.02
            },
            "notificationType": "parkingEnter",
            "timestamp": 1572934364003
        }
    }
}
let intent_data = {}
let intent_action = ""
phoenix.intents = {
    intent: {
        setData: (data) => {
            intent_data = data;
        },
        setAction: (data) => {
            intent_action = data;
        },
        action: async () => {
            return intent_action;
        },
        data: async () => {
            return intent_data;
        }
    }
}
phoenix.intents.intentManager = {

    onintent: async (intent, publisherContext, context) => {

    }
}
let _destList = {
    "beijing": {
        longitude: 116.420498,
        latitude: 39.882241
    },
    "shanghai": {
        longitude: 121.430157,
        latitude: 31.153463
    },
    "qingkong": undefined
}
let dest = {}
function Map() {
    return {
        setDestinations: function (position) {
            if (position) {
                dest = _destList[position]
            }
        },
        activeRoute: async function () {
            return {
                destination: async function () {
                    return {
                        coordinates: async function () {
                            return dest;
                        }
                    }
                }
            }
        }
    }
}

phoenix.maps = {
    Location: function () {

    },
    Map: Map
};


phoenix.sys.notifications.notificationManager = {
    create: (obj) => {
        return {
            onnotificationaction: (e) => {
                console.log('onnotificationaction', e)
            },
            show: () => {
                document.querySelector(".notification").style.display = "flex"
                document.querySelector(".notification").style.zIndex = "10"
                document.querySelector(".contentTitle").innerText = obj.contentTitle
                document.querySelector(".contentText").innerText = obj.contentText
                document.querySelector(".notification_close").addEventListener("click", function () {
                    document.querySelector(".notification").style.display = "none"
                    document.querySelector(".notification").style.zIndex = "0"

                })
                setTimeout(function () {
                    document.querySelector(".notification").style.display = "none"
                    document.querySelector(".notification").style.zIndex = "0"
                }, 4000)
            },
            addEventListener: function () {

            }
        }
    },


}
phoenix.wfc = {
    ApplicationState: {
        Launching: "lanuching"
    },
    application: {
        state: "",
        stateEvent: function (e, event) {
            console.log("application", event)
        },
        addEventListener: async function (e, event) {
            this.stateEvent = event;
            if (window.scope.appstatus === APP_STATUS.LANUCHEND) {
                await  event("focusGain")
            }
            else {
                await  event("lanuching")
            }
        },
        requestToForeground: async function () {
            console.log("requestToForeground");
            if (document.querySelector("#dev_background")) {
                document.querySelector("#dev_background").remove();
            }
            if (document.querySelector(".dev_login_class")) {
                document.querySelector(".dev_login_class").remove();
            }
            await this.stateEvent("focusGain")
        },
        requestToBackground: async function () {
            await this.stateEvent("focusLost")
            console.log("requestToBackground")
            let div_1 = document.createElement("div");
            div_1.innerHTML = `<div id="dev_background">
            <div class="app_item"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">PARK</div></div>
            <div class="app_item"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">Accout</div></div>
            <div class="app_item"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">导航到天安门</div></div>
            <div class="app_item"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">清空目的地</div></div>
            <div class="app_item" data-notify="parkingEnter"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">入场</div></div>
            <div class="app_item" data-notify="parkingExit"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">出场</div></div>
            <div class="app_item" data-notify="parkingActiveSession"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">在场-启动车辆</div></div>
            <div class="app_item" data-notify="parkingAutoPay"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">免密支付成功</div></div>
            <div class="app_item" data-notify="parkingAutoPayFail"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">免密支付失败</div></div>
            <div class="app_item" data-notify="parkingQRCodePay"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">扫码支付成功</div></div>
            <div class="app_item" data-notify="parking.autoPaymentBind"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">免密支付绑定</div></div>
            <div class="app_item" data-notify="parking.autoPaymentUnbind"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">免密支付解绑</div></div>
            <div class="app_item" data-notify="parkingDebtPay"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">支付坏账</div></div>
            <div class="app_item" data-notify="parkingDebtCreate"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">产生坏账</div></div>
            <div class="app_item" data-notify="parkingPaymentOvertime"> <div class="app_icon"><span class="logo">P</span></div><div class="app_name">支付超时账单</div></div>
            </div>`
            document.body.append(div_1.children[0])
            document.querySelectorAll(".app_item")[0].addEventListener("click", async function () {
                await phoenix.wfc.application.requestToForeground()
            })
            document.querySelectorAll(".app_item")[1].addEventListener("click", async function () {
                await  phoenix.users.userManager.userProfile();
            })
            document.querySelectorAll(".app_item")[2].addEventListener("click", async function () {
                let map = new phoenix.maps.Map();
                map.setDestinations("beijing")

                let route = await map.activeRoute();
                let location = await route.destination();
                let coordinates = await location.coordinates();
                console.log("设置完成", coordinates)
            })
            document.querySelectorAll(".app_item")[3].addEventListener("click", async function () {
                let map = new phoenix.maps.Map();
                map.setDestinations("qingkong")
                let route = await map.activeRoute();
                let location = await route.destination();
                let coordinates = await location.coordinates();
                console.log("设置完成", coordinates)
            })
            document.querySelectorAll(".app_item")[4].addEventListener("click", async function () {
                OBN_notification.parkingEnter()
            })
            document.querySelectorAll(".app_item")[5].addEventListener("click", async function () {
                OBN_notification.parkingExit()
            })
        }
    },
    ApplicationManager: function () {
        return {
            applicationSettings: async function () {
                return {
                    addEventListener: function () {

                    }
                }
            }
        }
    }

}
OBN_notification = {
    parkingEnter: async function () {
        let time = Math.ceil(Math.random() * 10);
        setTimeout(async function () {
            let im = phoenix.intents.intent;
            im.setAction("CI_OBN_EVENT");
            im.setData(exData.parkingEnter);
            JLRAPI.api.PARKING_STATUS.mockData = {
                "code": 0,
                "requestId": "e235986f-45b3-be76-6200-ed7474594a64",
                "timestamp": 1572077528716,
                "domainId": "place",
                "data": {
                    "active": true,
                    "orderId": "4f9fd8cd5feb438ea426e2d3a588cfd3",
                    "plateNumber": "京AG9999",
                    "parkingId": "7715622dff834b34a44448b801c27607",
                    "parkingName": "开发停车场25",
                    "provider": "tjd",
                    "enteringTime": 1572077515000,
                    "parkTime": 21,
                    "parkingFee": "0.02",
                    "paidFee": "0",
                    "payManual": false,
                    "remainingFee": "0.02",
                    "payUrls": [
                        {
                            "type": "",
                            "payUrl": "https://prep.tingjiandan.com/tcweixin/letter/prePay/pagePayInPark?prePayType=16&channel=30107&isShowDetail=true&partnerId=&orderId=e576e1147bbe4168a55dbe5f0a6cd2a9&returnUrl="
                        }
                    ]
                },
                "cccontext": {
                    "requestId": "e235986f-45b3-be76-6200-ed7474594a64",
                    "sessionId": "9993037a-00d4-0c4d-72a5-a50e90a5d644"
                }
            }
            await  phoenix.intents.intentManager.onintent(im);
        }, time * 1000)

    },
    parkingExit: async function () {
        let time = Math.ceil(Math.random() * 10);
        setTimeout(async function () {
            let im = phoenix.intents.intent;
            im.setAction("CI_OBN_EVENT");
            im.setData(exData.parkingExit);
            JLRAPI.api.PARKING_STATUS.mockData.data = {}
            await  phoenix.intents.intentManager.onintent(im);
        }, time * 1000)
    }
}

phoenix.oem.jlr.hmi.hmiManager = {
    showBackButton: function () {
        return new Promise(() => {
        }, () => {
        })
    }
}
phoenix.oem.jlr.types.PlatformLoginState = {
    UserAuthenticated: "user-authenticated",
    addEventListener: () => {
    }
}
phoenix.ready = async function () {
    return "ok"
}

window.scope = {
    locale: undefined,
    localLanguage: "",
    isLogin: false,
    hasVechile: true,
    parkNow: false,
    firstlanuch: false,
    phoenixReady: false,
    //destination: undefined,
    destination: {
        longitude: 116.428631,
        latitude: 39.983804
    },
    choseLanguage: '',
    vechileinfo: {
        phoneNum: "",
        plateNum: "冀fv586p",
        agreementChk: false,
        pinFree: false,
        wechatUrl: "",
        alipayUrl: ""
    },
    // carLocation: undefined,
    carLocation: {
        lng: 116.428631,
        lat: 39.903804
    },
    mobileData: true,
    isConnected: true,
    fromFeature: "",
    appstatus: APP_STATUS.LANUCHSTART,
    lastPage: window.location.hash,
    last_app: "",
    pageloadingTimeout: -1,
    pageId: "not_need",
    timeStart: "",
    timeEnd: "",
    time: "",
    loadingQueue: [],
    bfStaus: "",
    navQueue: []
};
class DEV {
    static  wait() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("")
            }, 2000);
        })
    }

}
let div_1 = document.createElement("div")
div_1.innerHTML = `<div id="dev_background_btn"></div>`
div_1.children[0].onclick = function () {
    phoenix.wfc.application.requestToBackground()
}
document.body.append(div_1.children[0])
JLRAPI.api = {
    PASSCODE: {
        url: '/authentication/passcode',
        method: 'POST',
        params: {
            passcode: undefined,
        },
    },
    SEND_VERIFICATION_CODE: {
        url: '/user/phone',
        mockData: {
            "code": 0,
            "requestId": "12855",
            "timestamp": "12855",
            "domainId": "place",
            "data": {}
        },
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
        mockData: {
            "code": 0,
            "requestId": "12855",
            "timestamp": "12855",
            "domainId": "place",
            "data": {}
        },
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
        mockData: {
            "code": 0,
            "requestId": "12855",
            "timestamp": "12855",
            "domainId": "place",
            "data": {
                "plateNumber": "冀FV686P",
                "hasMoreProviders": true,
                "providers": [
                    {
                        "provider": "tjd",
                        "phone": {
                            "number": "18611579634",
                            "countryCode": "CN"
                        },
                        "pinfree": false,
                        "unbindable": true
                    },
                    {
                        "provider": "etcp",
                        "phone": {
                            "number": "18611579634",
                            "countryCode": "CN"
                        },
                        "pinfree": false,
                        "unbindable": false
                    }
                ]
            },
            "cccontext": {
                "requestId": "12855",
                "sessionId": "460"
            }
        },
        method: 'GET',
        error: {
            system: notifyType.CP_SYSTEM_COMMON_ERROR,
            business: notifyType.PhoneVcodeError,
        }
    },
    REGISTER_VEHICLE: {
        url: '/parking/vehicle',
        method: 'POST',
        mockData: {
            "code": 0,
            "msg": "成功",
            "providers": ["etcp"],
            "errorData": {
                "etcp": {
                    "code": 20100,
                    "count": 5
                }
            }
        },
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
        },
        mockData: {
            "code": 0,
            "msg": "成功",
            "providers": ["etcp"],
            "errorData": {
                "etcp": {
                    "code": 20100,
                    "count": 5
                }
            }
        }
    },
    SET_PIN_FREE: {
        url: '/parking/pinFree',
        method: 'POST',
        params: {
            provider: undefined
        },
        error: {
            system: notifyType.CP_SYSTEM_COMMON_ERROR,
            business: notifyType.VechilesetupError,
        },
        mockData: {
            "code": 0,
            "requestId": "12855",
            "timestamp": "12855",
            "domainId": "place",
            "data": [
                {
                    "provider": "etcp",
                    "signUrl": "http://www.futuremove.cn"
                }
            ],
            "cccontext": {
                "requestId": "12855",
                "sessionId": "460"
            }
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
        },
        mockData: {
            "code": 0,
            "requestId": "12855",
            "timestamp": "12855",
            "domainId": "place",
            "data": [
                {
                    "provider": "etcp",
                    "signUrl": "http://www.futuremove.cn"
                }
            ],
            "cccontext": {
                "requestId": "12855",
                "sessionId": "460"
            }
        }
    },
    PAY_MANUALLY: {
        url: '/parking/pinFree',
        method: 'PUT',
        error: {
            system: notifyType.CP_SYSTEM_COMMON_ERROR,
            business: notifyType.VechilesetupError,
        },
        mockData: {
            "code": 0,
            "requestId": "12855",
            "timestamp": "12855",
            "domainId": "place",
            "data": [
                {
                    "provider": "etcp",
                    "signUrl": "http://www.futuremove.cn"
                }
            ],
            "cccontext": {
                "requestId": "12855",
                "sessionId": "460"
            }
        }
    },
    PARKING_STATUS: {
        url: '/parking/status',
        method: 'GET',
        error: {
            system: notifyType.CP_SYSTEM_COMMON_ERROR,
            business: notifyType.VechilesetupError,
        },
        mockData: {
            "code": 0,
            "requestId": "e235986f-45b3-be76-6200-ed7474594a64",
            "timestamp": 1572077528716,
            "domainId": "place",
            "data": {
                "active": true,
                "orderId": "4f9fd8cd5feb438ea426e2d3a588cfd3",
                "plateNumber": "京AG9999",
                "parkingId": "7715622dff834b34a44448b801c27607",
                "parkingName": "开发停车场25",
                "provider": "tjd",
                "enteringTime": 1572077515000,
                "parkTime": 21,
                "parkingFee": "0.02",
                "paidFee": "0",
                "payManual": false,
                "remainingFee": "0.02",
                "payUrls": [
                    {
                        "type": "",
                        "payUrl": "https://prep.tingjiandan.com/tcweixin/letter/prePay/pagePayInPark?prePayType=16&channel=30107&isShowDetail=true&partnerId=&orderId=e576e1147bbe4168a55dbe5f0a6cd2a9&returnUrl="
                    }
                ]
            },
            "cccontext": {
                "requestId": "e235986f-45b3-be76-6200-ed7474594a64",
                "sessionId": "9993037a-00d4-0c4d-72a5-a50e90a5d644"
            }
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
        method: 'GET',
        params: {
            type: undefined
        },
        error: {
            system: notifyType.CP_SYSTEM_COMMON_ERROR,
            business: notifyType.VechilesetupError,
        },
        mockData: {
            "code": 0,
            "requestId": "e7685b9d-1bc9-8380-af6d-606c07e1cdfb",
            "timestamp": 1571630818237,
            "domainId": "place",
            "data": [
                {
                    "id": "7715622dff834b34a44448b801c27607",
                    "name": "开发停车场25",
                    "type": "parkingPay",
                    "provider": "tjd",
                    "plateNumber": "京AG8888",
                    "location": {
                        "geo": {
                            "lat": 116.310335,
                            "lng": 39.93609,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "财智大厦23楼"
                        }
                    },
                    "order": {
                        "orderId": "35cf77f340074dc7a218b7b99ad458f5",
                        "providerOrderId": "f9712f51f1bc4c3d9f74c01d04c1860d",
                        "enteringTimestamp": 1571629632000,
                        "exitingTimestamp": 1571629663000,
                        "parkingFee": "0.02",
                        "remainingFee": "0.00",
                        "currency": "CNY",
                        "freeThroughTime": "10",
                        "payManual": false,
                        "isDebt": false
                    }
                },
                {
                    "id": "7715622dff834b34a44448b801c27607",
                    "name": "开发停车场25",
                    "type": "parkingPay",
                    "provider": "tjd",
                    "plateNumber": "京AG8888",
                    "location": {
                        "geo": {
                            "lat": 116.310335,
                            "lng": 39.93609,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "财智大厦23楼"
                        }
                    },
                    "order": {
                        "orderId": "af61f43d7e21442fa0121ba8102fca66",
                        "providerOrderId": "26e5a02ff321423293f2ac10a67fccbf",
                        "enteringTimestamp": 1571628957000,
                        "exitingTimestamp": 1571629017000,
                        "parkingFee": "0.02",
                        "remainingFee": "0.00",
                        "currency": "CNY",
                        "freeThroughTime": "10",
                        "payManual": false,
                        "isDebt": false
                    }
                },
                {
                    "id": "7715622dff834b34a44448b801c27607",
                    "name": "开发停车场25",
                    "type": "parkingPay",
                    "provider": "tjd",
                    "plateNumber": "京AG8888",
                    "location": {
                        "geo": {
                            "lat": 116.310335,
                            "lng": 39.93609,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "财智大厦23楼"
                        }
                    },
                    "order": {
                        "orderId": "f56c322c066f42548a2b59b7afb2eaaa",
                        "providerOrderId": "735ebc658ecd4b569376e630711ffc42",
                        "enteringTimestamp": 1571569774000,
                        "exitingTimestamp": 1571581304000,
                        "parkingFee": "10.12",
                        "remainingFee": "0.00",
                        "currency": "CNY",
                        "freeThroughTime": "10",
                        "payManual": false,
                        "isDebt": false
                    }
                },
                {
                    "id": "7715622dff834b34a44448b801c27607",
                    "name": "开发停车场25",
                    "type": "parkingPay",
                    "provider": "tjd",
                    "plateNumber": "京AG8888",
                    "location": {
                        "geo": {
                            "lat": 116.310335,
                            "lng": 39.93609,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "财智大厦23楼"
                        }
                    },
                    "order": {
                        "orderId": "72286d641fd44afca9f4519d67450827",
                        "providerOrderId": "0c27091e77df43b8a133f272e4fb13ff",
                        "enteringTimestamp": 1571565158000,
                        "exitingTimestamp": 1571565177000,
                        "parkingFee": "0.02",
                        "remainingFee": "0.00",
                        "currency": "CNY",
                        "freeThroughTime": "10",
                        "payManual": false,
                        "isDebt": false
                    }
                },
                {
                    "id": "7715622dff834b34a44448b801c27607",
                    "name": "开发停车场25",
                    "type": "parkingPay",
                    "provider": "tjd",
                    "plateNumber": "京AG8888",
                    "location": {
                        "geo": {
                            "lat": 116.310335,
                            "lng": 39.93609,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "财智大厦23楼"
                        }
                    },
                    "order": {
                        "orderId": "01e661d794e441459e5e51ae97353880",
                        "providerOrderId": "cb64a19c3c3c4bdb9b4db2dd0757f9ba",
                        "enteringTimestamp": 1571563717000,
                        "exitingTimestamp": 1571563767000,
                        "parkingFee": "0.02",
                        "remainingFee": "0.00",
                        "currency": "CNY",
                        "freeThroughTime": "10",
                        "payManual": false,
                        "isDebt": false
                    }
                },
                {
                    "id": "7715622dff834b34a44448b801c27607",
                    "name": "开发停车场25",
                    "type": "parkingPay",
                    "provider": "tjd",
                    "plateNumber": "京AG8888",
                    "location": {
                        "geo": {
                            "lat": 116.310335,
                            "lng": 39.93609,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "财智大厦23楼"
                        }
                    },
                    "order": {
                        "orderId": "f8cc6cd4e01b4c1e950dcca6ce905c10",
                        "providerOrderId": "0813f912f154492ebc083ec7141805a0",
                        "enteringTimestamp": 1571562315000,
                        "exitingTimestamp": 1571562388000,
                        "parkingFee": "0.02",
                        "remainingFee": "0.00",
                        "currency": "CNY",
                        "freeThroughTime": "10",
                        "payManual": false,
                        "isDebt": false
                    }
                }
            ],
            "cccontext": {
                "requestId": "e7685b9d-1bc9-8380-af6d-606c07e1cdfb",
                "sessionId": "ff4bb2e3-34f5-d85c-20bf-6e91431d4075"
            }
        }
    },
    DELETE_HISTORY: {
        url: '/place/recents',
        method: 'DELETE',
        params: {
            toDeleteAll: undefined
        },
        error: {
            system: notifyType.CP_SYSTEM_COMMON_ERROR,
            business: notifyType.HistoryDel_Error,
        },
        mockData: {
            "code": 0,
            "requestId": "12855",
            "timestamp": "12855",
            "domainId": "place",
            "data": {},
            "cccontext": {
                "requestId": "12855",
                "sessionId": "460"
            }
        }
    },
    DETAIL_PARKING: {
        url: '/place/details',
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
        },
        mockData: {}
    },
    SEARCH_PARKING: {
        url: '/place/search',
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
        },
        mockData: {
            "code": 0,
            "requestId": "3855b346-2a0c-4538-a5aa-557b3930fd18",
            "timestamp": 1571564422036,
            "domainId": "place",
            "data": [
                {
                    "id": "70895654d2474857b4e8f65d6441e027",
                    "provider": "etcp",
                    "type": "parking",
                    "description": "",
                    "name": "运营部测试停车场2",
                    "distance": 327,
                    "distanceFromSearchArea": 327,
                    "bookable": false,
                    "location": {
                        "geo": {
                            "lat": 39.910264954430275,
                            "lng": 116.40129577313938,
                            "system": "WGS84"
                        },
                        "geoNav": {
                            "lat": 39.910264954430275,
                            "lng": 116.40129577313938,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "北京市北京市东城区北京市海淀区"
                        }
                    },
                    "imageUrls": [
                        "https://s3-us-west-1.amazonaws.com/static.justdrive.cloudcar.com/image/default/place.svg"
                    ],
                    "categories": [],
                    "ccCategories": [
                        "parking"
                    ],
                    "businessHours": {
                        "monday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "tuesday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "wednesday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "thursday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "friday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "saturday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "sunday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        }
                    },
                    "parkingPrices": {
                        "averageChargePerHour": 4,
                        "currency": "¥",
                        "prices": [
                            {
                                "times": [
                                    {
                                        "day": [
                                            "sunday",
                                            "monday",
                                            "tuesday",
                                            "wednesday",
                                            "thursday",
                                            "friday",
                                            "saturday"
                                        ],
                                        "from": "07:00",
                                        "to": "21:00",
                                        "label": "日间"
                                    }
                                ],
                                "costs": [
                                    {
                                        "pricePerUnit": "4.0",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "0",
                                        "maxMinutes": "60"
                                    },
                                    {
                                        "pricePerUnit": "4.0",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "61"
                                    }
                                ]
                            },
                            {
                                "times": [
                                    {
                                        "day": [
                                            "sunday",
                                            "monday",
                                            "tuesday",
                                            "wednesday",
                                            "thursday",
                                            "friday",
                                            "saturday"
                                        ],
                                        "from": "21:00",
                                        "to": "07:00",
                                        "label": "夜间"
                                    }
                                ],
                                "costs": [
                                    {
                                        "pricePerUnit": "1.0",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "0",
                                        "maxMinutes": "60"
                                    },
                                    {
                                        "pricePerUnit": "0.5",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "61"
                                    }
                                ]
                            }
                        ]
                    },
                    "availability": {
                        "indicator": "high",
                        "state": "notFull"
                    },
                    "garageType": "ground"
                },
                {
                    "id": "70895654d2474857b4e8f65d6441e027",
                    "provider": "etcp",
                    "type": "parking",
                    "description": "",
                    "name": "运营部测试停车场2",
                    "distance": 327,
                    "distanceFromSearchArea": 327,
                    "bookable": false,
                    "location": {
                        "geo": {
                            "lat": 39.910264954430275,
                            "lng": 116.40129577313938,
                            "system": "WGS84"
                        },
                        "geoNav": {
                            "lat": 39.910264954430275,
                            "lng": 116.40129577313938,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "北京市北京市东城区北京市海淀区"
                        }
                    },
                    "imageUrls": [
                        "https://s3-us-west-1.amazonaws.com/static.justdrive.cloudcar.com/image/default/place.svg"
                    ],
                    "categories": [],
                    "ccCategories": [
                        "parking"
                    ],
                    "businessHours": {
                        "monday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "tuesday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "wednesday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "thursday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "friday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "saturday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "sunday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        }
                    },
                    "parkingPrices": {
                        "averageChargePerHour": 4,
                        "currency": "¥",
                        "prices": [
                            {
                                "times": [
                                    {
                                        "day": [
                                            "sunday",
                                            "monday",
                                            "tuesday",
                                            "wednesday",
                                            "thursday",
                                            "friday",
                                            "saturday"
                                        ],
                                        "from": "07:00",
                                        "to": "21:00",
                                        "label": "日间"
                                    }
                                ],
                                "costs": [
                                    {
                                        "pricePerUnit": "4.0",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "0",
                                        "maxMinutes": "60"
                                    },
                                    {
                                        "pricePerUnit": "4.0",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "61"
                                    }
                                ]
                            },
                            {
                                "times": [
                                    {
                                        "day": [
                                            "sunday",
                                            "monday",
                                            "tuesday",
                                            "wednesday",
                                            "thursday",
                                            "friday",
                                            "saturday"
                                        ],
                                        "from": "21:00",
                                        "to": "07:00",
                                        "label": "夜间"
                                    }
                                ],
                                "costs": [
                                    {
                                        "pricePerUnit": "1.0",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "0",
                                        "maxMinutes": "60"
                                    },
                                    {
                                        "pricePerUnit": "0.5",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "61"
                                    }
                                ]
                            }
                        ]
                    },
                    "availability": {
                        "indicator": "low",
                        "state": "notFull"
                    },
                    "garageType": "ground"
                },
                {
                    "id": "70895654d2474857b4e8f65d6441e027",
                    "provider": "etcp",
                    "type": "parking",
                    "description": "",
                    "name": "运营部测试停车场2",
                    "distance": 327,
                    "distanceFromSearchArea": 327,
                    "bookable": false,
                    "location": {
                        "geo": {
                            "lat": 39.910264954430275,
                            "lng": 116.40129577313938,
                            "system": "WGS84"
                        },
                        "geoNav": {
                            "lat": 39.910264954430275,
                            "lng": 116.40129577313938,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "北京市北京市东城区北京市海淀区"
                        }
                    },
                    "imageUrls": [
                        "https://s3-us-west-1.amazonaws.com/static.justdrive.cloudcar.com/image/default/place.svg"
                    ],
                    "categories": [],
                    "ccCategories": [
                        "parking"
                    ],
                    "businessHours": {
                        "monday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "tuesday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "wednesday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "thursday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "friday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "saturday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        },
                        "sunday": {
                            "open": true,
                            "hours": [
                                {
                                    "start": "00:00",
                                    "end": "23:59"
                                }
                            ]
                        }
                    },
                    "parkingPrices": {
                        "averageChargePerHour": 4,
                        "currency": "¥",
                        "prices": [
                            {
                                "times": [
                                    {
                                        "day": [
                                            "sunday",
                                            "monday",
                                            "tuesday",
                                            "wednesday",
                                            "thursday",
                                            "friday",
                                            "saturday"
                                        ],
                                        "from": "07:00",
                                        "to": "21:00",
                                        "label": "日间"
                                    }
                                ],
                                "costs": [
                                    {
                                        "pricePerUnit": "4.0",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "0",
                                        "maxMinutes": "60"
                                    },
                                    {
                                        "pricePerUnit": "4.0",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "61"
                                    }
                                ]
                            },
                            {
                                "times": [
                                    {
                                        "day": [
                                            "sunday",
                                            "monday",
                                            "tuesday",
                                            "wednesday",
                                            "thursday",
                                            "friday",
                                            "saturday"
                                        ],
                                        "from": "21:00",
                                        "to": "07:00",
                                        "label": "夜间"
                                    }
                                ],
                                "costs": [
                                    {
                                        "pricePerUnit": "1.0",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "0",
                                        "maxMinutes": "60"
                                    },
                                    {
                                        "pricePerUnit": "0.5",
                                        "priceTypeUnit": "60 Minutes",
                                        "minMinutes": "61"
                                    }
                                ]
                            }
                        ]
                    },
                    "availability": {
                        "indicator": "mid",
                        "state": "notFull"
                    },
                    "garageType": "ground"
                },
                {
                    "id": "1000424",
                    "provider": "tjd",
                    "type": "parking",
                    "description": "",
                    "name": "停车场(恒润商务中心东)临固临",
                    "distance": 885,
                    "distanceFromSearchArea": 885,
                    "bookable": false,
                    "location": {
                        "geo": {
                            "lat": 39.902405677292165,
                            "lng": 116.39145984698676,
                            "system": "WGS84"
                        },
                        "geoNav": {
                            "lat": 39.902405677292165,
                            "lng": 116.39145984698676,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "罗湖广场"
                        }
                    },
                    "imageUrls": [
                        "https://s3-us-west-1.amazonaws.com/static.justdrive.cloudcar.com/image/default/place.svg"
                    ],
                    "categories": [],
                    "ccCategories": [
                        "parking"
                    ],
                    "parkingPrices": {
                        "averageChargePerHour": 0.1
                    },
                    "availability": {
                        "state": "unknown"
                    },
                    "garageType": "both"
                },
                {
                    "id": "1003462",
                    "provider": "tjd",
                    "type": "parking",
                    "description": "",
                    "name": "0516缴费机支付",
                    "distance": 2325,
                    "distanceFromSearchArea": 2325,
                    "bookable": false,
                    "location": {
                        "geo": {
                            "lat": 39.927197569148476,
                            "lng": 116.40976024140248,
                            "system": "WGS84"
                        },
                        "geoNav": {
                            "lat": 39.927197569148476,
                            "lng": 116.40976024140248,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "123"
                        }
                    },
                    "imageUrls": [
                        "https://s3-us-west-1.amazonaws.com/static.justdrive.cloudcar.com/image/default/place.svg"
                    ],
                    "categories": [],
                    "ccCategories": [
                        "parking"
                    ],
                    "parkingPrices": {
                        "averageChargePerHour": 0.6
                    },
                    "availability": {
                        "state": "unknown"
                    },
                    "garageType": "both"
                },
                {
                    "id": "1003312",
                    "provider": "tjd",
                    "type": "parking",
                    "description": "",
                    "name": "王洁测试222",
                    "distance": 2695,
                    "distanceFromSearchArea": 2695,
                    "bookable": false,
                    "location": {
                        "geo": {
                            "lat": 39.93093717695346,
                            "lng": 116.40924557675959,
                            "system": "WGS84"
                        },
                        "geoNav": {
                            "lat": 39.93093717695346,
                            "lng": 116.40924557675959,
                            "system": "WGS84"
                        },
                        "rawAddress": {
                            "type": "string",
                            "data": "1"
                        }
                    },
                    "imageUrls": [
                        "https://s3-us-west-1.amazonaws.com/static.justdrive.cloudcar.com/image/default/place.svg"
                    ],
                    "categories": [],
                    "ccCategories": [
                        "parking"
                    ],
                    "parkingPrices": {
                        "averageChargePerHour": 0
                    },
                    "availability": {
                        "state": "unknown"
                    },
                    "garageType": "ground"
                }
            ],
            "cccontext": {
                "requestId": "3855b346-2a0c-4538-a5aa-557b3930fd18",
                "sessionId": "381a5a49-9b14-62f4-af4e-0245d851e47f"
            }
        }
    },
    NOTIFICATION_SESSION_PARK: {
        url: '/events/place',
        method: 'POST'
    },
    TERMS_CONDITION: {
        url: 'https://s3.amazonaws.com/assets.cloudcar.com/provider_assets/future_move/tc.html',
    }
};

document.querySelector(".notification_close").addEventListener("click", function () {
    document.querySelector(".notification").style.display = "none"
})
