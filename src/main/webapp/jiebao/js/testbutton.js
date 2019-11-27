/**
 * TestButton class
 * @class
 */
class TestButton{
    constructor() {

    }
    //按住屏幕3秒后，弹出解绑车辆弹框
    static async touchshowBox(){
        var that = this
        let time=-1;
        window.document.body.addEventListener('touchstart', ()=>{
            if(time>=0)
            {
                console.log("4s hand leave",time)
                return;
            }
            time = setTimeout(function () {
                    document.querySelector("#bullet-box").style.display="flex"
            }, 4000);
        },false);
        window.document.body.addEventListener('touchend',()=>{
            clearTimeout(time);
            time=-1;
        },false)
        let unbind = document.querySelector("#un-bind")
        let lookcsdk = document.querySelector("#look-csdk")
        let setcarlocation = document.querySelector("#set-car-location")
        let clearcarlocation = document.querySelector("#clear-car-location")
        let getcarlocation = document.querySelector("#get-car-location")
        let setphonenumber = document.querySelector("#set-phone-number")
        let setcarplate = document.querySelector("#set-car-plate")
        let txtlist = document.querySelector("#txt-list")
        let resultinfo = document.querySelector("#result-info")
        //解绑车辆
        unbind.onclick = async function(){
            console.log('show handle btn')
            document.querySelector('#set-input').style.display='none'
            that.showHandleBtn(txtlist,"是否解绑车辆","unbind-car")
            console.log(window.scope.existBtn)
            if(window.scope.existBtn){
                let unbindcar = document.querySelector(".unbind-car")
                unbindcar.onclick=async ()=>{
                    try {
                        let result = await JLRAPI.commonRequest(JLRAPI.api.UNREGISTER_VEHICLE);
                        if (result && result.code === 0) {
                            that.showTxt("车辆解绑成功")
                            if (txtlist.hasChildNodes()){
                                txtlist.removeChild(txtlist.firstChild)
                            }
                        }
                        else {
                            that.showTxt("车辆解绑失败")
                        }
                    }
                    catch (e) {}
                    resultinfo.style.display="flex"
                    txtlist.removeChild(txtlist.firstChild)
                }
            }
        }
        //查看csdk
        lookcsdk.onclick=async function(){
            document.querySelector('#set-input').style.display='none'
            that.showHandleBtn(txtlist,"是否查看CSDK","look-csdk")
            if(window.scope.existBtn){
                document.querySelector(".look-csdk").onclick=async ()=>{
                    let result = await  JLRAPI.commonRequest(JLRAPI.api.GET_HISTORY_LIST);
                    if (txtlist.hasChildNodes()){
                        txtlist.removeChild(txtlist.firstChild)
                    }
                    if(result && result.code === 1006){
                        that.showTxt("CSDK 不可用")
                    }else{
                        that.showTxt("CSDK 可用")
                    }
                    resultinfo.style.display="flex"
                }
            }
        }
        //设置天安门为车辆位置
        setcarlocation.onclick=async ()=>{
            document.querySelector('#set-input').style.display='none'
            that.showHandleBtn(txtlist,"是否设置天安门为车辆位置","set-car-location")
            if(window.scope.existBtn){
                document.querySelector(".set-car-location").onclick=()=>{
                    if (txtlist.hasChildNodes()){
                        txtlist.removeChild(txtlist.firstChild)
                    }
                    window.scope.carLocation.lng='116.4279556274414'
                    window.scope.carLocation.lat='39.90285873413086'
                    that.showTxt("车辆位置设置成功")
                    resultinfo.style.display="flex"
                }
            }
        }
        //清空当前车辆位置
        clearcarlocation.onclick = async ()=>{
            document.querySelector('#set-input').style.display='none'
            that.showHandleBtn(txtlist,"是否清空当前车辆位置","clear-car-location")
            if(window.scope.existBtn){
                document.querySelector(".clear-car-location").onclick=()=>{
                    if (txtlist.hasChildNodes()){
                        txtlist.removeChild(txtlist.firstChild)
                    }
                    window.scope.carLocation.lng=''
                    window.scope.carLocation.lat=''
                    that.showTxt("清空当前车辆位置成功")
                    resultinfo.style.display="flex"
                }
            }
        }
        //获取车辆当前位置
        getcarlocation.onclick=()=>{
            document.querySelector('#set-input').style.display='none'
            that.showHandleBtn(txtlist,"是否获取车辆当前位置","get-car-location")
            if(window.scope.existBtn){
                document.querySelector('.get-car-location').onclick=()=>{
                    console.log('车辆位置')
                    if (txtlist.hasChildNodes()){
                        txtlist.removeChild(txtlist.firstChild)
                    }
                    let text=`经度：${window.scope.carLocation.lng},纬度：${window.scope.carLocation.lat}`
                  that.showTxt(text)
                    resultinfo.style.display="flex"
                }
            }
        }
        //设置手机号
        setphonenumber.onclick=()=>{
            that.showHandleBtn(txtlist,"是否设置手机号","set-phone-number")
            if(document.querySelector("#set-number").value){
                document.querySelector("#set-number").value=""
            }
            document.querySelector('#set-input').style.display='flex'
            if(window.scope.existBtn){
                document.querySelector('.set-phone-number').onclick=async ()=>{
                    if (txtlist.hasChildNodes()){
                        txtlist.removeChild(txtlist.firstChild)
                    }

                    let keyboardObj = await   new phoenix.sys.keyboard.Keyboard({
                        mode: "alphanumeric",
                        requireAutocompletion: false,
                        hideCharacters: false,
                        value: window.scope.vechileinfo.phoneNum
                    })
                    keyboardObj.addEventListener("complete", (event) => {
                        window.activeRoute.activeRoutePage.keyboardComplete(event)
                    })
                    keyboardObj.show()

                    document.querySelector('#set-input').style.display='none'
                    resultinfo.style.display="flex"
                    that.showTxt(`手机号设置为${window.scope.vechileinfo.phoneNum}`)
                }
            }
        }
        //点击close关闭弹框
        document.querySelector("#bullet-box-close").onclick=()=>{
            console.log('close model')
            document.querySelector("#bullet-box").style.display ="none"
            clearInterval(window.scope.time);
        }
    }
    keyboardComplete(e) {
        window.scope.vechileinfo.phoneNum = e.text;
        window.scope.vechileinfo.phoneNum=document.querySelector("#set-number").value
        document.querySelector("#vechile_plateNum").innerText = window.scope.vechileinfo.phoneNum
    }
    //显示操作按钮
    static showHandleBtn(txtlist,text,className){
        console.log('show handle btn')
        document.querySelector("#result-info").style.display="none"
        let btnEle = document.createElement('div')
        if (txtlist.hasChildNodes()){
            txtlist.removeChild(txtlist.firstChild)
        }
        txtlist.appendChild(btnEle).addClass(className)
        btnEle.innerHTML=text
        window.scope.existBtn=true
    }
    //显示操作按钮后的结果文本
    static showTxt(text){
        document.getElementById("result-info").innerText=text
    }
}