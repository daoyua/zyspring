/**
 * Created by sunxinhan on 2019/9/3.
 */
/**
 * @namespace page
 * @description 停车信息验证页面
 */
class vechileinfoPage {
    constructor() {
        this.vechile_plateNum = document.querySelector('#vechile_plateNum');
        this.btnConfirm = document.querySelector("#vechileinfo_btn_active");
        this.errorMsg_container = document.querySelector("#errorMsg_container");
        this.vechile_plateNum.onclick = this.showKeyboard;
        this.btnConfirm.onclick = this.confirmVechileinfo;
        this.plateNumber_verify = false;
    }

    unLoad() {
        console.log('unLoad')
    }

    b_faction() {
        console.log('-> vechileinfoPage b_faction <-')
        // Router.To("searchlist");
    }

    phoneNumTest() {
        document.querySelector("#vechile_plateNum").innerText = window.scope.vechileinfo.plateNum.toUpperCase();
        let testCode = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[0-9a-zA-Z]{5,6}$/
        let plateNum_txt = document.querySelector("#vechile_plateNum").textContent
        document.querySelector("#vechile_plateNum").style.color = "#ffffff"
        if (!testCode.test(window.scope.vechileinfo.plateNum)) {
            this.errorMsg(window.scope.locale.t(`${window.scope.localLanguage}.vechileinfo.errorMsg_container`))
            this.plateNumber_verify = false;
            this.btnActive()
        }
        else {
            this.errorMsg('')
            this.plateNumber_verify = true;
            this.btnActive()
        }
    }

    onLoad() {
        let _this = this
        if (window.scope.vechileinfo.phoneNum) {
            document.querySelector("#vechile_phoneNum").innerText = window.scope.vechileinfo.phoneNum;
            let phoneNum_txt = document.querySelector("#vechile_phoneNum").textContent
            document.querySelector("#vechile_phoneNum").addClass("init_txt")
        }
        if (window.scope.vechileinfo.plateNum) {
            this.phoneNumTest()
        }


        if (window.scope.vechileinfo.agreementChk) {
            document.querySelector('.icon-dischecked').hide()
            document.querySelector('.icon-checked').style.display = 'block'
        } else {
            document.querySelector('.icon-checked').hide()
            document.querySelector('.icon-dischecked').style.display = 'block'
        }
        this.btnActive();
        document.querySelector("#vechile_phoneNum").onclick = function () {
            Router.To("validatephone")
        }


        document.querySelector('.icon-dischecked').addEventListener('click', function () {
            this.hide()
            document.querySelector('.icon-checked').style.display = 'block'
            window.scope.vechileinfo.agreementChk = true;
            _this.btnActive()
        })

        document.querySelector('.icon-checked').addEventListener('click', function () {
            this.hide()
            document.querySelector('.icon-dischecked').style.display = 'block'
            window.scope.vechileinfo.agreementChk = false;
            _this.btnActive()
        })
    }

    async showKeyboard() {
        let keyboardObj = await  new phoenix.sys.keyboard.Keyboard({
            mode: "alphanumeric",
            requireAutocompletion: false,
            hideCharacters: false,
            value: window.scope.vechileinfo.plateNum
        })
        keyboardObj.addEventListener("complete", (event) => {
            window.activeRoute.activeRoutePage.keyboardComplete(event)
        })
        keyboardObj.show()

    }

    async confirmVechileinfo() {
        let result = await JLRAPI.commonRequest(JLRAPI.api.REGISTER_VEHICLE, {
            providers: "",//todo:此处需要跟cloud car 进行确认参数含义，及参数传递值为何值，doc中不存在
            plateNumber: window.scope.vechileinfo.plateNum,
            phoneNumber: window.scope.vechileinfo.phoneNum,
            countryCode: 'CN',
        })
        if (result && result.code === 0) {
            //todo:此处有个需求,需要先判断有没有park session
        let parkingStatusResult = await  JLRAPI.commonRequest(JLRAPI.api.PARKING_STATUS)
        if (parkingStatusResult && parkingStatusResult.data.active && parkingStatusResult.code === 0) {
             Router.To("nowpark")
        }else{
            Router.To("searchlist")
        }

            
        }

    }

    errorMsg(errorMsg) {
        this.errorMsg_container.innerText = errorMsg;
    }

    keyboardComplete(e, value) {
        window.scope.vechileinfo.plateNum = e.text.toUpperCase()
        this.phoneNumTest()
        document.querySelector("#vechile_plateNum").innerText = window.scope.vechileinfo.plateNum ? window.scope.vechileinfo.plateNum : window.scope.locale.t(`${window.scope.localLanguage}.vechileinfo.inputLabel_plateNo`);
    }

    btnActive() {
        let btnActive = document.querySelector("#vechileinfo_btn_active");
        let canActive = this.plateNumber_verify && window.scope.vechileinfo.phoneNum && window.scope.vechileinfo.agreementChk;
        canActive ? btnActive.attributes.removeNamedItem("disabled") : btnActive.setAttribute("disabled", true)
    }

    safeDriving(isSafe) {
        let safeDom = document.querySelector("#vechileinfo .safe_driving");
        isSafe ? safeDom.show() : safeDom.hide()
    }

}