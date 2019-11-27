/**
 * Created by sunxinhan on 2019/9/18.
 */
class OrderHistoryPage {
    constructor(activeRoute) {
        this.id = activeRoute ? activeRoute.id : "";
        this.domQuery = this.domQuery;
        this.domQueryAll = this.domQueryAll;
    }

    unLoad() {
        console.log('history page  unLoad')
    }

    b_faction() {
        console.log('-> OrderHistoryPage b_faction <-');
        // this.onLoad();
        this.loadData()
    }

    async onLoad() {
        console.log('history page OnLoad')
        await  this.loadData()
        return true;

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

    getHtml(parkname, price, duration, date, id, obj) {

        return `<div class="history_item" data-id="${obj.id}" data-provider="${obj.provider}"><div class="btn_close_bg"><span class="icon iconfont Icon_Close_NightMode"></span></div><div class="item_bg"></div><div id="${id}" class="btn_close Icon_Close"></div><div class="parkname">${parkname}</div><div class="price">${price}</div><div class="duration">${duration}</div><div class="date">${date}</div> <div class="tool_area"><div class="navto"><span class="icon iconfont Icon_Navigation"></span></div><div class="phoneto"><span class="icon iconfont Icon_Call"></span></div></div></div>`
    }

    getDebtHtml(parkname, price, duration, date, paynow, obj) {
        return `<div class="history_item debt"   data-id="${obj.id}"  data-provider="${obj.provider}"><div id="item_debtbg" class="item_bg"></div><div class="parkname">${parkname}</div><div class="price">${price}</div><div class="duration">${duration}</div><div class="date">${date}</div><div class="btn_group"> <button class="btn btn__normal" id="now_pay">${paynow}</button></div></div>`
    }

    async loadData() {
        let that = this;
        let result = await  JLRAPI.commonRequest(JLRAPI.api.GET_HISTORY_LIST, {
            type: "parking"
        });
        let appendHtml = `<div style="width: 67px"></div>`;
        if (result && result.code === 0) {
            if (result.data && result.data.length > 0) {
                result.data.forEach(i => {
                        let price = window.scope.locale.t(`${window.scope.localLanguage}.orderhistory.price`, {price: i.order.parkingFee});
                        let duration_time = new Date(i.order.exitingTimestamp).getTime() - new Date(i.order.enteringTimestamp).getTime();
                        let duration_hour = Math.floor(duration_time / 1000 / 60);

                        let duration_min = Math.floor((duration_time / 1000 / 60) % 60);
                        let utcdate = new Date(i.order.enteringTimestamp);

                        let duration = window.scope.locale.t(`${window.scope.localLanguage}.orderhistory.duration`, {
                            hour: duration_hour,
                            min: duration_min
                        });


                        let endTime_obj = {
                            date: utcdate.getUTCDate() < 10 ? '0' + utcdate.getUTCDate() : utcdate.getUTCDate(),
                            year: utcdate.getFullYear(),
                            month: (utcdate.getUTCMonth() + 1 < 10) ? '0' + (utcdate.getUTCMonth() + 1) : (utcdate.getUTCMonth() + 1),
                            hour: utcdate.getHours() < 10 ? '0' + utcdate.getHours() : utcdate.getHours(),
                            mins: utcdate.getMinutes() < 10 ? '0' + utcdate.getMinutes() : utcdate.getMinutes(),
                        };

                        let endTime = window.scope.locale.t(`${window.scope.localLanguage}.orderhistory.endTime`, endTime_obj);
                        if (i.order.isDebt) {
                            appendHtml += that.getDebtHtml(
                                i.name,
                                price,
                                duration,
                                endTime,
                                window.scope.locale.t(`${window.scope.localLanguage}.orderhistory.payNow`),
                                i
                            );
                        }
                        else {
                            appendHtml += that.getHtml(
                                i.name,
                                price,
                                duration,
                                endTime,
                                i.id,
                                i
                            );
                        }
                    }
                )
            }
            if (result.data && result.data.length === 0) {
                that.domQuery(".noorderhistory").style.display = "flex";
            }


        }
        else {
            that.domQuery(".noorderhistory").style.display = "flex";
        }
        that.domQuery(".history_list").innerHTML = appendHtml;

        that.domQueryAll(".btn_close_bg").forEach(i => {

                i.onclick = async () => {
                    let delete_dom = i;
                    console.log(i.parentNode)
                    let result = await JLRAPI.commonRequest(JLRAPI.api.DELETE_HISTORY, {
                        toDeleteAll: false,
                        provider: delete_dom.parentNode.dataset.provider,
                        id: delete_dom.parentNode.dataset.id
                    });

                    if (result && result.code === 0) {
                        delete_dom.parentNode.remove()
                    }
                }
            }
        )

    }
}
