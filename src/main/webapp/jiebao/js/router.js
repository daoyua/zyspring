/**
 * Created by sunxinhan on 2019/6/21.
 */
/**
 * @global
 * @description 当前展示的路由对象
 */
const activeRoute = null;
/**
 * @description Router 页面路由加载类
 * @class
 */
class Router {

    /**
     *
     */
    constructor() {

    }

    static get routeMapping() {
        return [
            {
                name: "welcome",
                path: "./part/welcome.html",
                get Page() {
                    return welcomePage;
                },
                state: "ready"
            },
            {
                name: "simulator",
                path: "./part/simulator.html",
                get Page() {
                    return simulator;
                },
                state: "ready"
            },
            {
                name: "pay",
                path: "./part/pay.html",
                get Page() {
                    return payPage;
                },
                state: "ready"
            },
            {
                name: "agreement",
                path: "./part/agreement.html",
                get Page() {
                    return agreementPage;
                },
                state: "ready"

            },
            {
                name: "etcpbindpayment",
                path: "./part/etcpbindpayment.html",
                get Page() {
                    return etcpbindpaymentPage;
                },
                state: "ready"
            },
            {
                name: "orderhistory",
                path: "./part/orderhistory.html",
                get Page() {
                    return OrderHistoryPage;
                },
                state: "ready"
            },
            {
                name: "nowpark",
                path: "./part/nowpark.html",

                get Page() {
                    return nowparkPage;
                },
                state: "ready"
            },
            {
                name: "validatephone",
                path: "./part/validatephone.html",


                get Page() {
                    return validatephonePage;
                },
                state: "ready"
            },
            {
                name: "vechileinfo",
                path: "./part/vechileinfo.html",


                get Page() {
                    return vechileinfoPage;
                },
                state: "ready"
            },
            {
                name: "searchlist",
                path: "./part/searchlist.html",
                get Page() {
                    return SearchListPage;
                },
                state: "ready"
            },
            {
                name: "tjdbindpayment",
                path: "./part/tjdbindpayment.html",
                get Page() {
                    return tjdbindpaymentPage;
                },
                state: "ready"
            },
            {
                name: "searchdetail",
                path: "./part/searchdetail.html",
                get Page() {
                    return SearchDetailPage;
                },
                state: "ready",
                backButton: true

            },
            {
                name: "connectivity",
                path: "./part/connectivity.html",
                get Page() {
                    return Connectivity;
                },
                state: "ready"
            }
        ];
    }

    /**
     * 监听浏览器url-hash 变化
     */
    async  changeLinser() {
        //url变化监听器
        if (window.location.hash) {
            this.hashUrlChange()
        }
        let that = this;
        if (('onhashchange' in window) && ((typeof document.documentMode === 'undefined') || document.documentMode == 8)) {
            // 浏览器支持onhashchange事件
            window.onhashchange = that.hashUrlChange.bind(this);
        }


    }

    /**
     * url-hash变化并调用loadModel
     */
    hashUrlChange() {
        if (!window.scope.isLogin) {//没有登录的话
            return;
        }
        //如果数据一切正常
        //list->detail  detail,list
        let route = null;
        if (window.activeRoute && window.location.hash === "#searchlist" && window.activeRoute.name === "searchdetail") {
            window.scope.fromDetail = true;
        }
        Router.routeMapping.map(item => {
            if (item.name === window.location.hash.replace('#', '').replace('.html', '')) {
                route = item;
            }
        })

        let tabList = ["searchlist", "nowpark", "orderhistory"]
        if (tabList.indexOf(route.name) >= 0) {
            if (window.activeRoute && tabList.indexOf(window.activeRoute.name) >= 0) {
                Router.loadTabModel(route);
            }
            else {
                Router.loadModel(route);
            }
        }
        else {
            Router.loadModel(route);
        }
        if (window.activeRoute && window.activeRoute.name !== 'connectivity') {
            if (!window.scope.mobileData) {
                JLRNotify.open(notifyType.ConnectError_Enable)
            }
            if (!window.scope.isConnected) {
                JLRNotify.open(notifyType.MobileError_Enable)
            }
        }


    }

    static async loadModel(route) {
        try {
            if (window.activeRoute) {
                if (window.activeRoute && window.activeRoute.activeRoutePage) {
                    window.activeRoute.activeRoutePage.unLoad()//保证上一个页面的unload执行完成
                }
            }
            let linktags = document.querySelector("link[rel=import]");
            if (linktags) {
                document.head.removeChild(linktags)
            }
            let linkTag = document.createElement('link');
            linkTag.setAttribute('rel', 'import');
            linkTag.setAttribute('href', route.path);
            linkTag.setAttribute('id', "link_" + route.name);
            linkTag.onload = async function (link) {
                let route = {
                    name: link.path[0].id.replace("link_", "")
                }
                let container_id = "app-container-" + new Date().getTime()
                window.activeRoute = Router.routeMapping.find(i => i.name === route.name);
                window.activeRoute["id"] = container_id;
                let html = window["link_" + route.name].import.body.innerHTML;
                document.querySelectorAll(".app-container").forEach(i => {
                    i.remove()
                })
                let div = document.createElement("div");
                div.className = "app-container";
                div.id = container_id;
                div.innerHTML = html;
                document.body.appendChild(div);
                document.body.id = window.activeRoute.name;
                div.style.display = "flex";
                await Page.onLoad();
                Common.BF_hideLoading()

            }
            document.head.appendChild(linkTag);
        }
        catch (e) {
            console.log(e)
        }

    }

    /**
     * 进行页面加载
     * @param route  需要加载的route
     */
    static async loadTabModel(route) {
        try {
            let linktags = document.querySelector("link[rel=import]");
            if (linktags) {
                document.head.removeChild(linktags)
            }

            let linkTag = document.createElement('link');
            linkTag.setAttribute('rel', 'import');
            linkTag.setAttribute('href', route.path);
            linkTag.setAttribute('id', "link_" + route.name);
            linkTag.onload = async function (link) {
                let route = {
                    name: link.path[0].id.replace("link_", "")
                }
                //优先卸载原则
                if (window.preUnloadRoute && window.preUnloadRoute.activeRoutePage) {
                    window.preUnloadRoute.activeRoutePage.unLoad()//保证上一个页面的unload执行完成
                }
                window.preUnloadRoute = window.activeRoute;//设置要卸载的route
                let container_id = "app-container-" + new Date().getTime()
                window.activeRoute = Router.routeMapping.find(i => i.name === route.name);
                window.activeRoute["id"] = container_id;
                window.activeRoute["unloadid"] = window.preUnloadRoute.id;
                window.scope.loadingQueue.push(window.activeRoute.id);//加载队列

                let html = window["link_" + route.name].import.body.innerHTML;
                let div = document.createElement("div");
                div.className = "app-container";
                div.id = container_id;
                div.style.display = "none";
                div.innerHTML = html;
                document.body.appendChild(div);


                let active_route = await Page.onLoad(window.activeRoute);


                let queue = window.scope.loadingQueue;
                let isLast = queue.indexOf(active_route.id) === queue.length - 1;
                if (isLast) {
                    console.log("get last")
                    document.querySelectorAll(".app-container").forEach(i => {
                        if (i.id !== active_route.id) {
                            i.remove()
                        }
                    })

                    let active_container = document.querySelector(`#${active_route.id}`)
                    document.body.id = active_route.name;
                    active_container.style.display = "flex";
                    let body_container = active_container.querySelector(".body-container");
                    if (body_container) {
                        body_container.className = "body-container body-container-tab";
                    }
                    window.scope.loadingQueue = [];
                    if (window.scope.navQueue.length === 0 || (window.scope.navQueue[window.scope.navQueue.length - 1] === window.activeRoute.name)) {
                        Common.BF_hideLoading()
                        window.scope.navQueue = [];
                    }
                    else {
                        console.log(window.scope.navQueue)
                    }
                }

            }
            document.head.appendChild(linkTag);
        }
        catch (e) {
            console.log(e)
        }
    }

    static getActiveRoute() {
        return {
            activeRoute: function () {
                if (window.activeRoute && window.activeRoute.name) {
                    return window.activeRoute
                }
                else {
                    return undefined;
                }
            },
            name: window.activeRoute ? window.activeRoute.name : ""
        }
    }

    static To(path, reload) {
        let route = Router.getActiveRoute()
        window.location.hash = path;

        //如果入口页面存在,但是页面不存在已激活对象了，而且访问对象是当前hash对象,页面是不会重新加载的,所以要强制加载
        if (window.location.hash.replace("#", "") === path && route.name === "") {
            new Router().hashUrlChange();
        }
        else {
            //选择性加载,确认hash不会变更,页面不会重新load，但是页面对象没有丢失,根据程序的选择是否重新加载页面
            if (reload && route.name === window.location.hash.replace("#", "")) {
                new Router().hashUrlChange();
            }
        }


    }

    static async b_faction() {
        if (window.activeRoute.activeRoutePage && window.activeRoute.activeRoutePage.b_faction) {
            await window.activeRoute.activeRoutePage.b_faction();
        }
        Common.BF_hideLoading();
    }
}
