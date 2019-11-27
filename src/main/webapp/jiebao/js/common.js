/**
 * environment
 * qa:run at the phoenix studio or the rig
 * dev:run at the PC web browser
 * @global
 */
window.ENV = "dev"

/**
 * api qa environment
 * @global
 */
window.env_qa = {
    translateObj: "",
    requestDomain: "http://localhost:11000/api/v1",
    appid: "PARKING_APP_CN",
    productID: "JIPIVI_CN",
    productVersion: "2.0",
}

/**
 * @mixin Element.prototype.addClass
 * @param classname {string} add class name on dom
 */
Element.prototype.addClass = function (classname) {
    let hasCls = this.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
    if (hasCls === null) {
        this.className += " " + classname;
    }
};
/**
 * @mixin Element.prototype.hide
 * @description hide the select dom
 */

Element.prototype.hide = function () {
    this.style.display = "none";
};

/**
 * @mixin Element.prototype.show
 * @description show the select dom
 */
Element.prototype.show = function () {
    this.style.display = "flex";
};

/**
 * @global
 * @property locale {phoenix.i18n}  the global value
 * @property localLanguage {string} system language
 * @property isLogin {boolean}  the user login staus
 * @property hasVechile  {boolean} whether the user registered the vehicle
 * @property parkNow  {boolean}    is the vehicle in the parking lot
 * @property firstlanuch  {boolean} whether the user lanuch
 * @property phoenixReady  {boolean}  phoenix ready status
 * @property vechileinfo {Object} vehicle infomation
 * @property destination {phoenix.location} vehicle destination
 */
const APP_STATUS = {
    LANUCHING: "lanuching",
    LANUCHSTART: "lanuchStart",
    LANUCHEND: "lanuchEnd"
}
const Feature = {
    NewsCenter: "newscenter",
    AppDrawer: "appdrawer",
    HomeTile: "hometile",
    SpeechCommond: "speechcommond",
    EnterParkNotification: "enterparknotification"
}

window.scope = {
    locale: undefined,
    localLanguage: "",
    isLogin: false,
    hasVechile: false,
    parkNow: false,
    firstlanuch: false,
    phoenixReady: false,
    destination: undefined,
    choseLanguage: '',
    destinationChanged: false,
    vechileinfo: {
        phoneNum: "",
        plateNum: "京AG9999",
        agreementChk: false,
        ETCPpinFree: false,
        TJDpinFree: false,
        wechatUrl: "",
        alipayUrl: ""
    },
    carLocation: {
        lng: '',
        lat: ''
    },
    mobileData: true,
    isConnected: true,
    fromFeature: "",
    isMoving: false,
    fromDetail: false,
    appstatus: APP_STATUS.LANUCHSTART,
    lastPage: window.location.hash,
    last_app: "",
    pageloadingTimeout: -1,
    pageId: "not_need",
    timeStart: "",
    timeEnd: "",
    time: "",
    loadingQueue: [],
    navQueue: [],
    bfStaus: "loadingStart"
};


/**
 * common class
 * @class
 */
class Common {
    constructor() {

    }


    static  getFeature() {
        let urlSearchParam = new URLSearchParams(window.location.search);
        let feature = urlSearchParam.get('lanuch') || Feature.AppDrawer;

        Object.keys(Feature).forEach(function (key) {
            if (feature === Feature[key]) {
                window.scope.fromFeature = Feature[key];
            }
        });

    }


    /**
     * @async
     * @static
     * @function Common.requestGet
     * @description  test-requestGet
     * @param  {string} url  url address
     * @param {Object} params  http body params
     * @return {Promise<json>}  Data from the URL
     */
    static async requestGet(url, params) {
        try {
            let res = await  fetch(url, {
                method: 'GET',
            });
            return await  res.json();
        }
        catch (e) {
            console.log(e)
        }
    }



    /**
     * @async
     * @static
     * @function Common.getSettingLocal
     * @description get the system language
     */
    static async getSettingLocal() {
        try {
            // let result = await this.getDefaultSetting(phoenix.sys.settings.SettingName.TextLanguage);
            let urlSearchParam = new URLSearchParams(window.location.search);
            let result = urlSearchParam.get('language') || 'en-US';
            window.scope.choseLanguage = result;
            let suportLanArr = ['en-US', 'zh-Hans'];
            if (suportLanArr.indexOf(result) < 0) {
                window.scope.localLanguage = suportLanArr[0];
            }
            else {
                window.scope.localLanguage = result
            }
        }
        catch (e) {
            console.log("error", e);
            throw  e;
        }

    }

    /**
     * @description get the theme in system setting
     * @function Common.getTheme
     * @return {string}  system theme value
     */
    static  getTheme() {
        let urlSearchParam = new URLSearchParams(window.location.search);
        //todo:此处的默认值是为了在phoenix studio下正常运行添加，上线前需要酌情处理
        let theme = urlSearchParam.get('theme') || 'nights';
        let language = urlSearchParam.get('language') || 'en-US';
        let loading_Text = language === "en-US" ? "Searching for Park and Pay locations..." : "正在为您搜索停车场...";
        document.querySelector("#index_page_loading_text").innerText = loading_Text;
        function setLocalisedFont(theme, language) {
            let html = document.getElementsByTagName("html")[0];
            let font = "TipperaryForJLR-" + (theme.toLowerCase() === "night" ? "Reg" : "SB");
            switch (language) {
                case "ar-SA":
                    font += "_AR";
                    break;
                case "zh-Hant":
                    font += "_HKTW";
                    break;
                case "hi-IN":
                    font += "_IN";
                    break;
                case "ja-JP":
                    font += "_JP";
                    break;
                case "ko-KR":
                    font += "_KR";
                    break;
                default:
                    font += "_PRC";
                    break;
            }
            html.style.fontFamily = font;
        }

        setLocalisedFont(theme, language);
        return theme
    }

    /**
     * @async
     * @static
     * @description get system settings by the value
     * @function Common.getDefaultSetting
     * @param key {string} system settings key
     * @return {string} the key's value
     */
    static async getDefaultSetting(key) {
        if (window.scope.phoenixReady) {
            let settingsManagerObj = phoenix.sys.settings.settingsManager;
            let value = await settingsManagerObj.getValue(key);
            return value;
        }
    }


    /**
     * set the application's theme
     * @function Common.changeTheme
     * @param dayOrnight {string} the theme value,'night' for dark ,'day' for light
     */
    static changeTheme(dayOrnight = 'night') {
        if (dayOrnight && dayOrnight.toLowerCase() !== 'night' && dayOrnight.toLowerCase() !== 'day') {
            throw  `the value must be 'Night' or 'Day'`
        }
        let classValue = document.body.className;
        let hasday = classValue.indexOf('night') >= 0;
        let hasnight = classValue.indexOf('day') >= 0;
        if (hasday === false && hasnight === false) {
            document.body.className += ' ' + dayOrnight.toLowerCase();//如果不存在黑白天皮肤的情况
        }
        else {
            classValue = classValue.replace('night', dayOrnight.toLowerCase());
            classValue = classValue.replace('day', dayOrnight.toLowerCase());
            document.body.className = classValue;
        }
    }


    /**
     * @async
     * @static
     * @function Common.loadLocal
     *@description get the phoenix.i18n object
     */
    static async loadLocal() {
        window.scope.locale = new phoenix.i18n.Localization();
        let res = await Common.requestGet(`./locales/${window.scope.localLanguage}/translations.json`);
        window.scope.locale.extend(res);
    }


    /**
     * @async
     * @static
     * @function common.i18nChange
     * @description 切换中英文
     */
    static async i18nChange() {
        let replaceValue = window.scope.localLanguage === 'en-US' ? "en" : "cn";
        let bodyClassName = document.body.className;
        let hasCn = bodyClassName.indexOf('cn') >= 0;
        let hasEn = bodyClassName.indexOf('en') >= 0;
        if (hasCn === false && hasEn === false) {
            document.body.className += ' ' + replaceValue;//如果不存在中英文的情况
        }
        else {
            bodyClassName = bodyClassName.replace('cn', replaceValue);
            bodyClassName = bodyClassName.replace('en', replaceValue);
            document.body.className = bodyClassName
        }

        Page.setLocalText();
    }


    /**
     * @async
     * @static
     * @function common.PhoenixReady
     * @description  get the phoenix.ready
     */
    static async phoenixReady() {
        try {
            await phoenix.ready;
            if (phoenix.versions) {
                window.scope.phoenixReady = true;
            }
            else {
                window.scope.phoenixReady = false;
            }
        }
        catch (e) {
            JlrError.catchError(e)
        }
    }


    /**
     * @async
     * @static
     * @function commom.getDestinations
     * @description  get the destinations
     */
    static async   getDestinations() {
        try {
            let map = new phoenix.maps.Map();
            let route = await map.activeRoute();
            let location = await route.destination();
            let destination = await location.coordinates();
            if (window.scope.destination) {
                if (destination && destination.longitude === window.scope.destination.longitude && destination.latitude === window.scope.destination.latitude) {
                    window.scope.destinationChanged = false;
                }
                else {
                    window.scope.destinationChanged = true;
                }
            }
            else {
                if (destination && destination.longitude && destination.latitude) {
                    window.scope.destinationChanged = true;
                }
                else {
                    window.scope.destinationChanged = false;
                }
            }
            console.log('destination:', JSON.stringify(destination));
            console.log('destinationChagnge:', window.scope.destinationChanged);
            window.scope.destination = destination;
        }
        catch (e) {
            //todo:此处需要确认1004是否是错误码,不应该在没有数据的时候返回错误码
            //error:1003 导航可能还在加载状态,无法正常运转
            //为了去掉无用的Notification，此处暂时对1004，1003进行过滤
            console.log("导航又报错啦~")
            JlrError.catchError(e)
        }
    }


    /**
     * @async
     * @static
     * @function common.navigation
     * @description send  latlon to the rig navigation
     */
    static async navigation(lon, lat) {
        try {
            console.log("navigation")
            let map = new phoenix.maps.Map();
            let coordinates = {latitude: lat, longitude: lon}
            let location = new phoenix.maps.Location(coordinates);
            let options = {alternativeRoutes: false}
            let routes = await map.setDestinations([location], options);
            console.log('routes:', routes)
            JLRNotify.open(notifyType.NavigationError)
        }
        catch (e) {
            JLRNotify.open(notifyType.NavigationError)
        }
    }

    /**
     * @async
     * @static
     * @function commom.telephony
     * @description  get the telephony
     */
    static async getTelephony(telephonyNumber) {
        let telephonyManagerObj = phoenix.telephony.telephonyManager;
        let number = telephonyNumber;
        telephonyManagerObj.dial(number).then((responseObj) => {
            console.log("The telephonyManager Object response " + responseObj);
        })
    }

    /**
     * @async
     * @static
     * get the car current location (lat, lng)
     */
    static async getCarLocation() {
        try {
            let locationInfo = null
            if (window.scope.phoenixReady) {
                let location = await phoenix.maps.Map.currentLocation()
                locationInfo = await location.coordinates()
                window.scope.carLocation.lat = locationInfo.latitude || ''
                window.scope.carLocation.lng = locationInfo.longitude || ''
            }
            console.log('Car Location:', JSON.stringify(window.scope.carLocation));
        }
        catch (e) {
            JlrError.catchError(e)
        }

    }

    static showLoading() {
        document.querySelector(".loading_bg").style.display = "flex";
        document.querySelector("#index_page_loading").style.display = "flex"
        // window.scope.pageloadingTimeout = setTimeout(function () {
        //     document.querySelector(".loading_bg").style.display = "flex";
        //     document.querySelector("#index_page_loading").style.display = "flex"
        //
        // }, 300)
    }

    static BF_Loading() {
        let app_container = document.querySelector(".app-container");
        if (app_container) {
            app_container.style.display = "none"
        }
        document.querySelector("#index_page_loading").style.display = "flex"
        document.querySelector("#index_page_loading_text").style.display = "flex"
        document.querySelector("#menu-bar").style.display = "none"
    }

    static hideLoading() {
        // clearTimeout(window.scope.pageloadingTimeout)
        document.querySelector(".loading_bg").style.display = "none";
        document.querySelector("#index_page_loading").style.display = "none"
        document.querySelector("#index_page_loading_text").style.display = "none"
        document.querySelector(".app-container").style.display = "flex"
    }

    static BF_hideLoading() {
        // clearTimeout(window.scope.pageloadingTimeout)
        document.querySelector(".loading_bg").style.display = "none";
        document.querySelector("#index_page_loading").style.display = "none"
        document.querySelector("#index_page_loading_text").style.display = "none"
        document.querySelector(".app-container").style.display = "flex"
        if (["searchlist", "nowpark", "orderhistory"].indexOf(window.location.hash.replace("#", "")) >= 0) {
            document.querySelector("#menu-bar").style.display = "flex"
        }
    }

    static  getPageId() {
        //pageId= route_utcTime
        if (window.activeRoute && window.activeRoute.name) {
            window.scope.pageId = window.activeRoute.name;
        }
        else {
            window.scope.pageId = "not_need";
        }
    }

    /**
     * @async
     * @static
     * check the  network ,whether the mobile data is open ,and the network is connected
     */
    static async getNetWork() {
        try {


            //todo:api错误所以需要先进行模拟设置,此需求需要在实现conectivity中进行解决，ticket需要即刻提出
            window.scope.isConnected = true;
            window.scope.mobileData = true;
            return;

            let settingsManagerObj = phoenix.sys.settings.settingsManager;
            window.scope.mobileData = await  settingsManagerObj.getValue(phoenix.sys.settings.SettingName.NetworkConnectivity);
            let networkMananagerObject = phoenix.net.networkManager;
            if (window.scope.mobileData) {
                window.scope.isConnected = await  networkMananagerObject.isConnected();//network is connected
            }

        }
        catch (e) {
            JlrError.catchError(e);
        }

    }
}