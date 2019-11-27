/**
 * Created by sunxinhan on 2019/6/12.
 */
/**
 * 应用程序加载监听事件
 * @class
 */
class Listener {
    constructor() {

    }

    /**
     * Listener 入口函数，在此处进行监听加载
     */
    static async onLoad() {
        new Router().changeLinser();//监听URL变化
        await Listener.userListener();
        await Listener.applicationState()
        await Listener.intentsListener();
        await Listener.settingChangeListener();
        Listener.inputListener();
        //await Listener.networkListener();//监听网络状态
        // await Listener.settingListener()
    }

    /**
     * 监听settings
     * */
    static async settingListener() {
        try {
            let applicationManagerObject = new phoenix.wfc.ApplicationManager();
            applicationManagerObject.applicationSettings("jlr.webapp.test-framework-application")
                .then((applicationSetting) => {
                    applicationSetting.addEventListener("settingchanged", (event) => {
                    })
                })
                .catch((error) => {
                });

            let applicationSettings = applicationManagerObject.applicationSettings("jlr.webapp.parking.cn")
                .then(appSettings => {
                    applicationSettings = appSettings;
                })
        }
        catch (e) {
            JlrError.catchError(e)
        }
        finally {
            console.log("settingListener finally")
        }

    }

    /**
     * loginStateListener 监听用户登录状态
     *
     * */
    static async applicationState() {
        let applicationObject = phoenix.wfc.application;
        applicationObject.addEventListener("statechange", async (event) => {
            try {
                if (event === "focusGain" && window.scope.bfStaus !== "loading") {
                    window.scope.bfStaus = "loading"
                    Common.BF_Loading()
                    //检查用户登录状
                    await Init.getLoginStatus();
                    console.log('applicationState:user status:', window.scope.isLogin);
                    //如果用户不是登录状态
                    if (!window.scope.isLogin) {
                        //如果last_app等于account，说明account页面已被拉起，last_app要置空，app切到后台
                        if (window.scope.last_app === "account") {
                            window.scope.last_app = "";
                            await phoenix.wfc.application.requestToBackground()
                        }
                        //拉起account页面
                        else {
                            let pop_show = await Init.callLoginPop();
                            if (pop_show) {
                                console.log("login pop show success")
                            }
                            else {
                                console.log("登录窗体,callLoginPop拉起异常")
                                throw APP_ERROR.LoginPop;
                            }
                        }
                    }
                    //如果是登录的状态则加载数据
                    else {
                        await Init.loadData()
                    }
                    window.scope.bfStaus = "loadingEnd"
                }
                else {
                    console.log("applicationState_State", event, window.scope.bfStaus)
                }
            }
            catch (e) {
                console.log("applicationState_catch", e)
            }
            finally {
                console.log("applicationState_finally", window.scope.bfStaus)
                console.log("applicationState_event", event)

                window.scope.bfStaus = "loadingEnd"
            }

        })
    }

    static  userListener() {
        phoenix.users.userManager.addEventListener("userloggedin", async (event) => {
            //监听用户登录状态的改变（每次加载都会监听？）
            console.log(event)
            let userstate = await event.isLoggedIn();
            console.log("userloggedin", userstate);
            //如果用户是登录状态，isLogin 为true，last_app为空，加载数据并切换到前台
            if (userstate === phoenix.oem.jlr.types.PlatformLoginState.UserAuthenticated) {
                if (window.scope.fromFeature === Feature.AppDrawer) {
                    window.scope.isLogin = true;
                    window.scope.last_app = ""
                    await phoenix.wfc.application.requestToForeground()
                }
            }
        })
    }

    static async intentsListener() {
        let im = phoenix.intents.intentManager;
        im.onintent = async (intent, publisherContext, context) => {
            let actionName = await intent.action();
            switch (actionName) {
                case "phoenix.intents.action.LAUNCH_BY_SPEECH":
                    intent.data().then(
                        async (data) => {
                            let applicationObject = phoenix.wfc.application;
                            let status = await applicationObject.requestToForeground();
                            if (status) {
                                console.log('the application is in foreground', status)
                            }
                            else {
                                console.log('failed to come to foreground', status)
                            }
                            console.log(data);
                        });
                    break;
                case "CI_OBN_EVENT":
                    let data = await intent.data();
                    let result = new Jlr_intents(data);
                    await result.doAction();
                    break;
                default:
                    break;
            }


        };
    }


    /**
     * vissListener 车辆数据监听-speed
     */
    static async vissListener() {
        var _this = this
        this._logging = new phoenix.util.Logging();
        this._logging.debug = (text) => {
            this._logging.error("[viss Wrapper] " + text);
        };

        this._requestId = 0;
        this._promiseMap = {};

        this.vehicle = new WebSocket("ws://localhost:7080");

        this.authToken = null;

        phoenix.ontokenchange = (token) => {
            this.authToken = token;
            this.vehicle.send('{"action": "authorize", "tokens": {"www-vehicle-device": "' + token + '"}, "requestId": "' + ++this._requestId + '"}');
        };

        phoenix.ready.then(() => {
            return phoenix.currentToken();
        }).then((token) => {
            phoenix.ontokenchange(token);
        });

        this.vehicle.onopen = () => {
            console.log("VISS open");
            this.vehicle.send('{"action": "authorize", "tokens": {"www-vehicle-device": "' + this.authToken + '"}, "requestId": "' + ++this._requestId + '"}');
        }

        this.vehicle.onmessage = (event) => {
            let message = JSON.parse(event.data);
            if (message.action == "get") {
                console.log('检测到ws-get，输出value：', message.value)
                genericHandler(message, message.value);
            }
        }

        this.getFunction = (path) => {
            this.vehicle.send('{"action": "get", "path": "' + path + '", "requestId": "' + ++this._requestId + '"}');
            return new Promise((resolve, reject) => {
                this._promiseMap[this._requestId] = {};
                this._promiseMap[this._requestId].resolve = resolve;
                this._promiseMap[this._requestId].reject = reject;
            });
        }

        // Generic request handler
        var genericHandler = (message, valueToResolve) => {
            this._logging.debug(JSON.stringify(message));
            if (message.error === undefined) {
                this._promiseMap[message.requestId].resolve(valueToResolve);
            } else if (this._promiseMap.hasOwnProperty(message.requestId)) {
                this._promiseMap[message.requestId].reject(message.error);
            } else {
                console.log("Request ID not recognised");
            }

            // Remove from the promise map
            delete this._promiseMap[message.requestId];
        };
        // 需要显示遮罩的页面(白名单)
        let blankPage = ['etcpbindpayment', 'vechileinfo', 'tjdbindpayment', 'pay']
        try {
            new Listener().getFunction('Signal.Vehicle.IsMoving').then((data) => {
                console.log('Signal.Vehicle.IsMoving' + " - " + data + " from get.");
                window.scope.isMoving = true
                if (blankPage.includes(window.activeRoute.name)) {
                    console.log(blankPage.includes(window.activeRoute.name))
                    document.getElementById('shade-layout').style.display = 'block'
                } else {
                    document.getElementById('shade-layout').style.display = 'none'
                }
            }).catch((err) => {
                console.log('Signal.Vehicle.IsMoving' + " - " + JSON.stringify(err) + " from get error.");
                window.scope.isMoving = false
                document.getElementById('shade-layout').style.display = 'none'
            });
        }
        catch (e) {
            console.log(e)
        }

    }


    /**
     * 系统设置改变监听
     */
    static async settingChangeListener() {
        phoenix.sys.settings.settingsManager.addEventListener('change', async (key, newValue, oldValue) => {
            console.log('settingchange:', key, newValue)
            switch (key) {
                case phoenix.sys.settings.SettingName.DayLightSaving:
                case "ui-theme":
                    //这里切换黑白天样式
                    Common.changeTheme(newValue)
                    break;
                case phoenix.sys.settings.SettingName.NetworkConnectivity:
                    if (newValue === true) {
                        if (window.activeRoute && window.activeRoute.name === "connectivity") {
                            window.location.reload();
                        }
                    }
                    break;
                case "text-language":
                    window.scope.choseLanguage = newValue;
                    let suportLanArr = ['en-US', 'zh-Hans'];
                    if (suportLanArr.indexOf(newValue) < 0) {
                        window.scope.localLanguage = suportLanArr[1];
                    }
                    else {
                        window.scope.localLanguage = newValue;
                    }
                    await Common.loadLocal();
                    Init.LanNotify(newValue);
                    await Common.i18nChange();
                    //这里切换中英文样式
                    if (window.activeRoute && window.activeRoute.activeRoutePage && window.activeRoute.activeRoutePage.i18nchangeCallback) {
                        window.activeRoute.activeRoutePage.i18nchangeCallback()
                    }
                    break;
            }
        })
    }


    /**
     * backbutton 点击监听
     */
    static inputListener() {
        let inputManagerObj = phoenix.sys.input.inputManager;
        inputManagerObj.oninputevent = async (event) => {
            if (event && event.id && event.type === "back-button") {
                history.back(-1)
                await  phoenix.oem.jlr.hmi.hmiManager.hideBackButton();

            }
        };
    }

    /**
     *网络监听
     */
    static async networkListener() {
        let networkMananagerObject = phoenix.net.networkManager;

        async function checkConnect() {
            window.scope.isConnected = await networkMananagerObject.isConnected();//network is connected
        }

        networkMananagerObject.onconnectionchange = async (event) => {
            console.log("networkListener", event);

            window.scope.mobileData = true;
            window.scope.isConnected = true;
            return;
            if (event && event.type) {
                switch (event.type) {
                    case phoenix.net.NetworkType.Cellular:
                        window.scope.mobileData = true;
                        await checkConnect();
                        break;
                    case phoenix.net.NetworkType.WiFi:
                        window.scope.mobileData = false;
                        await checkConnect();
                        break;
                    case phoenix.net.NetworkType.Offline:
                        window.scope.mobileData = false;
                        window.scope.isConnected = false;
                        break;
                    default:
                        //默认为不可进行数据获取
                        window.scope.mobileData = false;
                        window.scope.isConnected = false;
                        break;
                }
            }
            else {
                window.scope.mobileData = false;
                window.scope.isConnected = false;
            }

        };
    }


}