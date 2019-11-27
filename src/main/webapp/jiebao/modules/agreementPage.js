/**
 * Created by sunxinhan on 2019/9/3.
 */
/**
 * @namespace page
 * @description T&C
 */
class agreementPage {
    constructor() {
    }

    unLoad() {
        console.log('unLoad')
    }

    async  onLoad() {
        // var myScrollBar = new ScrollBar('main', 'scrolllist');
        console.log('pageOnLoad')
        let appbackbtn = document.querySelector(".backbutton");
        appbackbtn.onclick = () => window.history.back(-1)
        let res = await JLRAPI.getStaticHtml(JLRAPI.api.TERMS_CONDITION.url)
        document.getElementById('agreementPage_list').innerHTML = res;


    }
}