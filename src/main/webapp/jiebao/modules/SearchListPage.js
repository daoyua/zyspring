/**
 * Created by sunxinhan on 2019/9/3.
 */
/**
 * @namespace page
 * @description 停车场搜索列表页
 */
window.data = [];

class SearchListPage {
    constructor(activeRoute) {
        this.id = activeRoute ? activeRoute.id : "";
        this.domQuery = this.domQuery;
        this.domQueryAll = this.domQueryAll;
        this.container_touch = false;
        this.lastPosition = 0;
        this.itemHeight = 120;
        this.threshold = 40;

        this.baseUrl = 'https://restapi.amap.com/v3/staticmap';
        this.imgConfig = {
            location: 'https://s3.amazonaws.com/assets.cloudcar.com/provider_assets/future_move/iconCurrent.png',
            destlocation: 'https://s3.amazonaws.com/assets.cloudcar.com/provider_assets/future_move/iconNone.png',
        };

        this.baseParam = {
            location: `${window.scope.carLocation.lng},${window.scope.carLocation.lat}`,
            scale: 1,
            size: '581*588',
            markers: `mid,,P:${window.scope.carLocation.lng},${window.scope.carLocation.lat}`,
            key: '66fee2a452e093191881a6af45c17dec'
        };

        this.toggleForecast = this.domQueryAll(".toggle-triple-switch input[name='switch-ex1']");
        // 主体内容显示区域
        this.bodyContaienr = this.domQuery('#searchlist_content')
        this.menuBar = document.querySelector('#menu-bar')
        this.search_loading = this.domQuery('#search_loading')
        this.searchlist_loading_dest = this.domQuery('#searchlist_loading_dest')
        this.searchlist_loading_nearby = this.domQuery('#searchlist_loading_nearby')
        this.nearby_nodata = this.domQuery("#nodata");
        this.destination_nodata = this.domQuery("#destination_nodata");
        this.destination_nopark = this.domQuery("#destination_nopark");
        this.nearby_list = this.domQuery("#list");
        this.nearby_img = this.domQuery("#nearby_static_img")

        this.dest_list = this.domQuery("#dest_list");
        this.dest_img = this.domQuery("#dest_img");
        this.refresh_btn=this.domQuery("#img_load_error_btn")

        this.search_type = {
            destination: "destination",
            nearby: "nearby",
        };

        this.nearbyData = [];
        this.destData = [];
        this.nearby_searched = false;
        this.destination_searched = false;
        this.searchingType = window.scope.destination ? this.search_type.destination : this.search_type.nearby;
        this.nearby_build = false;
        this.dest_build = false;
        if (window.scope.destination) {
            this.destination_default = `https://restapi.amap.com/v3/staticmap?location=${window.scope.destination.longitude},${window.scope.destination.latitude}&scale=1&size=581*588&markers=-1,https://s3.amazonaws.com/assets.cloudcar.com/provider_assets/future_move/iconNone.png,0:${window.scope.destination.longitude},${window.scope.destination.latitude}&key=66fee2a452e093191881a6af45c17dec`;
        }
        if (window.scope.carLocation) {
            this.nearby_default = `https://restapi.amap.com/v3/staticmap?location=${window.scope.carLocation.lng},${window.scope.carLocation.lat}&scale=1&size=581*588&markers=-1,https://s3.amazonaws.com/assets.cloudcar.com/provider_assets/future_move/iconCurrent.png,0:${window.scope.carLocation.lng},${window.scope.carLocation.lat}&key=66fee2a452e093191881a6af45c17dec`;
        }
    }

    unLoad() {

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

    b_faction() {
        console.log('-> SearchListPage b_faction <-')
        // TODO
        // 是否需要更新list列表数据？？
        // this.loadData()
    }

    //如果在searchlist页面前后台切换需要加载
    async destinationChange() {
        this.destData = [];
        let that = this;
        that.searchingType = that.search_type.destination;
        this.domQuery("#rsvp-maybe").setAttribute('checked', true);
        await that.loadData({
            lat: window.scope.destination.latitude,
            lng: window.scope.destination.longitude,
        })
        this.buildHtml(that.destData);
    }

    /*按钮 toggle 切换*/
    bindTabToggle() {
        this.toggleForecast.forEach((i, index) => {
            let that = this;
            i.onclick = async function () {
                let nearby =  that.domQueryAll("input[type=radio]")[0].checked
                //判断如果是nearby,判断是否已经搜索过,如果已经搜索过直接重新渲染数据,展示地图
                //判断如果是目的,判断是否已经搜索过,如果已经搜索过直接重新渲染数据,展示地图
                if (nearby) {
                    console.log('nearby_searched', that.nearby_searched)
                    that.searchingType = that.search_type.nearby;
                    if (!that.nearby_searched) {
                        //在点击nearby搜索的时候第一次要搜索车辆附近停车场,所以要重新获取车辆位置
                        that.showLoading(that.search_type.destination)
                        await Common.getCarLocation();
                        if (window.scope.carLocation) {
                            this.nearby_default = `https://restapi.amap.com/v3/staticmap?location=${window.scope.carLocation.lng},${window.scope.carLocation.lat}&scale=1&size=581*588&markers=-1,https://s3.amazonaws.com/assets.cloudcar.com/provider_assets/future_move/iconCurrent.png,0:${window.scope.carLocation.lng},${window.scope.carLocation.lat}&key=66fee2a452e093191881a6af45c17dec`;
                        }
                        await that.searchNearby();
                    }
                    if (!that.nearby_build) {
                        that.buildHtml(that.nearbyData);
                    }
                    else {
                        that.DOM_show_nearby_result();
                    }
                }
                else {

                    that.searchingType = that.search_type.destination;
                    if (!that.destination_searched) {
                        that.showLoading(that.search_type.destination)
                        await that.searchDestination();
                    }
                    if (!that.dest_build) {
                        that.buildHtml(that.destData);
                    }
                    else {
                        that.DOM_show_dest_result()
                    }
                }

            }

        })
    }


    getHtml(meters, nav, parkname, price, state, position) {
        return `<div class="data-item">
    <p class="line-one" id="active">
    <span class="name parkname">${parkname}</span>
    <span class="price">${price}</span>
    <span class="status">${state}</span>
    </p>
    <p class="line-two">
    <span data-lat="${position.lat}" data-lng="${position.lng}" class="route">${nav}</span>
    <span class="distance">${meters}</span>
    </p>
    </div>`
    }

    async loadData(position) {
        let that = this;
        switch (that.searchingType) {
            case that.search_type.destination:
                that.destination_searched = true;
                break;
            case that.search_type.nearby:
                that.nearby_searched = true;
                break;
            default:
                break;
        }

        let result = await JLRAPI.commonRequest(JLRAPI.api.SEARCH_PARKING, {
            "lat": position.lat,
            "lng": position.lng,
            "placeType": "parking",
            "searchArea": {
                "radius": 10,
                "lat": position.lat,
                "lng": position.lng,
                "type": "point"
            },
            "limit": 10
        });
        that.hideLoading()

        if (result && result.code === 0 && result.data.length > 0) {
            that.DOM_showData();
            switch (that.searchingType) {
                case that.search_type.destination:
                    that.destData = result.data;
                    break;
                case that.search_type.nearby:
                    that.nearbyData = result.data;
                    break;
                default:
                    break;
            }
            // map data
            window.data = result.data;

        } else {
            //如果没有数据,需要显示没有数据界面
            that.DOM_showNoData()
        }
    }

    DOM_showData() {
        this.bodyContaienr.style.display = 'flex'//显示搜索主体
        this.menuBar.style.display = 'flex';//显示底部导航
        this.nearby_nodata.style.display = "none";
        this.destination_nodata.style.display = "none";
    }

    DOM_showNoData() {
        this.buildMap(false);//没有搜索结果,也要显示默认地图
        switch (this.searchingType) {
            case this.search_type.destination:
                this.hideLoading()
                if(!window.scope.destination) {
                    // 没有设置目的地
                    this.DOM_show_destination_nodata()
                } else {
                    this.DOM_show_destination_nopark()
                }
                break;
            case this.search_type.nearby:
                this.hideLoading()
                this.DOM_show_nearby_nodata()
                break;
            default:
                break;
        }
    }

    // 有目的地，但附近没有停车场
    DOM_showNoPark() {
        this.buildMap(false);//没有搜索结果,也要显示默认地图
        switch (this.searchingType) {
            case this.search_type.destination:
                this.hideLoading()
                this.DOM_show_destination_nopark()
                break;
            case this.search_type.nearby:
                this.hideLoading()
                this.DOM_show_nearby_nodata()
                break;
            default:
                break;
        }
    }

    DOM_show_destination_nodata() {
        this.nearby_list.style.display = 'none'
        this.dest_list.style.display = 'none'
        this.nearby_nodata.style.display = "none";
        this.destination_nodata.style.display = "block";
        this.nearby_img.style.display = "none";
        this.dest_img.style.display = "block";
        this.destination_nopark.style.display = "none";
    }

    DOM_show_destination_nopark() {
        this.nearby_list.style.display = 'none'
        this.dest_list.style.display = 'none'
        this.nearby_nodata.style.display = "none";
        this.destination_nodata.style.display = "none";
        this.nearby_img.style.display = "none";
        this.dest_img.style.display = "block";
        this.destination_nopark.style.display = "block";
    }

    DOM_show_nearby_nodata() {
        this.nearby_list.style.display = 'none'
        this.dest_list.style.display = 'none'
        this.nearby_nodata.style.display = "block";
        this.destination_nodata.style.display = "none";
        this.nearby_img.style.display = "block";
        this.dest_img.style.display = "none";
        this.destination_nopark.style.display = "none";
    }

    DOM_show_nearby_result() {
        this.DOM_showData();
        this.nearby_list.style.display = "block";
        this.nearby_img.style.display = "block";
        this.dest_list.style.display = "none";
        this.dest_img.style.display = "none";
    }

    DOM_show_dest_result() {
        this.DOM_showData();
        this.nearby_list.style.display = "none";
        this.nearby_img.style.display = "none";
        this.dest_list.style.display = "block";
        this.dest_img.style.display = "block";
    }

    buildMap(show) {
        if (show) {
            this.showMap(this.containerTop.bind(this), 100)();
        }
        else {
            //没有搜索到任何数据的情况
            switch (this.searchingType) {
                case this.search_type.nearby:
                    // this.nearby_img.src = this.nearby_default;
                    this.regLoadImg(this.nearby_img, this.nearby_default);
                    break;
                case this.search_type.destination:
                    if (window.scope.destination) {
                        // this.dest_img.src = this.destination_default;
                        this.regLoadImg(this.dest_img, this.destination_default)
                    }
                    else {
                        // this.dest_img.src = this.nearby_default;
                        this.regLoadImg(this.dest_img, this.nearby_default)
                    }
                    break;
                default:
                    break;
            }
        }
    }

    buildHtml(data) {
        if (data && data.length > 0) {
            let appendHtml = ``;
            this.buildMap(true);
            // 渲染列表
            data.forEach((i, index) => {
                let distance_t = i.distance <= 1000 ? `${window.scope.localLanguage}.search.unit_m` : `${window.scope.localLanguage}.search.unit_km`;
                let params = i.distance <= 1000 ? i.distance : (Math.round(i.distance / 100) / 10).toFixed(1);
                let distance = window.scope.locale.t(distance_t, {param: params})
                let price = window.scope.locale.t(`${window.scope.localLanguage}.search.price`, {param: i.parkingPrices.averageChargePerHour.toFixed(2)});
                let nav = window.scope.locale.t(`${window.scope.localLanguage}.search.nav`);
                let state = this.getParkState(i);
                let position = {
                    lat: i.location.geo.lat,
                    lng: i.location.geo.lng,
                }
                appendHtml += this.getHtml(distance, nav, `${index + 1}. ${i.name}`, price, state, position)
            })
            switch (this.searchingType) {
                case this.search_type.nearby:
                    this.nearby_list.innerHTML = appendHtml;
                    this.nearby_build = true;
                    this.DOM_show_nearby_result()
                    break;
                case this.search_type.destination:
                    this.dest_list.innerHTML = appendHtml;
                    this.dest_build = true;
                    this.DOM_show_dest_result()
                    break;
            }

            this.DOM_showData();
            this.domQueryAll(".line-one").forEach((d, index) => {
                let that = this;
                d.onclick = () => {
                    window.parkingCurrentIndex = index;
                    window.scope.searchFilter = {
                        nearbyData: that.nearbyData,
                        destData: that.destData,
                        nearby_searched: that.nearby_searched,
                        destination_searched: that.destination_searched,
                        searchingType: that.searchingType,
                        dest_img: that.dest_img.src,
                        nearby_img: that.nearby_img.src,
                        nearby_list_top: that.nearby_list.scrollTop,
                        dest_list_top: that.dest_list.scrollTop,
                    };
                    Router.To("searchdetail")
                }
            })
            //GO 按钮的点击
            this.domQueryAll(".route").forEach((d, index) => {
                let that = this;
                d.onclick = async () => {
                    console.log(d.dataset.lng, d.dataset.lat)
                    await Common.navigation(d.dataset.lng, d.dataset.lat);
                }
            })


            console.log("scroll event", this.searchingType)
            this.scroll_list = this.searchingType === this.search_type.nearby ? this.nearby_list : this.dest_list;
            this.scroll_list.addEventListener("scroll", this.showMap(this.containerTop.bind(this), 100));
            this.scroll_list.addEventListener("touchmove", function () {
                this.container_touch = true;
            }, {passive: true});
            this.scroll_list.addEventListener("touchend", function () {
                this.container_touch = false;
            });
        }
        else {
            this.DOM_showNoData()
        }


    }

    async searchNearby() {
        this.searchingType = this.search_type.nearby;
        if (window.scope.carLocation && this.nearbyData.length <= 0) {
            await this.loadData({
                lat: window.scope.carLocation.lat,
                lng: window.scope.carLocation.lng,
            })
        }
        else {
            this.DOM_showNoData()
        }

    }

    async searchDestination() {
        this.searchingType = this.search_type.destination;
        if (window.scope.destination && this.destData.length <= 0) {
            await this.loadData({
                lat: window.scope.destination.latitude,
                lng: window.scope.destination.longitude,
            })
        }
        else {
            this.DOM_showNoData()
        }
    }


    getParkState(i) {
        let state = "";
        if (i.availability.state === "unknown") {
            state = ""
        } else {
            state = i.availability.indicator
        }
        switch (state) {
            case "high":
                state = `<span class="state status state_free">${ window.scope.locale.t(`${window.scope.localLanguage}.search.state_free`)}</span>`;
                break;
            case "mid":
                state = `<span class="state status state_full">${ window.scope.locale.t(`${window.scope.localLanguage}.search.state_full`)}</span>`;
                break;
            case "low":
                state = `<span class="state status state_tight">${ window.scope.locale.t(`${window.scope.localLanguage}.search.state_tight`)}</span>`;
                break;
        }
        return state;
    }

    showLoading(type) {
        this.search_loading.style.display = "flex";
        this.domQuery(".searchlist_loading_bg").style.display="flex"
        type === this.search_type.nearby ? this.searchlist_loading_nearby.style.display = "flex" : this.searchlist_loading_dest.style.display = "flex";
    }

    hideLoading() {
        this.bodyContaienr.style.display = 'flex'//显示搜索主体
        console.log(this.menuBar)
        this.menuBar.style.display = 'flex';//显示底部导航
        this.searchlist_loading_nearby.hide()
        this.searchlist_loading_dest.hide()
        this.search_loading.style.display = "none"
        this.domQuery(".searchlist_loading_bg").style.display="none"
    }


    translate(obj) {
        var str = '?';
        for (var i in obj) {
            str += i + '=' + obj[i] + '&';
        }
        return str.substring(0, str.length - 1);
    }

    showMap(fn, delay) {
        let timer = null;
        let that = this;
        return function (x, y) {
            if (this !== undefined) {
                that.lastPosition = this.scrollTop;
            } else {
                that.lastPosition = 0;
            }
            let self = this,
                args = arguments;
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(self, args);
            }, delay);
        };
    };


    //retry load image
    regLoadImg(imgUrl, url) {
        //regardless image whether success load, should load the loading first
        //when image not load hide dest, nearby map
        // document.querySelector("#dest_img").style.display = 'none'
        // document.querySelector("#nearby_static_img").style.display = 'none'
        // document.querySelector("#des_nearby_img_load_bg").style.display = 'flex'
        // document.querySelector("#des_nearby_img_load_bg").style.background = 'rgba(255,255,255,0.07)'
        // document.querySelector("#img_load_error_bg").style.background = 'rgba(255,255,255,0.07)'
        // document.querySelector("#des_nearby_img_load_bg").style.height = '585px'
        // document.querySelector("#img_load_error_bg").style.height = '585px'
        // document.querySelector("#img_load_error_bg").style.display = 'none'
        imgUrl.src = url
        //the image load status
        console.log(`the image load status1:${imgUrl.complete}`)
        // imgUrl.onload=function(){
        //     console.log('img load ...')
        //     console.log(`the image load status2:${imgUrl.complete}`)
        //     if(imgUrl.complete){
        //         console.log('img load success')
        //         document.querySelector("#des_nearby_img_load_bg").style.display = 'none'
        //         document.querySelector("#dest_img").style.display = 'flex'
        //         document.querySelector("#nearby_static_img").style.display = 'none'
        //     }
        // }
        // imgUrl.onerror=function(){
        //     console.log('loading error')
        //     console.log(`the image load status3:${imgUrl.complete}`)
        //     document.querySelector("#des_nearby_img_load_bg").style.display = 'none'
        //     document.querySelector("#img_load_error_bg").style.display = 'flex'
        // }
        // //when the image load failed ,click button can retry load image.
        // // but should load the loading first
        // document.querySelector("#img_load_error_btn").onclick=()=>{
        //     console.log(`the image load status4:${imgUrl.complete}`)
        //     console.log('img loading error, tap to retry')
        //     document.querySelector("#img_load_error_bg").style.display = 'none'
        //     document.querySelector("#des_nearby_img_load_bg").style.display = 'flex'
        //     imgUrl.src = url
        // }

// var timesRun = 0
        // var interval;
        // imgUrl.onerror = function (){
        //     console.log('error')
        //     interval = setInterval(function () {
        //         //当图片没有加载出来，只主动加载三次，当页面加载出来后，则清除定时器
        //         if (timesRun === 2) {
        //             clearInterval(interval);
        //         }
        //         if (timesRun < 2) {
        //             timesRun += 1;
        //             imgUrl.src = url
        //         }
        //     }, 0);
        // };
        // imgUrl.onload = function (){
        //     clearInterval(interval);
        // };
    }

    _doScrollMap(index) {
        let _markers_park = '';
        let icon = this.searchingType === this.search_type.nearby ? this.imgConfig.location : this.imgConfig.destlocation;

        let _markers_location = '-1,' + icon + `,0:${window.scope.carLocation.lng },${window.scope.carLocation.lat}`;
        if(window.scope.destination) {
            _markers_location = '-1,' + icon + `,0:${window.scope.destination.longitude },${window.scope.destination.latitude}`;
        }

        if (data.length === 0) {
            return
        }
        data.forEach(function (v, i) {
            let parkimg = '-1,https://s3.amazonaws.com/assets.cloudcar.com/provider_assets/future_move/icon' + (i + 1) + '.png,' + 0 + ':';
            if (i >= index - 4 && i < index) {
                if (i === index - 1 || i === data.length - 1) {
                    _markers_park += '' + parkimg + v.location.geo.lng + ',' + v.location.geo.lat;
                } else {
                    _markers_park += '' + parkimg + v.location.geo.lng + ',' + v.location.geo.lat + '|';
                }
            }
        });
        this.baseParam.markers = _markers_park + '|' + _markers_location;
        if(window.scope.destination) {
            this.baseParam.location = `${window.scope.destination.longitude },${window.scope.destination.latitude }`;
        } else {
            this.baseParam.location = `${window.scope.carLocation.lng },${window.scope.carLocation.lat }`;
        }
        //this.baseParam.location = `${window.scope.carLocation.lng },${window.scope.carLocation.lat }`;

        let _img = this.searchingType === this.search_type.nearby ? this.nearby_img : this.dest_img;
        this.regLoadImg(_img, `${this.baseUrl}${this.translate(this.baseParam)}`);
        // _img.src = this.baseUrl + this.translate(this.baseParam);
    }

    containerTop() {
        let n = 4;
        let count = parseInt(this.lastPosition / this.itemHeight);
        if (count >= 1) {
            n = n + count;
        }
        if (this.lastPosition % (this.itemHeight / 2) >= this.threshold) {
            n += 1;
        }
        this._doScrollMap(n);

        if (!this.container_touch) {

            let list = this.searchingType === this.search_type.nearby ? this.nearby_list : this.dest_list;
            list.scrollTop = this.itemHeight * n - this.itemHeight * 4;
        }
    }

    async getDestnation() {
        try {
            let map = new phoenix.maps.Map();
            let route = await map.activeRoute();
            let location = await route.destination();
            let destination = await location.coordinates();
            return destination;
        }
        catch (e) {
            console.log(e)
            JlrError.catchError(e);
            return undefined;
        }
    }

    async onLoad() {
        let that = this;
        let destination = await this.getDestnation();
        let destchange = false;
        console.log('该目的地切换，destination: ', destination)
        if (destination) {
            if (destination && destination.longitude === window.scope.destination.longitude || destination.latitude === window.scope.destination.latitude) {
                destchange = false;
                console.log('状态1')
            }
            else {
                destchange = true;
                console.log('状态2')
            }
        } else {
                destchange = false;
        }
        window.scope.destination=destination;
        console.log("searchlist", destchange)
        if (window.scope.fromDetail && !destchange) {
            window.scope.fromDetail = false;
            let filter = window.scope.searchFilter;
            that.nearbyData = filter.nearbyData;
            that.destData = filter.destData
            that.nearby_searched = filter.nearby_searched
            that.destination_searched = filter.destination_searched
            that.searchingType = filter.searchingType
            if (that.searchingType === that.search_type.destination) {
                that.domQuery("#rsvp-maybe").setAttribute('checked', true);
            } else {
                that.domQuery("#rsvp-going").setAttribute('checked', true)
            }
            let data = that.search_type.nearby === that.searchingType ? that.nearbyData : that.destData;
            that.buildHtml(data);
            that.domQuery("#list").scrollTop = filter.nearby_list_top;
            that.domQuery("#dest_list").scrollTop = filter.dest_list_top;
            that.nearby_img.src = filter.nearby_img;
            that.dest_img.src = filter.nearby_img;
            that.DOM_showData();
            that.bindTabToggle();
        } else {
            if (window.scope.destination) {
                that.domQuery("#rsvp-maybe").setAttribute("checked", true)
                await that.searchDestination()
            } else {
                that.domQuery("#rsvp-going").setAttribute("checked", true)
                await that.searchNearby()
            }
            let data = that.search_type.nearby === that.searchingType ? that.nearbyData : that.destData;
            this.buildHtml(data);
            this.bindTabToggle();
        }
        //near by try again
        this.domQuery("#try-again").addEventListener("click", async () => {
            //todo:try again需要重新获取current Location
            let that = this;
            await Common.getCarLocation();
            that.searchingType = that.search_type.nearby;
            if (window.scope.carLocation) {
                await this.loadData({
                    lat: window.scope.carLocation.lat,
                    lng: window.scope.carLocation.lng,
                })
            }
            else {
                that.DOM_showNoData()
            }
            that.buildHtml(that.nearbyData);
        });
        //set now
        document.getElementById("set-now").addEventListener("click", async function () {
            await Common.navigation(window.scope.carLocation.lng, window.scope.carLocation.lat);
        });
        return true;
    }
}