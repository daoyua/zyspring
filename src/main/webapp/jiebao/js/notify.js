/**
 * @global
 * @description Notify类型,应用程序内部所有notification的集合
 */
const notifyType = {
    PhoneVcodeError: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.send_PhoneVcode_Error`)
        },
        timeout: 4000
    },
    PhoneVcodeSuccess: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.send_PhoneVcode_Success`)
        },
        timeout: 4000
    },
    Lan_firstLanuch: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.lan_En`)
        },
        Lan_firstLanuch: true,
        timeout: 4000
    },
    Lan_NotSupport: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.lan_notsuport`, {lan: window.scope.choseLanguage})
        },
        Lan_NotSupport: true,
        timeout: 4000
    },
    HistoryDel_Error: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.historyDel_Error`)
        },
        timeout: 4000
    },
    ETCPPayment: {

        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        extraInformation: {
            size: "large",
            timeout: 4000,
        },
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.cashOrCoupon`)
        },
        actions: [
            {
                name: 'Action3',
                get title() {
                    return window.scope.locale.t(`${window.scope.localLanguage}.common.yes`)
                }

            },
            {
                name: 'Action3',
                get title() {
                    return window.scope.locale.t(`${window.scope.localLanguage}.common.no`)
                }
            }
        ],
        timeout: 4000
    },
    VechilesetupError: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.vechile_info_setup_error`)
        },
        timeout: 4000
    },
    NavigationError: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.navigate_error`)
        },
        timeout: 4000
    },
    VechileInfoFail: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.vehicle_info_fail`)
        },
        timeout: 4000
    },
    Destination: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.navigation`)
        },
        actions: [
            {
                name: 'navigate',
                extraInformation: {
                    lon: 116.39756,
                    lat: 39.908808
                },
                get title() {
                    return window.scope.locale.t(`${window.scope.localLanguage}.common.yes`)
                }
            },
            {
                name: 'setDestination_no',
                get title() {
                    return window.scope.locale.t(`${window.scope.localLanguage}.common.no`)
                }
            },
        ],
        timeout: 4000
    },
    PhoenixError: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.phoenix_error`)
        },
        timeout: 4000
    },
    CCCommonError: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.CCCommonError`)
        },
        timeout: 4000
    },
    CP_SYSTEM_COMMON_ERROR: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.CP_SYSTEM_COMMON_ERROR`)
        },
        timeout: 4000
    },
    HistoryDelAll_Error: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.historyDel_Error`)
        },
        timeout: 4000
    },
    MobileError_Enable: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.MobileError_Disabled_Content`)
        },
        actions: [
            {
                name: 'ConnectError_Disabled_Btn',
                get title() {
                    return window.scope.locale.t(`${window.scope.localLanguage}.notify.MobileError_Disabled_Btn`)
                }
            }
        ],
        timeout: 4000
    },
    ConnectError_Enable: {
        get contentTitle() {
            return window.scope.locale.t(`${window.scope.localLanguage}.common.payment`)
        },
        behavior: 'persistent',
        category: 'reminder',
        priority: 'default',
        get contentText() {
            return window.scope.locale.t(`${window.scope.localLanguage}.notify.ConnectError_Disabled_Content`)
        },
        actions: [
            {
                name: 'Action3',
                get title() {
                    return window.scope.locale.t(`${window.scope.localLanguage}.common.ok`)
                }
            }
        ],
        timeout: 4000
    }
}


/**
 * notification 类
 * @class
 */
class JLRNotify {
    constructor() {
    }

    static async open(type) {
        try {
            let notificationManagerObject = phoenix.sys.notifications.notificationManager;
            let notification = await notificationManagerObject.create(type);

            notification.addEventListener("notificationaction", (event) => {
                console.log(event);
            });


            notification.onnotificationaction = async (event) => {
                switch (event.name) {
                    case "navigate":
                        Common.navigation(event.extraInformation.lon, event.extraInformation.lat)
                        break;
                    case "ConnectError_Disabled_Btn":
                        await phoenix.sys.settings.settingsManager.showSettingsScreen(phoenix.sys.settings.SettingsFilter.Connectivity);
                        break;
                    default:
                        break;
                }
                if (simulator) {
                    simulator.slog('do something');
                }
                console.log(event);
            }

            if (notification) {
                await notification.show();
                // console.log("type Lan_firstLanuch", type.hasOwnProperty("Lan_firstLanuch"), type)
                //todo:因暂不支持,所以考虑其他方案
                // if (type.hasOwnProperty("Lan_firstLanuch")) {
                //     let appStore = phoenix.sys.persistency.appStorage;
                //     let status = await  appStore.setItem('Lan_firstLanuch', true)
                // }
                // if (type.hasOwnProperty("Lan_NotSupport")) {
                //     let appStore = phoenix.sys.persistency.appStorage;
                //     let status = await appStore.setItem('Lan_NotSupport', true)
                // }

            }
        }
        catch (e) {
            JlrError.catchError(e)
        }
    }
}

  



