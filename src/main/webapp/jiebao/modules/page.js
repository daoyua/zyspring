/**
 * @class Page
 * @description 程序入口页面
 */
window["clickcount"] = 0;
class Page {
    constructor(state) {
    }

    b_faction() {
        console.log('-> page b_faction <-')
        // Router.To("searchlist");
    }

    static toPage(routename) {
        window.clickcount += 1;
        console.log("navQueue_点击了", window.clickcount);
        if (window.scope.navClickTimeout) {
            clearTimeout(window.scope.navClickTimeout)
            window.scope.navClickTimeout = -1;
        }
        window.scope.navQueue.push(routename);
        let _routename = routename;
        if (window.scope.navQueue.length === 1) {
            console.log("navQueue_请求了", _routename)
            Router.To(_routename,true);
        }
        else {
            window.scope.navClickTimeout = setTimeout(function () {
                console.log("navQueue_请求了", _routename)
                Router.To(_routename,true);
            }, 500)
        }
    }

    static  changeNavActive(nav_active_index) {
        document.querySelectorAll("#menu-bar .item_group div").forEach((i, index) => {
            if (index === nav_active_index) {
                i.className = "nav_active"
            }
            else {
                if (nav_active_index !== index && i.className.trim() === "nav_active") {
                    i.className = "nav_leave"
                }
            }
        })
    }


    /**
     * 页面onload
     * @function Page.OnLoad
     * @description 页面初始化及切换模块时调用,执行内容包括底部导航处理，坏账数据展示，语言切换处理
     */
    static async onLoad(activeDomid) {

        console.log('index page onload');
        let nav = document.querySelector("#menu-bar")
        let activeTab = ['searchlist', 'nowpark', 'orderhistory'];
        let btnList = document.querySelectorAll("#menu-bar .item_group div");
        let activeIndex = activeTab.indexOf(window.activeRoute.name);
        if (activeIndex >= 0) {
            document.querySelectorAll("#menu-bar .item_group div").forEach((i, index) => {
                if (activeIndex === index) {
                    i.className = "nav_active"
                }
                else if (activeIndex !== index && i.className.trim() === "nav_active") {
                    i.className = "nav_leave"
                }
            })
        }
        else {
            nav.style.display = "none"
        }
        if (nav != null) {
            if (window.scope.debtCount > 0) {
                nav.addClass("menu-bar-debt")//添加账单信息
                nav.querySelectorAll("li button span")[2].setAttribute("data-content", window.scope.debtCount)
            }

            btnList[0].onclick = () => {
                if (btnList[0].className === "nav_active") {
                    return;
                }
                Common.showLoading();
                Page.changeNavActive(0)
                Page.toPage("searchlist")
            }
            btnList[1].onclick = () => {
                if (btnList[1].className === "nav_active") {
                    return;
                }
                Common.showLoading();
                Page.changeNavActive(1)
                Page.toPage("nowpark")

            }
            btnList[2].onclick = () => {
                if (btnList[2].className === "nav_active") {
                    return;
                }
                Common.showLoading()
                Page.changeNavActive(2)
                Page.toPage("orderhistory")

            }
        }
        await Common.i18nChange()//更改页面的语言,是需要在每个页面都进行处理的.在页面逻辑处理完成之后在进行页面的onload
        window.activeRoute.activeRoutePage = new window.activeRoute.Page(activeDomid)//此处创建和unload中的销毁需要使用同一个对象
        let finished = await window.activeRoute.activeRoutePage.onLoad();
        return activeDomid;
    }

    /**
     * @function Page.setLocalText
     * @description 查找指定标签DOM，进行国际化切换
     */
    static setLocalText() {
        document.querySelectorAll("*[data-translate]").forEach(item => {
            if (window.scope.localLanguage) {
                item.innerText = window.scope.locale.t(`${window.scope.localLanguage}.${item.dataset.translate}`)
            }
        })

        document.querySelectorAll("*[data-translatep]").forEach(item => {
            if (window.scope.localLanguage) {
                item.setAttribute("placeholder", window.scope.locale.t(`${window.scope.localLanguage}.${item.dataset.translatep}`))
            }

        })
    }
}