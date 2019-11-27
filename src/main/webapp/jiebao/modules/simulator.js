/**
 * Created by sunxinhan on 2019/9/3.
 */
/**
 * @namespace page
 * @description 调试控制台页面
 */
class simulator {
    constructor() {
        this._logging =  new phoenix.util.Logging();
        this._logging.debug = (text)=> { this._logging.error("[viss Wrapper] " + text);};
        
        this._requestId = 0;
        this._promiseMap = {};

        this.vehicle = new WebSocket("ws://localhost:7080");

        this.authToken = null;

        phoenix.ontokenchange = (token) => {
            this.authToken = token;
            this.vehicle.send('{"action": "authorize", "tokens": {"www-vehicle-device": "' + token + '"}, "requestId": "' + ++this._requestId + '"}');
        };

        phoenix.ready.then(()=>{
            return phoenix.currentToken();
        }).then((token)=>{
            phoenix.ontokenchange(token);
        });

        this.vehicle.onopen = ()=>{
            simulator.slog("VISS open");
            console.log("VISS open");
            this.vehicle.send('{"action": "authorize", "tokens": {"www-vehicle-device": "' + this.authToken + '"}, "requestId": "' + ++this._requestId + '"}');
        }
        
        this.vehicle.onmessage = (event)=>{
            let message = JSON.parse(event.data);
            if(message.action=="get"){
                console.log('检测到ws-get，输出value：', message.value)
                simulator.slog('检测到ws-get，输出value：' + message.value)
                genericHandler(message, message.value);
            }
        }

        this.getFunction = (path) => {
            this.vehicle.send('{"action": "get", "path": "' + path + '", "requestId": "' + ++this._requestId + '"}');
            return new Promise((resolve, reject)=>{
                this._promiseMap[this._requestId] = {};
                this._promiseMap[this._requestId].resolve = resolve;
                this._promiseMap[this._requestId].reject = reject;
            });
        }

        // Generic request handler
        var genericHandler = (message, valueToResolve) =>{
            this._logging.debug(JSON.stringify(message));
            if(message.error === undefined){
                this._promiseMap[message.requestId].resolve(valueToResolve);
            } else if(this._promiseMap.hasOwnProperty(message.requestId)) {
                this._promiseMap[message.requestId].reject(message.error);
            } else {
                console.log("Request ID not recognised");
            }

            // Remove from the promise map
            delete this._promiseMap[message.requestId];
        };
    }

    unLoad() {
        console.log('simulator page unLoad')
    }

    static  slog(msg) {
        let div = document.createElement("div");
        div.innerText += ">>  " + msg;
        document.querySelector(".console_div_content").appendChild(div)
    }

    static  slogError(msg) {
        let div = document.createElement("div");
        div.innerText += ">>  " + msg;
        div.style = "color:red;"
        document.querySelector(".console_div_content").appendChild(div)
    }

    async onLoad() {
        var _this = this
        console.log('pageOnLoad')


        let subscriberIntentManagerObj = phoenix.intents.intentManager;
        subscriberIntentManagerObj.onintent = async (intent, pContext, context) => {
            simulator.slog(JSON.stringify(context))
            simulator.slog(JSON.stringify(pContext))

            // if (phoenix.wfc.application) {
            //     phoenix.wfc.application.requestToForeground();
            // }

            let data = await  intent.data();
            simulator.slog(JSON.stringify(data))
            console.log(intent.resolve)
            intent.resolve();
        }


        let intentManagerObj = phoenix.intents.intentManager;

        let intentOptions = {
            action: "phoenix.intents.action.TILE_ACTION",
            filters: [
                "BUTTON11",
                "BUTTON22",
                "#TestFrameworkTileNameId"
            ]
        }

        let intent = new phoenix.intents.Intent(intentOptions);
        intentManagerObj.publish(intent)
            .then((data) => {
                console.log("The intent is published");
            })
            .catch((error) => {
                if (error instanceof phoenix.PhoenixError)
                    console.error(error.errorCode);
            });

        
        // exit
        document.querySelector("#btn_exit").onclick = async function () {
            simulator.slog('执行exit')
            try {
                let applicationObject = phoenix.wfc.application;
                applicationObject.exit();
            }catch(e) {
                simulator.slogError('执行exit错误：')
                console.log('执行exit错误：', JSON.stringify(e))
                JlrError.catchError(e)
            }
        } 

        // close
        document.querySelector("#btn_close").onclick = async function () {
            simulator.slog('执行close')
            try {
                let applicationManagerObject = new phoenix.wfc.ApplicationManager();
                let packageId;
                let options = {
                  filter: [
                    {
                      type: phoenix.wfc.ApplicationType.WebApplication
                    }
                  ]
                };

                applicationManagerObject.getApplicationsList(options).then( (list) => {
                    for (let appInfo of list) {
                      if (appInfo.type === phoenix.wfc.ApplicationType.WebApplication) {
                        packageId = appInfo.packageId;
                        applicationManagerObject.close(packageId)
                          .then(() => {
                            simulator.slog("The application is closed" );
                          })
                          .catch((error) => {
                            if (error instanceof phoenix.PhoenixError)
                              simulator.slogError(error.errorCode);
                          })
                      } else {
                        simulator.slog('not find packageId, cant close')
                      }
                    }
                }).catch((error) => {
                    if (error instanceof phoenix.PhoenixError) {
                        simulator.slogError('getApplicationsList error, error code: ');
                        simulator.slogError(error.errorCode);
                    }
                })
            }catch(e) {
                simulator.slogError('执行close错误：')
                JlrError.catchError(e)
                console.log('执行close错误：', JSON.stringify(e))
            }
        }


        //Bluetooth
        document.querySelector("#btn_Bluetooth").onclick = async function () {
            simulator.slog('执行Bluetooth')
            try {
                let mediaManager = phoenix.media.mediaManager;
                let mediaSource = {
                    type: "bt"
                };
                mediaManager.activeSession()
                    .then((mediaSessionObject) => {
                        return mediaSessionObject.requestSourceChange(mediaSource);
                    })
                    .then((status) => {
                        if (stauts) {
                            simulator.slog("The media source is changed")
                            console.log("The media source is changed");
                        } else {
                            simulator.slog("The media source is not changed")
                            console.log("The media source is not changed")
                        }
                    })
                    .catch(error => {
                        switch (error.errorCode) {
                            case phoenix.PhoenixErrorType.HostAdapterConnectionError:
                                console.error("Connection Error occurred");
                                break;

                            case phoenix.PhoenixErrorType.PermissionDenied:
                                console.error("The permission to the method is denied");
                                break;

                            case phoenix.PhoenixErrorType.ServiceUnavailable:
                                console.error("The service for this method is unavailable");
                                break;

                            case phoenix.PhoenixErrorType.UnsupportedService:
                                console.error("The requested service is not found.");
                                break;

                            case phoenix.PhoenixErrorType.UnknownError:
                            default:
                                console.error("The error returned is unKnown");
                        }
                    });

            } catch (e) {
                JlrError.catchError(e)
            }
        }
        //telephony
        document.querySelector("#btn_telephony").onclick = async function () {
            simulator.slog('执行telephony')
            try {
                let telephonyManagerObj = phoenix.telephony.telephonyManager;
                let number = "18811788224";

                telephonyManagerObj.dial(number)
                    .then((responseObj) => {
                        simulator.slog("The telephonyManager Object response " + responseObj);
                        console.log("The telephonyManager Object response " + responseObj);
                    })
                    .catch(error => {
                        switch (error.errorCode) {
                            case phoenix.PhoenixErrorType.HostAdapterConnectionError:
                                console.error("Connection Error occurred");
                                break;

                            case phoenix.PhoenixErrorType.PermissionDenied:
                                console.error("The permission to the method is denied");
                                break;

                            case phoenix.PhoenixErrorType.ServiceUnavailable:
                                console.error("The service for this method is unavailable");
                                break;

                            case phoenix.PhoenixErrorType.UnsupportedService:
                                console.error("The requested service is not found.");
                                break;

                            case phoenix.PhoenixErrorType.UnsupportedArgument:
                                console.error("The argument in not correct.");
                                break;

                            case phoenix.PhoenixErrorType.UnknownError:
                            default:
                                console.error("The error returned is unKnown");
                        }
                    });
            } catch (e) {
                JlrError.catchError(e)
            }
        }
        document.querySelector("#btn_setDestinations").onclick = async function () {
            try {
                let map = new phoenix.maps.Map();
                let coordinates = {latitude: 39.913548, longitude: 116.397313};

                let location = new phoenix.maps.Location({
                    latitude: parseFloat(coordinates.latitude),
                    longitude: parseFloat(coordinates.longitude)
                });
                let route = await map.setDestinations([location])
                let eta = await  route[0].etaToDestination();
                if (route) {
                    simulator.slog('setDestination-success,eta:', JSON.stringify(eta))
                }


            }
            catch (e) {
                JlrError.catchError(e)
            }
        }
        document.querySelector("#recentDestinations").onclick = async function () {
        try{
                 phoenix.maps.Map.recentDestinations()
                     .then((result) => {
                         simulator.slog(JSON.stringify(result)+ "");
                         for (let destination of result){
                             simulator.slog(JSON.stringify(destination)+ "");
                         }
                     })
                     .catch((err) => {
                         simulator.slog(this.method + " - " + JSON.stringify(err)+ "");
                     });
        }
        catch(e){

        }
    }

        document.querySelector("#btn_intents").onclick = async function () {
            try {
                console.log("done")
                let intentManagerObj = phoenix.intents.intentManager;

                let intentOptions = {
                    action: "phoenix.intents.TILE_INFORMATION",
                    data: "tileName"
                }

                let intent = new phoenix.intents.Intent(intentOptions);
                intentManagerObj.publish(intent)
                    .then((data) => {
                        console.log("The intent is published", data);
                    })
                    .catch((error) => {
                        console.log('error', error)
                        if (error instanceof phoenix.PhoenixError)
                            console.error(error.errorCode);
                    });

            }
            catch (e) {
                JlrError.catchError(e)
            }


        }
        // btn_currentLocation
        document.querySelector("#btn_currentLocation").onclick = async function () {
            simulator.slog('执行currentLocation')
            try {
                phoenix.maps.Map.currentLocation().then((location) => {
                    console.log(location.coordinates())
                    location.coordinates().then((coordinatesInfo) => {
                        console.log(JSON.stringify(coordinatesInfo))
                        simulator.slog(JSON.stringify(coordinatesInfo))
                    })
                    console.log('currentLocation: ' + location)
                    simulator.slog(location.coordinates())
                    simulator.slog('currentLocation: ' + location)
                }).catch(error => {
                    if (error instanceof phoenix.PhoenixError) {
                        console.error(error.errorCode);
                        simulator.slogError('get location error: ', JSON.stringify(error))
                    }
                });
            } catch (e) {
                JlrError.catchError(e)
            }
        }
        // btn_requestLoginPrompt
        document.querySelector("#btn_requestLoginPrompt").onclick = async function () {
            simulator.slog("准备执行phoenix.users.userManager.requestLoginPrompt")
            try {
                let userManagerObject = phoenix.users.userManager;
                userManagerObject.requestLoginPrompt().then((status) => {
                    if (status) {
                        console.log("login prompt is requested");
                        simulator.slog("login prompt is requested");
                    } else {
                        console.log("login prompt is not requested");
                        simulator.slog("login prompt is not requested")
                    }
                }).catch(error => {
                    if (error instanceof phoenix.PhoenixError) {
                        console.error(error.errorCode);
                        simulator.slogError(error.errorCode)
                    }
                });
            } catch (e) {
                JlrError.catchError(e)
            }
        }
        document.querySelector("#btn_getProfileList").onclick = async function () {
            try {
                simulator.slog("ready to get the users list")
                let users = await  phoenix.users.userManager.availableUsers();
                users.forEach(async user => {
                    if (user) {
                        let isLogin = await user.isLoggedIn();
                        if (isLogin) {
                            simulator.slog(`user:${user},LoginStatus:${isLogin}`)
                            console.log(`user:${user},LoginStatus:${isLogin}`)
                            window.scope.isLogin = true;
                        }
                    }
                })
            }
            catch (e) {
                JlrError.catchError(e)
            }

        }
        document.querySelector("#btn_firstUserLogin").onclick = async function () {
            try {
                simulator.slog("ready to get the users list")
                let users = await  phoenix.users.userManager.availableUsers();
                let flag = await users[0].login();
                simulator.slog("login status is:" + flag);
                console.log("login status is:" + flag);
            }
            catch (e) {
                JlrError.catchError(e)
            }

        }
        // notification
        document.querySelector("#btn_notification").onclick = async function () {
            simulator.slog("执行 notification")
            try {
                notifyType.Destination.actions[0].extraInformation = {
                    lat: 39.908808,
                    lon: 116.39756
                }
                JLRNotify.open(notifyType.Destination)
            } catch (e) {
                JlrError.catchError(e)
            }


        }
        // 键盘
        document.querySelector("#btn_keyboard").onclick = async function () {
            try {
                this.keyboard = new phoenix.sys.keyboard.Keyboard({
                    mode : "alphanumeric",
                });
                this.keyboard.show();
            }
            catch (e) {
                JlrError.catchError(e)
            }

        }
        // network
        document.querySelector("#btn_network").onclick = async function () {
            try {
                simulator.slog("执行network")
                phoenix.ready.then(() => {
                    let networkMananagerObject = phoenix.net.networkManager;
                    networkMananagerObject.activeNetworkSource()
                        .then((networkSource) => {
                            simulator.slog("The network source: " + networkSource.type);
                            console.log("The network source: " + JSON.stringify(networkSource));
                        })
                        .catch(error => {
                            if (error instanceof phoenix.PhoenixError)
                                console.error(error.errorCode);
                        });

                })

                simulator.slog("执行 network 完毕")
            } catch (e) {
                JlrError.catchError(e)
            }
        }
        document.querySelector("#btn_qrcode").onclick = function () {
            try {
                new QRCode(document.getElementById("qrcodepic"), 'https://prep.tingjiandan.com/tcapi_web/thirdSign/scanDispatch?signId=d747186c2a63480e9d9c8bde2149da2e');
            }
            catch (e) {
                JlrError.catchError(e)
            }

        }
        document.querySelector("#btn_voice").onclick = async function () {
            try {
                simulator.slog("执行语音播放")
                let utterance = {
                    text: '您已进入北京市朝阳区竟园艺术中心停车场。home门口。10RMB/H',
                    lang: 'zh-Hans',
                    voice: {
                        voiceURI: 'Jarvis',
                        name: 'Jarvis',
                        lang: 'zh-Hans',
                        localService: true,
                        isDefault: true
                    },
                    volume: 1,
                    rate: 1,
                    pitch: 1
                };
                let SpeechSynthesis = phoenix.speech.SpeechSynthesis;
                let speechSynthesisObj = new SpeechSynthesis();
                let result = await speechSynthesisObj.speak(utterance)
                simulator.slog("执行语音播放完毕")
            }
            catch (e) {
                JlrError.catchError(e)
            }
        }
        document.querySelector("#btn_unbind").onclick = async function () {
            try {
                let result = await JLRAPI.commonRequest(JLRAPI.api.UNREGISTER_VEHICLE);
                if (result && result.code === 0) {
                    simulator.slog("车辆解绑成功")
                }
                else {
                    simulator.slog("车辆解绑失败")
                }
            }
            catch (e) {
                JlrError.catchError(e)
            }

        }
        document.querySelector("#btn_showbackbutton").onclick = async function () {
            try {
                let result = await phoenix.oem.jlr.hmi.hmiManager.showBackButton()
            }
            catch (e) {
                JlrError.catchError(e)
            }
        }
        document.querySelector("#btn_hidebackbutton").onclick = async function () {
            try {
                let result = await phoenix.oem.jlr.hmi.hmiManager.hideBackButton()
            }
            catch (e) {
                JlrError.catchError(e)
            }
        }
        document.querySelector("#btn_agent").onclick = async function () {
            try {
                let agent = await  phoenix.agents.agentsManager.require("jlr.webagent.test-agent-app")
                let methods = await  agent.availableMethods();
                console.log(methods)
                agent.addEventListener("publishTileUpdate", function () {
                    console.log("我的上帝啊")
                })


            }
            catch (e) {
                JlrError.catchError(e)
            }

        }

        document.querySelector("#btn_IsMoving").onclick = async function () {
            console.log('点击了移动检测按钮')
            simulator.slog('点击了移动检测按钮')
            
            try {
                _this.getFunction('Signal.Vehicle.IsMoving').then((data)=>{
                     console.log('Signal.Vehicle.IsMoving' + " - " + data + " from get.");
                     simulator.slog('Signal.Vehicle.IsMoving' + " - " + data + " from get.")
                  }).catch((err)=>{
                     console.log('Signal.Vehicle.IsMoving' + " - " + JSON.stringify(err) + " from get error.");
                     simulator.slogError('Signal.Vehicle.IsMoving' + " - " + JSON.stringify(err) + " from get error.");
                 });
            }
            catch (e) {
                JlrError.catchError(e)
            }
        }

        document.querySelector("#btn_intents").onclick = async function () {
            try {
                console.log("done")
                let intentManagerObj = phoenix.intents.intentManager;

                let intentOptions = {
                    action: "phoenix.intents.TILE_INFORMATION",
                    data: "tileName"
                }

                let intent = new phoenix.intents.Intent(intentOptions);
                intentManagerObj.publish(intent)
                    .then((data) => {
                        console.log("The intent is published", data);
                    })
                    .catch((error) => {
                        console.log('error', error)
                        if (error instanceof phoenix.PhoenixError)
                            console.error(error.errorCode);
                    });

            }
            catch (e) {
                JlrError.catchError(e)
            }


        }
        document.querySelector("#btn_intents_support_action").onclick = async function () {
            try {
                phoenix.intents.intentManager.supportedActions()
                    .then((actions) => {
                        console.log("The supported actions are", actions);
                        for (action in actions) {
                            console.log(action);
                        }
                    })
                    .catch((error) => {
                        if (error instanceof phoenix.PhoenixError)
                            console.error(error.errorCode);
                    });
            }
            catch (e) {
                JlrError.catchError(e)
            }


        }
        document.querySelector("#btn_loadAgent").onclick = function () {
            phoenix.agents.agentsManager.require("jlr.webagent.parking.cn")
                .then(agent => {
                    console.log('aget', agent);
                })
                .catch(error => {
                    if (error instanceof phoenix.PhoenixError)
                        console.error(error.errorCode);
                });

        }

        document.querySelector("#btn_lanuchAgent").onclick = function () {
            let applicationManagerObject = new phoenix.wfc.ApplicationManager();
            let packageId = "jlr.webagent.parking.cn";
            let launchOptions = {
                "appName": "web agent demo",
                "information": {}
            }
            applicationManagerObject.launch(packageId, JSON.stringify(launchOptions)).then(() => {
                console.log("The application is launched");
            }).catch((error) => {
                if (error instanceof phoenix.PhoenixError)
                    console.error(error.errorCode);
            })
        }
    }

}