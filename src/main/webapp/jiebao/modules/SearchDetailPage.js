/**
 * Created by sunxinhan on 2019/9/3.
 */
/**
 * @namespace page
 * @description 停车场详情页面
 */
class SearchDetailPage {
    constructor() {
        this.detail_info_list = document.querySelectorAll(".detail_info_list li");
        this.searchdetail_parklogo = document.querySelector("#searchdetail_parklogo")
        this.searchdetail_navto = document.querySelector("#searchdetail_navto")
        this.detailMap = document.querySelector("#parkingDetailMap")
        this.call = document.querySelector("#getTelephony")
        //loading map
        // this.loadBg=document.querySelector("#des_nearby_img_load_bg")
        // this.loadErrorBg=document.querySelector("#img_load_error_bg")
        // this.loadErrorBtn=document.querySelector("#img_load_error_btn")
    }

    async  unLoad() {
        console.log('unLoad')
        try {
            let hmiManagerObject = phoenix.oem.jlr.hmi.hmiManager;
            hmiManagerObject.hideBackButton()
                .then(() => {
                    console.log("Back button hide");
                })
                .catch(error => {
                    if (error instanceof phoenix.PhoenixError)
                        console.log('back_btn_error', error.errorCode);
                });

        }
        catch (e) {
            JlrError.catchError(e)
        }
    }

    b_faction() {
        console.log('-> SearchDetailPage b_faction <-')
        // Router.To("searchlist");
    }

    setHTML(result){
        document.getElementsByClassName("parkname")[0].innerText = result.data.name || ''
        //停车场地址
        if(result.data.location) {
            document.getElementsByClassName("detail_address")[0].innerText = result.data.location.rawAddress.data || ''
        }
        // 每天的营业时间Object
        let busTimeArr = result.data.businessHours || {}
        console.log(busTimeArr)
        let _today = new Date().getDay() === 0 ? 'sunday'
            : new Date().getDay() === 1 ? 'monday'
                : new Date().getDay() === 2 ? 'tuesday'
                    : new Date().getDay() === 3 ? 'wednesday'
                        : new Date().getDay() === 4 ? 'thursday'
                            : new Date().getDay() === 5 ? 'friday'
                                : new Date().getDay() === 6 ? 'saturday' : ''

        if (busTimeArr[_today] && busTimeArr[_today].open) {
            console.log(busTimeArr[_today].hours[0].start + '-' + busTimeArr[_today].hours[0].end)
            this.detail_info_list[6].querySelectorAll("span")[1].innerText = busTimeArr[_today].hours[0].start + '-' + busTimeArr[_today].hours[0].end
            this.detail_info_list[8].querySelectorAll("span")[1].innerText = busTimeArr[_today].hours[0].start + '-' + busTimeArr[_today].hours[0].end
        }

        // 单价，费率，收费封顶
        let priceObj = result.data.parkingPrices || {}
        //日间收费政策、费用
        let dayHours = priceObj.prices || []
        // console.log(dayHours[0].costs[0].pricePerUnit)
        // console.log(dayHours[0].times[0].from)
        if(dayHours[0] && dayHours[0].times[0]) {
            this.detail_info_list[0].querySelectorAll("span")[1].innerText = dayHours[0].times[0].from + '-' + dayHours[0].times[0].to    
        }
        

        let withfirsthourCost = ''
        let outsidefirsthourCost = ''
        let withfirsthourCostNight = ''
        let outsidefirsthourCostNight = ''
        if(dayHours[0]) {
            if(dayHours[0].costs[0]) {
                withfirsthourCost = dayHours[0].costs[0].pricePerUnit || ''
            }
            if(dayHours[0].costs[1]) {
                outsidefirsthourCost = dayHours[0].costs[1].pricePerUnit || ''
            }
        }
        if(dayHours[1]) {
            if(dayHours[1].costs[0]) {
                withfirsthourCostNight = dayHours[1].costs[0].pricePerUnit || ''
            }
            if(dayHours[1].costs[1]) {
                outsidefirsthourCostNight = dayHours[1].costs[1].pricePerUnit || '' 
            }
        }
        console.log(withfirsthourCost)
        //首小时内
        let withfirsthour_value = window.scope.locale.t(`${window.scope.localLanguage}.searchdetail.withfirsthour_value`, {param: withfirsthourCost});
        //todo后期可能需要修改
        this.detail_info_list[1].querySelectorAll("span")[1].innerText = withfirsthour_value ==" RMB/h" ? '': withfirsthour_value;
        //首小时外
        let outsidefirsthour_value = window.scope.locale.t(`${window.scope.localLanguage}.searchdetail.outsidefirsthour_value`, {param: outsidefirsthourCost});
        this.detail_info_list[2].querySelectorAll("span")[1].innerText = outsidefirsthour_value ==" RMB/h" ? '': outsidefirsthour_value;

        //夜间收费政策。费用
        if(dayHours[1] && dayHours[1].times[0]) {
            this.detail_info_list[3].querySelectorAll("span")[1].innerText = dayHours[1].times[0].from + '-' + dayHours[1].times[0].to
        }
        //首小时内
        let withfirsthour_night = window.scope.locale.t(`${window.scope.localLanguage}.searchdetail.withfirsthour_night`, {param: withfirsthourCostNight});
        this.detail_info_list[4].querySelectorAll("span")[1].innerText = withfirsthour_night ==" RMB/h" ? '': withfirsthour_night;
        //首小时外
        let outsidefirsthour_night = window.scope.locale.t(`${window.scope.localLanguage}.searchdetail.outsidefirsthour_night`, {param: outsidefirsthourCostNight});
        this.detail_info_list[5].querySelectorAll("span")[1].innerText = outsidefirsthour_night ==" RMB/h" ? '': outsidefirsthour_night;
        this.detail_info_list[7].querySelectorAll("span")[1].innerText = '';
        // this.detail_info_list[8].querySelectorAll("span")[1].innerText = result.data.businesshour;

        this.detail_info_list[9].querySelectorAll("span")[1].innerText = '';

        this.detail_info_list[10].querySelectorAll("span")[1].innerText = result.data.totalParkingSpot || '';

        let parkingtype_value = window.scope.locale.t(`${window.scope.localLanguage}.searchdetail.parkingtype_value`, {param: result.data.garageType});
        console.log(result.data.garageType)
        this.detail_info_list[11].querySelectorAll("span")[1].innerText = result.data.garageType || '';
    }
    async loadData() {
        let parkingDetailData = {}
        // 加载数据之前需要判断
        // 如果是从pay页面点击过来的
        if(window.scope.fromPayToDetail) {
            window.scope.fromPayToDetail = false
            //todo etcp模拟进场好了需要修改
            // 根据parkingId获取详情
            // parkingDetailData = await this.getDetailById(window.scope.fromPayParkingIdToDetail)
            let result = await JLRAPI.commonRequest(JLRAPI.api.PARKING_STATUS)
            let searchResult = await JLRAPI.commonRequest(JLRAPI.api.DETAIL_PARKING, {
                provider: `${result.data.provider}`,
                id: `${window.scope.fromPayParkingIdToDetail}`,
                schema: '',
                placeType: ''
            })
            parkingDetailData = searchResult.data
        } else {
            // 索引
            let _index = window.parkingCurrentIndex || 0
            parkingDetailData = data[_index]
        }
        
        console.log(parkingDetailData)
        let result = {
            code: 0,
            data: parkingDetailData
        }

        //导航
        const lat = result.data.location.geoNav.lat
        const lng = result.data.location.geoNav.lng
        // console.log('---', lat, lng)

        // regardless image whether success load, should load the loading first
        // this.loadBg.style.display = 'flex'
        //
        // document.querySelector("#des_nearby_img_load_bg").style.background = 'rgba(255,255,255,0.07)'
        // document.querySelector("#img_load_error_bg").style.background = 'rgba(255,255,255,0.07)'
        // document.querySelector("#des_nearby_img_load_bg").style.height = '585px'
        // document.querySelector("#img_load_error_bg").style.height = '585px'

        this.detailMap.src = `https://restapi.amap.com/v3/staticmap?location=${lng || 116.428631},${lat || 39.903804}&scale=1&size=708*690&markers=-1,https://s3.amazonaws.com/assets.cloudcar.com/provider_assets/future_move/iconNone.png,0:${lng || 116.428631},${lat || 39.903804}&key=66fee2a452e093191881a6af45c17dec`
        //
        //map load the loading image and retry load map. start
        //image loading status
        // this.detailMap.onload=()=>{
        //     console.log('loading...')
        //     // console.log(`image load status：${this.detailMap.complete}`)
        //     if(this.detailMap.complete){
        //         console.log('loading success')
        //         this.loadBg.style.display = 'none'
        //         this.loadErrorBg.style.display = 'none'
        //     }
        // }
        // //image loading failed
        // this.detailMap.onerror=()=>{
        //     console.log('loading error')
        //     this.loadBg.style.display = 'none'
        //     this.loadErrorBg.style.display = 'flex'
        // }
        // //when the image fails to load,
        // // click the button retry loading image.
        // // but you should load the loading image first.
        // this.loadErrorBtn.onclick=()=>{
        //     console.log('img loading error, tap to retry')
        //     this.loadErrorBg.style.display = 'none'
        //     this.loadBg.style.display = 'flex'
        //     this.detailMap.src = `https://restapi.amap.com/v3/staticmap?location=${lng || 116.428631},${lat || 39.903804}&scale=1&size=708*690&markers=-1,https://s3.amazonaws.com/assets.cloudcar.com/provider_assets/future_move/iconNone.png,0:${lng || 116.428631},${lat || 39.903804}&key=66fee2a452e093191881a6af45c17dec`
        // }
        //map load the loading image and retry loading image. end


        //导航
        this.searchdetail_navto.onclick = async () => {
            try {
                await Common.navigation(lng, lat);
            }
            catch (e) {
                JlrError.catchError(e)
            }
        }
        let distance = ''
        if (result.data.distance < 1000) {
            distance = window.scope.locale.t(`${window.scope.localLanguage}.search.unit_m`, {param: result.data.distance})
        } else if (result.data.distance > 1000) {
            let sort = (Math.round(result.data.distance / 100) / 10).toFixed(1)
            distance = window.scope.locale.t(`${window.scope.localLanguage}.search.unit_km`, {param: sort})
        }
        // 渲染列表
        let state = ""
        if(parkingDetailData.availability.state ==="unknown"){
           state=""
       }else{
          state = parkingDetailData.availability.indicator

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
        //停车场状态
        document.getElementsByClassName("nerv")[0].innerHTML = state
        //停车场距离
        document.getElementsByClassName("meters")[0].querySelectorAll("span")[0].innerText = distance


        const _id = result.data.id
        if (result.data.provider === "tjd") {
            this.searchdetail_parklogo.className = "icon iconfont Logo_TJD"
            let result = await  JLRAPI.commonRequest(JLRAPI.api.DETAIL_PARKING, {
                provider: 'tjd',
                id: _id,
                schema: '',
                placeType: ''
            })
            if (result && result.code === 0) {
              this.setHTML(result)
            }
        } else {
            this.searchdetail_parklogo.className = "icon iconfont Logo_ETCP1"
            if (result && result.code === 0) {
              this.setHTML(result)
            }
        }
    }

    async onLoad() {
        let hmiManagerObject = phoenix.oem.jlr.hmi.hmiManager;
        hmiManagerObject.showBackButton()
            .then(() => {
                console.log("Back button shown");
            })
            .catch(error => {
                if (error instanceof phoenix.PhoenixError)
                    console.log('back_btn_error', error.errorCode);
            });
        await this.loadData();

        try {
            this.call.onclick = async () => {
                let bluetoothResult = await  phoenix.sys.settings.settingsManager.getValue("bluetooth-connection-status")
                console.log("Phone connection state " + result.value);
                if (bluetoothResult.value === true) {
                    return phoenix.telephony.telephonyManager.dial('4004000000', {
                        promptUser: true
                    });
                }
            }
        }
        catch (e) {
            JlrError.catchError(e)
        }
    }
}