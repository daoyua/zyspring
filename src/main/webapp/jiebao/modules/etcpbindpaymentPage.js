/**
 * Created by sunxinhan on 2019/9/3.
 */
/**
 * @namespace page
 * @description ETCP绑定免密支付页面
 */
class etcpbindpaymentPage {
    constructor() {

    }

    unLoad() {
        console.log('unLoad')
    }
    b_faction() {
        console.log('-> etcpbindpaymentPage b_faction <-')
        // Router.To("searchlist");
        this.onLoad()
    }

    async onLoad() {
        let result = await JLRAPI.commonRequest(JLRAPI.api.SET_PIN_FREE, {
            provider: "etcp"
        })
        console.log(result)
        if (result && result.code === 0) {
            new QRCode(document.getElementById("qrcodepic_img"), result.data[0].signUrl);
        }
        console.log('pageOnLoad')
    }
}