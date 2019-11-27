/**
 * Created by sunxinhan on 2019/9/3.
 */
/**
 * @namespace page
 * @description 搜索页面-商议后准备废弃
 */
class Search {
    constructor() {
        this.loadingText = document.querySelector("#loadingText")
    }

    unLoad() {
        console.log('unLoad')
    }

    async onLoad() {
        await  this.getDestinations()
        await  this.loadData()
        jQuery('.park_list').slick({
            dots: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            accessibility: false,
            arrows: false,
            cssEase: 'ease',
            touchThreshold: 6,
            variableWidth: true,
            centerMode: false,
            focusOnSelect: false,
            edgeFriction: 0.35,
            useTransform: true,
            waitForAnimate: false,
        });

        setTimeout(function () {
            // document.querySelector(".spinner").hide()
            document.querySelector("#loadingAnimationContainer").style.display ="none";
            document.querySelector(".spinner__title").style.display ="none";
            document.querySelector(".content").show()
        }, 1500)

    }

    async getDestinations() {
        try {
            let map = await new phoenix.maps.Map();
            let route = await map.activeRoute();
            let location = await route.destination();
            let coordinates = await location.coordinates();
            window.scope.destination = coordinates;

            if (location) {
                this.loadingText.innerText = window.scope.locale.t(`${window.scope.localLanguage}.loading.desc_destination`)
            }
            else {
                this.loadingText.innerText = window.scope.locale.t(`${window.scope.localLanguage}.loading.desc_nearby`)
            }
        }
        catch (e) {
            console.log(e)
        }


    }

    getHtml(meters, parkname, price, state = '车位紧张') {
        return `<div class="park_item ">
            <div class="item_bg"></div>
            <div class="meters">${meters}</div>
            <div class="parkname">${parkname}</div>
            ${state}
            <div class="price">${price}</div>
            <div class="tool_area"><div class="navto"><span class="icon iconfont Icon_Navigation"></span></div>
            </div></div>`
    }


    async loadData() {
        let that = this;
        let result = await JLRAPI.commonRequest(JLRAPI.api.SEARCH_PARKING, {
            "lat": 39.915085,
            "lng": -116.368324,
            "providers": ['here'],
            "placeType": "parking"

        })
        console.log(result)

        let appendHtml = `<div style="width: 67px"></div>`;
        if (result.code === 0) {
            result.data.forEach(i => {
                let distance = window.scope.locale.t(`${window.scope.localLanguage}.search.unit_m`, { param: i.distance});
                let price = window.scope.locale.t(`${window.scope.localLanguage}.search.price`, {param: i.averageRating});
                let state = ""
                switch (i.state) {
                    case "free":
                        state = `<div class="state state_free">${ window.scope.locale.t(`${window.scope.localLanguage}.search.state_free`)}</div>`;
                        break;
                    case "full":
                        state = `<div class="state state_full">${ window.scope.locale.t(`${window.scope.localLanguage}.search.state_full`)}</div>`;
                        break;
                    case "tight":
                        state = `<div class="state state_tight">${ window.scope.locale.t(`${window.scope.localLanguage}.search.state_tight`)}</div>`;
                        break;
                    default:
                        state = `<div class="state state_free">${ window.scope.locale.t(`${window.scope.localLanguage}.search.state_tight`)}</div>`;
                        break;
                }

                appendHtml += that.getHtml(
                    distance,
                    i.name,
                    price,
                    state);

            })

            console.log(appendHtml)

            document.querySelector(".park_list").innerHTML = appendHtml;
            document.querySelectorAll(".parkname").forEach(d => {
                d.onclick = () => {
                    Router.To("searchdetail")
                }
            })
        }

    }
}
