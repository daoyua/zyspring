/**
 * Created by sunxinhan on 2019/9/3.
 */
/**
 * @namespace page
 * @description 欢迎页
 */
class welcomePage {
    constructor() {

    }

    unLoad() {
        console.log('welcome page unLoad')
    }

    b_faction() {
        // Router.To("searchlist");
    }

    onLoad() {
        console.log('welcome page load')
        document.querySelector("#btn_active").onclick = function () {
            Router.To("vechileinfo")
        }
        document.querySelector(".page_end_desc").onclick = function () {
            Router.To("simulator")
        }

        document.querySelector("#login").onclick = async function () {
            let result = await JLRAPI.commonRequest(JLRAPI.api.PASSCODE, {
                passcode: "96209"
            })
        }
    }
}