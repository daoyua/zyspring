/**
 * Created by sunxinhan on 2019/9/3.
 */
/**
 * @namespace page
 * @description 停简单绑定免密支付页面
 */
class tjdbindpaymentPage {
    constructor() {

    }

    unLoad() {
        console.log('unLoad')
    }
    b_faction() {
        console.log('-> tjdbindpaymentPage b_faction <-')
        // 更新二维码，可以直接调用onload方法
        this.onLoad()
    }

    async onLoad() {
        let result = await JLRAPI.commonRequest(JLRAPI.api.SET_PIN_FREE, {
            provider: "tjd"
        })
        if (result && result.code === 0) {
            new QRCode(document.getElementById("qrcodepic_img"), result.data[0].signUrl);
        }
        console.log('pageOnLoad')
    }
}