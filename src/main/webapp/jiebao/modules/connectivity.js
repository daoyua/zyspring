/**
 * @namespace page
 * @description enable connectivity
 */
class Connectivity {
    constructor() {

    }

    unLoad() {
        console.log('Connectivity unLoad')
    }

    async onLoad() {
        console.log('Connectivity OnLoad')

        if (!window.scope.mobileData) {
            document.querySelector(".content").innerText = window.scope.locale.t(`${window.scope.localLanguage}.connectivity.allow_connect`)
            document.querySelector("#reaload").innerText = window.scope.locale.t(`${window.scope.localLanguage}.connectivity.allow_btn`)
            document.querySelector("#reaload").onclick = async function () {
                await phoenix.sys.settings.settingsManager.showSettingsScreen(phoenix.sys.settings.SettingsFilter.Connectivity)
            }
        }
        else {
            //mobile data on
            if (!window.scope.isConnected) {
                document.querySelector(".content").innerText = window.scope.locale.t(`${window.scope.localLanguage}.connectivity.UnableConnect`)
                document.querySelector("#reaload").innerText = window.scope.locale.t(`${window.scope.localLanguage}.connectivity.unableConnect_btn`)
                document.querySelector("#reaload").onclick = function () {
                    window.location.reload()
                }
            }
        }
    }
}