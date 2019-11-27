// Functionality pulled from menubar.js. For full comments, refer to that component.

const $toggleForecast = $(".toggle-button input[name='forecastView']");

const forecastHoursId = "#forecastHours";
const forecastDaysId = "#forecastDays";

const forecastHoursObj = forecastHours;
const forecastDaysObj = forecastDays;

function routeViews({ selectedViewObject, selectedViewId }) {
	$(selectedViewId).length ? $(selectedViewId).show() : selectedViewObject.generate();
	$(selectedViewId).siblings().hide();
}

$toggleForecast.on("click", function() {
	let selectedHours = $("input:radio[name='forecastView']:checked").val() == "showHours";

	if (selectedHours) {
		routeViews({
			selectedViewObject: forecastHoursObj, 
			selectedViewId: forecastHoursId
		});
	} else {
		routeViews({
			selectedViewObject: forecastDaysObj, 
			selectedViewId: forecastDaysId
		});
	}
})