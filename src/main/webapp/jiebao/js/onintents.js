/**
 * Created by sunxinhan on 2019/10/28.
 */

class Jlr_intents {
    constructor(data) {
        this.data = data;
    }


    getActionName() {
        let _data = this.data;
        let actionName = "";
        if (_data) {
            if (_data.appData && _data.appData.notificationType) {
                actionName = _data.appData.notificationType;
            }
        }
        return actionName;
    }

    /*
     pakingEnter
     parkingExit
     parkingActiveSession
     parkingAtuoPay
     parkingAutoPayFail
     parkingQRCodePay
     Parking.autoPaymentBind
     Parking.autoPaymentUnbind
     parkingDebtPay
     parkingDebtCreate
     parkingPaymentOvertime
     */

    async doAction() {
        let that = this;
        let action_name = this.getActionName()
        let action = {
            pakingEnter: pakingEnter
        }

        function findAction() {

            try {
                switch (action_name) {
                    case "parkingEnter":
                        pakingEnter()
                        break;
                    case "parkingExit":
                        parkingExit()
                        break;
                    case "parkingActiveSession":
                    case "parkingAtuoPay":
                    case "parkingQRCodePay":
                    case "Parking.autoPaymentBind":
                    case "Parking.autoPaymentUnbind":
                    case "parkingDebtPay":
                    case "parkingDebtCreate":
                    case "parkingPaymentOvertime":
                    default:
                        console.log("unknown action:", action_name)
                        break;
                }

            }
            catch (e) {
                JlrError.catchError(e)
            }
        }

        function parkingExit() {
            console.log("parkingEnter done")
            Router.To("nowpark", true)
        }

        function pakingEnter() {
            console.log("parkingEnter done")
            //app-在应用内部,直接跳转页面
            //app-在应用外包,提示Notification
            Router.To("nowpark", true)
        }


        findAction();
    }

}