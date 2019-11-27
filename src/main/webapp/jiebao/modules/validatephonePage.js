/**
 * Created by sunxinhan on 2019/9/3.
 */
/**
 * @namespace page
 * @description 手机号码验证页面
 */
class validatephonePage {
    constructor() {
        console.log('validatephonePage constructor')
        this.btn_sendVcode = document.querySelector("#btn_sendVcode");
        this.send_loading = document.querySelector(".send_loading");
        this.btn_validatephone = document.querySelector("#btn_validatephone");
        this.validataphone_phoneNum = document.querySelector("#validataphone_phoneNum");
        this.validataphone_vCode = document.querySelector("#validataphone_vCode");
        this.div_errorMsg = document.querySelector(".errorMsg");
        this.inputkey = document.querySelectorAll("div[data-num]");
        this.backreturn = document.querySelectorAll(".keyboard_row_last div")[1];
        this.send_loading_closebtn = document.querySelectorAll(".send_loading_text span")[2];
        this.keyboard_row_last = document.querySelectorAll(".keyboard_row_last");
        this.phoneNum_temp = "";
        this.vcode = "";
        this.vcode_temp = "";
        this.timeover = 60;
        this.interval = -1;
        this.isTimeover = true;
        this.inputActive = "phone";
        this.phoneNumValidate = false;
        this.vcodeValidate = false;
        this.btn_validatephone.onclick = () => this.confrim();
        this.validataphone_vCode.onclick = () => this.inputActive = "vcode";
        this.validataphone_phoneNum.onclick = () => this.inputActive = "phone";
        this.inputkey.forEach(item => {
            item.onclick = () => {
                if (this.inputActive === "phone") {
                    this.phoneNum += item.dataset.num;
                }
                else {
                    this.vcode += item.dataset.num;
                }
            }
        })
        this.backreturn.onclick = () => {
            if (this.inputActive === "phone") {
                this.phoneNum = this.phoneNum.substr(0, this.phoneNum.length - 1)
            }
            else {
                this.vcode = this.vcode.substr(0, this.vcode.length - 1)
            }
        }

        Object.defineProperty(this, "phoneNum", {
            get: function () {
                return this.phoneNum_temp;
            },
            set: function (value) {
                if (value.length === 11) {
                    if (!(/^1[3456789]\d{9}$/.test(value))) {
                        this.errorMsg(window.scope.locale.t(`${window.scope.localLanguage}.validatephone.error_msg_errorphone`))
                        this.phoneNumValidate = false;
                    }
                    else {
                        this.errorMsg('')
                        this.phoneNumValidate = true;
                    }
                }
                else {
                    this.phoneNumValidate = false;
                }
                if (value.length <= 11) {
                    this.phoneNum_temp = value;
                    this.validataphone_phoneNum.value = this.phoneNum_temp;
                    this.btnActive()
                    this.canSend()
                }
            }
        });
        Object.defineProperty(this, "vcode", {
            get: function () {
                return this.vcode_temp;
            },
            set: function (value) {
                if (value.length <= 6) {
                    this.vcode_temp = value;
                    this.validataphone_vCode.value = this.vcode_temp;
                    if (value.length === 6) {
                        this.vcodeValidate = true;
                        document.querySelector("#validataphone_vCode").className = 'four'
                    }
                    else {
                        this.vcodeValidate = false;
                        document.querySelector("#validataphone_vCode").className = ''
                    }
                    this.btnActive()
                }
            }
        });
        this.send_loadingTimeOut = -1;
        this.send_loading_closebtn.onclick = this.closeSendLoading.bind(this);
        this.btn_sendVcode.onclick = this.sendVCode.bind(this);
    }

    unLoad() {
        console.log('validatephonePage unLoad')
        clearInterval(this.interval);
    }
    b_faction() {
        console.log('-> validatephonePage b_faction <-')
        // Router.To("searchlist");
    }

    errorMsg(value) {
        this.div_errorMsg.innerText = value;
    }

    onLoad() {
        console.log('validatephonePage onLoad')
        let appbackbtn = document.querySelector(".backbutton");
        appbackbtn.onclick = () => window.history.back(-1)
    }

    async sendVCode() {
        let that = this;
        this.showSendLoading();
        that.changeBtnText();
        let result = await JLRAPI.commonRequest(JLRAPI.api.SEND_VERIFICATION_CODE,
            {
                phoneNumber: this.phoneNum,
                countryCode: "CN"
            }
        )
        this.closeSendLoading()
        if (result && result.code === 0) {
            JLRNotify.open(notifyType.PhoneVcodeSuccess)
        }
    }

    showSendLoading() {
        this.send_loading.show();
    }

    closeSendLoading() {
        this.send_loading.hide();
    }

    btnActive() {
        console.log('btnActive')
        let canActive = this.vcodeValidate && this.phoneNumValidate && this.btn_validatephone.hasAttribute("disabled");
        canActive ? this.btn_validatephone.attributes.removeNamedItem("disabled") : this.btn_validatephone.setAttribute("disabled", "disabled")
    }

    canSend() {
        let canSend = this.phoneNumValidate && this.btn_sendVcode.hasAttribute("disabled") && this.isTimeover;
        console.log("canSend Vcode", canSend)
        console.log("isTimeover", this.isTimeover)
        canSend ? this.btn_sendVcode.attributes.removeNamedItem("disabled") : this.btn_sendVcode.setAttribute("disabled", "disabled")
    }

    async  confrim() {

        let result = await JLRAPI.commonRequest(JLRAPI.api.VERIFY_VERIFICATION_CODE, {
            phoneNumber: this.phoneNum,
            countryCode: 'CN',
            code: this.vcode
        })
        if (result && result.code === 0) {
            window.scope.vechileinfo.phoneNum = this.phoneNum;
            Router.To("vechileinfo")

        }
        else {
            this.errorMsg(window.scope.locale.t(`${window.scope.localLanguage}.validatephone.error_msg_vcodevalideerror`))
        }
    }

    changeBtnText() {
        let timeover = this.timeover;
        let that = this;
        this.btn_sendVcode.setAttribute("disabled", true)
        this.interval = setInterval(function () {
            timeover--;
            that.isTimeover = false;
            if (timeover >= 1) {
                that.btn_sendVcode.innerText = timeover + "S";
            }
            else {
                that.isTimeover = true;
                clearInterval(that.interval);
                that.btn_sendVcode.attributes.removeNamedItem("disabled")
                that.btn_sendVcode.innerText = window.scope.locale.t(`${window.scope.localLanguage}.validatephone.btnsendCodeAgain`)
            }
        }, 1000)
    }
}