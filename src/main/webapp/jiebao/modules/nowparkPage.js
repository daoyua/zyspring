class nowparkPage {
    constructor(activeRoute) {
        this.id = activeRoute ? activeRoute.id : "";
        this.domQuery = this.domQuery;
        this.domQueryAll = this.domQueryAll;
        this.nowpark_btnSetPayment = this.domQuery("#nowpark_btnSetPayment");
        this.nowpark_btnScan = this.domQuery("#nowpark_btnScan")
        this.nowpark_Manually = this.domQuery("#nowpark_Manually")
        this.nowpark_close_button = this.domQuery("#nowpark_close_button")
        this.nowpark_notifyMsg = this.domQuery("#nowpark_notifyMsg")
        this.nowpark_left_span = this.domQueryAll(".detail_info_left span");
        this.changToDetail = this.domQuery("#changToDetail")
        this.infoIcon = this.domQuery(".info_icon")
        this.nowpark_nocps = this.domQuery("#nowpark_nocps")
        this.nowpark_content = this.domQuery("#nowpark_content")
        this.nowpark_parklogo = this.domQuery("#nowpark_parklogo")
        this.intervalId = -1;
        this.reloadTime = 60000;
        this.mainContentShow = true;
        this.currentParkingId = '';
    }

    domQuery(str) {
        if (this.id) {
            let container = document.querySelector(`#${this.id}`);
            if (container) {
                return container.querySelector(str)
            }
            else {
                return undefined;
            }
        }
        else {
            return document.querySelector(str);
        }

    }

    domQueryAll(str) {
        if (this.id) {
            let container = document.querySelector(`#${this.id}`);
            if (container) {
                return container.querySelectorAll(str)
            }
            else {
                return undefined;
            }
        }
        else {
            return document.querySelectorAll(str);
        }

    }


    unLoad() {
        console.log('now park unLoad')
        clearInterval(this.intervalId)
        this.intervalId = -1;
    }

    b_faction() {
        // this.onLoad()
        this.loadData()
    }


    async loadData() {
        let that = this;
        let result = await  JLRAPI.commonRequest(JLRAPI.api.PARKING_STATUS)
        if (result && result.data.active && result.code === 0) {
            that.domQuery("#nowpark-body-container").style.display = "block"

            if (result.data.payUrls && result.data.payUrls.length > 0) {
                result.data.payUrls.forEach(i => {
                    if (i.type === "") {
                        window.scope.vechileinfo.alipayUrl = i.payUrl;
                        window.scope.vechileinfo.wechatUrl = i.payUrl;
                    }
                    if (i.type && i.type.toString() === "0") {
                        window.scope.vechileinfo.wechatUrl = i.payUrl;
                    }
                    if (i.type && i.type.toString() === "1") {
                        window.scope.vechileinfo.alipayUrl = i.payUrl;
                    }

                })
            }
            // 停车场id
            this.currentParkingId = result.data.parkingId
            that.domQuery(".nowpark_parkname").innerText = result.data.parkingName;
            that.domQuery(".nowpark_price").innerText =
                window.scope.locale.t(`${window.scope.localLanguage}.common.common_textUnit_moeny`, {price: parseFloat(result.data.remainingFee).toFixed(2)});
            that.nowpark_left_span[0].innerHTML = `<span class="nowpark_left">` + window.scope.locale.t(`${window.scope.localLanguage}.nowpark.paidName`) + `</span>`
                + window.scope.locale.t(`${window.scope.localLanguage}.nowpark.paidValue`, {paid: parseFloat(result.data.paidFee).toFixed(2)});

            let duration_hour = Math.floor(result.data.parkTime / 60 / 60);
            let duration_min = Math.floor((result.data.parkTime / 60) % 60);
            that.nowpark_left_span[1].innerHTML = `<span class="nowpark_left">` + window.scope.locale.t(`${window.scope.localLanguage}.nowpark.durationName`) + `</span>`
                + window.scope.locale.t(`${window.scope.localLanguage}.nowpark.durationValue`, {
                    hour: duration_hour,
                    min: duration_min
                });
            let utcdate = new Date(result.data.enteringTime);
            let startTime = {
                date: utcdate.getUTCDate() < 10 ? '0' + utcdate.getUTCDate() : utcdate.getUTCDate(),
                year: utcdate.getFullYear(),
                month: (utcdate.getUTCMonth() + 1 < 10) ? '0' + (utcdate.getUTCMonth() + 1) : (utcdate.getUTCMonth() + 1),
                hour: utcdate.getHours() < 10 ? '0' + utcdate.getHours() : utcdate.getHours(),
                min: utcdate.getMinutes() < 10 ? '0' + utcdate.getMinutes() : utcdate.getMinutes(),
            }
            that.nowpark_left_span[2].innerHTML = `<span class="nowpark_left">` + window.scope.locale.t(`${window.scope.localLanguage}.nowpark.startTimeName`) + `</span>`
                + window.scope.locale.t(`${window.scope.localLanguage}.nowpark.startTimeValue`, startTime);
            that.getPageDesc(result.data)
        }
        else {
            that.nowpark_nocps.style.display = "flex"
            console.log("nocps 设置显示", that.nowpark_nocps)
            that.nowpark_content.hide();
        }
    }


    async i18nchangeCallback() {
        await this.loadData();
    }

    async getPageDesc(data) {
        let that = this;
        if (data) {
            let pinFree = data.provider === "tjd" ? window.scope.TJDpinFree : window.scope.ETCPpinFree;
            //免密支付永久关闭，手动支付不开启时，设置免密支付按钮展示
            if (!pinFree && data.payManual.toString() === "false") {
                that.nowpark_btnSetPayment.show();
                switch (data.provider) {
                    case "etcp":
                        that.nowpark_btnSetPayment.onclick = async () => {
                            // Router.To("etcpbindpayment")
                            this.mainContentShow = false;
                            console.log('etcp')
                            //当点击免密按钮则隐藏nowpark_content,底部导航部分
                            this.domQuery("#nowpark_content").style.display = "none"
                            document.querySelector(".jlr_menu").style.display = "none"
                            //显示etcp页面
                            this.domQuery(".etcp_style").style.display = "flex"
                            //修改body-container的height值
                            this.domQuery(".body-container").style.height = `${720}px`
                            //显示close button
                            this.domQuery("#close_button").style.display = "flex"
                            document.querySelector("#nowpark_close_button").style.display = "flex"
                            //清空etcp_qrcodepic_img里的内容
                            let result = await JLRAPI.commonRequest(JLRAPI.api.SET_PIN_FREE, {
                                provider: "etcp"
                            })
                            if (result && result.code === 0) {
                                document.querySelector("#etcp_qrcodepic_img").innerHTML = ""
                                new QRCode(document.getElementById("etcp_qrcodepic_img"), result.data[0].signUrl);
                            }
                        }
                        break;

                    case "tjd":
                        that.nowpark_btnSetPayment.onclick = async () => {
                            // Router.To("tjdbindpayment")
                            console.log('tjd')
                            //当点击免密按钮则隐藏nowpark_content,底部导航部分
                            document.querySelector("#nowpark_content").style.display = "none"
                            document.querySelector(".jlr_menu").style.display = "none"
                            //显示tjd页面
                            document.querySelector(".nowpark_tjd_style").style.display = "flex"
                            //修改body-container的height值
                            document.querySelector(".body-container").style.height = `${720}px`
                            //显示close button
                            document.querySelector("#nowpark_close_button").style.display = "flex"
                            //清空tjd_qrcodepic_img中的内容
                            let result = await JLRAPI.commonRequest(JLRAPI.api.SET_PIN_FREE, {
                                provider: "tjd"
                            })
                            if (result && result.code === 0) {
                                document.querySelector("#tjd_qrcodepic_img").innerText = ""
                                new QRCode(document.getElementById("tjd_qrcodepic_img"), result.data[0].signUrl);
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
            //如果免密支付已经开启
            if (pinFree) {//此处需要进行修改优先判断是ETCP还是TJD
                that.nowpark_notifyMsg.innerText = window.scope.locale.t(`${window.scope.localLanguage}.nowpark.pinFreeOn`)
            }
            else {
                that.nowpark_notifyMsg.innerText = window.scope.locale.t(`${window.scope.localLanguage}.nowpark.pinFreeOff`)
            }

            if (data.payManual.toString() === "true") {
                that.nowpark_notifyMsg.innerText = window.scope.locale.t(`${window.scope.localLanguage}.nowpark.pinFreeOffForNow`)
                that.nowpark_Manually.hide()
            }


            //todo:在qr-code支付完成后会有推送过来---目前没有
            //that.nowpark_notifyMsg.innerText = window.scope.locale.t(`${window.scope.localLanguage}.nowpark.orderStatusOverTime`)
            // 已经完成支付后显示的离场时间
            // that.nowpark_notifyMsg.innerText = window.scope.locale.t(`${window.scope.localLanguage}.nowpark.orderStatusPaid`, {
            //     date: 11,
            //     year: 2019,
            //     month: '06',
            //     hour: '12',
            //     mins: 45
            // })
            //todo:NOTIFICATION_EXIT_PARKING---在离场的时候接收到的通知消息--目前没有
            //that.nowpark_notifyMsg.innerText = window.scope.locale.t(`${window.scope.localLanguage}.nowpark.orderStatusFinish`);
            if (data.provider === "tjd") {
                this.nowpark_parklogo.className = "icon iconfont Logo_TJD"
            } else {
                this.nowpark_parklogo.className = "icon iconfont Logo_ETCP1"
            }
        }
    }

    async onLoad() {
        await this.loadData();
        //.prop('checked', true)
        // document.getElementById("#rsvp-going").prototype('checked', true)
        // this.intervalId = self.setInterval(await this.loadData.bind(this), this.reloadTime)

        //click 'i' icon change to seachdetail page
        this.infoIcon.onclick = () => {
            window.scope.fromPayToDetail = true
            window.scope.fromPayParkingIdToDetail = this.currentParkingId
            Router.To("searchdetail")
        }
        //隐藏close button
        this.nowpark_btnScan.onclick = function () {
            // Router.To("pay")
            this.mainContentShow = false;
            //获取tab的选中样式
            var ele = document.getElementsByTagName('input')
            for (let i = 0; i < ele.length; i++) {
                console.log(ele[i].value)
                if (ele[i].value === "yes") {
                    ele[i].checked = "checked"
                }
            }
            //当点击扫码支付按钮则隐藏nowpark_content,底部导航部分
            document.querySelector("#nowpark_content").style.display = "none"
            document.querySelector(".jlr_menu").style.display = "none"
            //修改body-container的height值
            document.querySelector(".body-container").style.height = `${720}px`
            //显示close button
            document.querySelector("#nowpark_close_button").style.display = "flex"
            //显示扫码支付页面
            document.querySelector(".nowpark_pay_style").style.display = "flex"
            //获取支付page的二维码start
            console.log('pay page onload')
            console.log('wechatUrl', window.scope.vechileinfo.wechatUrl)
            console.log('alipayUrl', window.scope.vechileinfo.alipayUrl)
            new QRCode(document.getElementById("qrcodepic_img"), window.scope.vechileinfo.alipayUrl);
            document.querySelector("#nowpark_pay_wechatpay").onclick = function () {
                console.log(window.scope.vechileinfo.wechatUrl)
                // document.querySelector("#qrcodepic_img").style.display='none';
                // document.querySelector("#wechatpay_qrcodepic_img").style.display='flex';
                document.querySelector("#wechatpay_qrcodepic_img").innerHTML = "";
                new QRCode(document.getElementById("wechatpay_qrcodepic_img"), window.scope.vechileinfo.wechatUrl);
            }
            document.querySelector("#nowpark_pay_alipay").onclick = function () {
                console.log(window.scope.vechileinfo.alipayUrl)
                // document.querySelector("#wechatpay_qrcodepic_img").style.display='none';
                // document.querySelector("#qrcodepic_img").style.display = "flex";
                document.querySelector("#qrcodepic_img").innerHTML = "";
                new QRCode(document.getElementById("qrcodepic_img"), window.scope.vechileinfo.alipayUrl);
            }
            //获取支付page的二维码end
        }
        //click close button 关闭当前页面
        this.nowpark_close_button.onclick = function () {
            //隐藏close button,pay page,tjd page
            this.mainContentShow = true;
            document.querySelector("#nowpark_close_button").style.display = "none"
            document.querySelector(".nowpark_pay_style").style.display = "none"
            document.querySelector(".nowpark_tjd_style").style.display = "none"
            document.querySelector(".etcp_style").style.display = "none"
            //清空img中的url
            document.querySelector("#qrcodepic_img").innerHTML = "";
            //显示nowpark_content,底部导航部分
            document.querySelector("#nowpark_content").style.display = "block"
            document.querySelector(".jlr_menu").style.display = "flex"

        }
        this.nowpark_Manually.onclick = function () {
            JLRNotify.open(notifyType.ETCPPayment)
        }
        console.log("current park load complete")
        return true;
    }
}