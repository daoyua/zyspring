/**
 * Created by sunxinhan on 2019/6/12.
 */
/**
 * @class Init
 */
class Init {
    constructor() {

    }


    /**
     * @static
     * @function Init.onLoad
     * @description application entry
     */
    static async onLoad() {
        try {
            window.scope.appstatus = APP_STATUS.LANUCHING;
            await Common.phoenixReady();
            console.log("Init phoenix is ready")
            let theme = Common.getTheme();
            console.log("Init theme:", theme)
            Common.changeTheme(theme)//加载页面皮肤
            await Common.getSettingLocal();//获取语言设置
            console.log("Init language:", window.scope.localLanguage)
            Common.BF_Loading();
            console.log("Init page show loading")
            await Common.loadLocal();//获取加载国际化对象
            console.log("Init load local object", window.scope.locale)
            Common.getFeature();
            console.log("Init load app lanuch future", window.scope.fromFeature)
            Listener.onLoad();
            console.log("Init load listener")
            await Common.getNetWork();
            if (!window.scope.mobileData && !window.scope.isConnected) {
                //是lanuch场景发现网络不可链接
                Router.To("connectivity")
            }
            else {
                console.log("Init load listener")
                await Init.getLoginStatus();
                console.log('Init load,user status:', window.scope.isLogin);
                //todo:目前已知场景为appdrawer进入,需要考虑其他场景接入情况
                if (!window.scope.isLogin) {
                    //拉取登录页面
                    let pop_show = await Init.callLoginPop();
                    if (pop_show) {
                        console.log("login pop show success");
                    }
                    else {
                        console.log("登录窗体,callLoginPop拉起异常")
                        throw APP_ERROR.LoginPop;
                    }
                }
                else {
                    if (window.scope.fromFeature === Feature.AppDrawer) {
                        console.log('Init load Data');
                        await Init.loadData();
                    }
                }
            }
            window.scope.appstatus = APP_STATUS.LANUCHEND;
            await TestButton.touchshowBox()
        }
        catch (e) {
            JlrError.catchError(e)
        }
        finally {
            window.scope.appstatus = APP_STATUS.LANUCHEND;

            console.log("Init finally")
        }
    }

    /**
     * 应用程序默认语言为英文需要进行系统提示
     * @function Init.Lannotify
     * @default window.scope.localLanguage='zh-Hans'
     */
    static LanNotify() {
        //todo:因暂不支持,所以暂时不使用此方案
        let appStore = phoenix.sys.persistency.appStorage;
        switch (window.scope.choseLanguage) {
            case "en-US":
                if (false && appStore.getItem("Lan_firstLanuch") === null) {
                    JLRNotify.open(notifyType.Lan_firstLanuch)
                }
                break;
            case "zh-Hans":
                break;
            default:
                if (false && appStore.getItem("Lan_NotSupport") === null) {
                    JLRNotify.open(notifyType.Lan_NotSupport);
                }
                break;
        }
    }

    /**
     * get the user loginstatus in the user list
     * @return {boolean}
     */
    static async getLoginStatus() {
        //获取用户信息
        let users = await phoenix.users.userManager.availableUsers();
        let userLogin = false;
        window.scope.isLogin = false;
        for (let i = 0; i <= users.length; i++) {
            if (users[i]) {
                //检查用户登录状态
                let isLogin = await users[i].isLoggedIn();
                //如果用户登录成功，window.scope.isLogin=true
                if (isLogin === phoenix.oem.jlr.types.PlatformLoginState.UserAuthenticated) {
                    userLogin = true;
                    window.scope.isLogin = true;
                }
            }
        }

        return userLogin;
    }

    /**
     * @async
     * @static
     * @function Init.call_loginPop
     */
    static async callLoginPop() {
        //当用户没有登录账号，拉取account页面
        try {
            window.scope.last_app = "account";
            //todo:目前设定100%能够拉起登录窗体
            let status = await phoenix.users.userManager.requestLoginPrompt();
            console.log("login prompt status", status)
            return "success";

        } catch (error) {

        }
    }


    /**
     * 应用加载时初始化数据及页面跳转
     * @function Init.loadData
     */
    static async loadData() {
        try {
            await Init.getVechileAndPinFree();
            if (window.scope.isLogin && !window.scope.hasVechile) {
                if (Router.getActiveRoute().name) {
                    if (["welcome", "agreement", "vechileinfo", "validatephone"].indexOf(Router.getActiveRoute().name) >= 0) {
                        Router.b_faction()
                    }
                    else {
                        Router.To("welcome");
                    }
                }
                else {
                    Router.To("welcome");
                }

            }
            else {
                //check if the car in the park lot
                await Init.parkSession()
                console.log("has active parking session:", window.scope.parkNow);
                if (window.scope.parkNow) {
                    if (Router.getActiveRoute().name === "nowpark") {
                        await Router.b_faction()
                        if (!window.activeRoute.activeRoutePage.mainContentShow) {
                            document.querySelector("#menu-bar").style.display = "none"
                        }
                    }
                    else {
                        Router.To("nowpark");
                    }
                }
                else {
                    if (window.scope.destinationChanged) {
                        Router.To("searchlist", true);
                    }
                    else {
                        if (window.activeRoute) {
                            console.log("the last view page is:", window.activeRoute.name)
                            Router.b_faction()
                        }
                        else {
                            Router.To("searchlist", true);
                        }
                    }
                }

            }
            await Init.debtCount();
            Init.LanNotify()
        }
        catch (e) {
            console.log(e)
        }

    }

    /**
     * 获取车辆数据及获取是否开启了免密支付的数据
     * @return {Promise.<boolean>}
     */
    static async getVechileAndPinFree() {
        let result = await JLRAPI.commonRequest(JLRAPI.api.GET_USER_VEHICLE_INFO)
        if (result && result.code === 0) {
            if (result.data.providers && result.data.providers.length > 0) {
                window.scope.hasVechile = true;
                await Common.getCarLocation()//获取车辆当前位置
                await Common.getDestinations()//获取车辆目的地
            }
            if (result.data && result.data.providers) {
                let data = result.data.providers;
                for (let i = 0; i < data.length; i++) {
                    if (data[i] && data[i]["tjd"] === true) {
                        window.scope.TJDpinFree = true;
                    }
                    if (data[i] && data[i]["etcp"] === true) {
                        window.scope.ETCPpinFree = true;
                    }
                }
            }
            else {
                window.scope.ETCPpinFree = false;
                window.scope.TJDpinFree = false;
            }
        }
        else {

            window.scope.hasVechile = false;
            window.scope.TJDpinFree = false;
            window.scope.ETCPpinFree = false;
        }
        console.log("bind vehicle:", window.scope.hasVechile)
    }

    /**
     * 获取车辆在停车场内的数据
     * @return {boolean}
     */
    static async parkSession() {
        let result = await JLRAPI.commonRequest(JLRAPI.api.PARKING_STATUS)
        if (result && result.data && result.code === 0) {
            if (result.data.active) {
                window.scope.parkNow = result.data.active;
                if (result.data.payUrls && result.data.payUrls.length > 0) {
                    let data = result.data.payUrls;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].type === "") {
                            window.scope.vechileinfo.alipayUrl = data[i].payUrl;
                            window.scope.vechileinfo.wechatUrl = data[i].payUrl;
                        }
                        else {
                            if (data[i].type && data[i].type.toString() === "0") {
                                window.scope.vechileinfo.wechatUrl = data[i].payUrl;
                            }
                            if (data[i].type && data[i].type.toString() === "1") {
                                window.scope.vechileinfo.alipayUrl = data[i].payUrl;
                            }
                        }
                    }
                }
            }
            else {
                window.scope.parkNow = false;
            }

        }
        else {
            window.scope.parkNow = false;
        }
        return window.scope.parkNow;
    }

    /**
     * 获取坏账数据
     * @return {Int} 坏账数量
     */
    static async debtCount() {
        let result = await JLRAPI.commonRequest(JLRAPI.api.GET_HISTORY_LIST);
        let debtCount = 0
        if (result && result.code === 0) {
            let data = result.data;
            for (let i = 0; i < data.length; i++) {
                if (data[i].order.isDebt) {
                    debtCount++;
                }
            }
        }
        window.scope.debtCount = debtCount;
        return window.scope.debtCount;
    }


}

/**
 *@global
 *@description window onload the app entry point
 */
document.onload = Init.onLoad();