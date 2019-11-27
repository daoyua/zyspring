/**
 * Created by sunxinhan on 2019/9/3.
 */
/**
 * @namespace page
 * @description 支付页面
 */
class payPage {
    constructor() {

    }

    unLoad() {
        console.log('pay page unload')
    }

    b_faction() {
        console.log('-> enter payPage b_faction <-')
        // TODO
    }

    onLoad() {
        console.log('pay page onload')
        console.log('wechatUrl', window.scope.vechileinfo.wechatUrl)
        console.log('alipayUrl', window.scope.vechileinfo.alipayUrl)

        new QRCode(document.getElementById("qrcodepic_img"), window.scope.vechileinfo.alipayUrl);

        document.querySelector("#pay_wechatpay").onclick = function () {
            console.log(document.querySelector("#qrcodepic_img"))
            document.querySelector("#qrcodepic_img").innerHTML="";
            new QRCode(document.getElementById("qrcodepic_img"), window.scope.vechileinfo.wechatUrl);
        }
        document.querySelector("#pay_alipay").onclick = function () {
            document.querySelector("#qrcodepic_img").innerHTML="";
            new QRCode(document.getElementById("qrcodepic_img"), window.scope.vechileinfo.alipayUrl);
        }
    }
}