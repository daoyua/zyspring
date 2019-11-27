//Once the value of the below constants are updated and click functions for unneccessary buttons are deleted,
//menu bar routing is complete.

//variables for menu buttons -- Add id to buttons in menubar html in order to use this function effectively,
//rename the jquery selectors below to fit your button ids and delete extra buttons if not needed
const $buttonOne = $("#menuBarButtonOne");
const $buttonTwo = $("#menuBarButtonTwo");
const $buttonThree = $("#menuBarButtonThree");
const $buttonFour = $("#menuBarButtonFour");
const $buttonFive = $("#menuBarButtonFive");
//variables for page ids -- Add id to div appended to body-container in the generate functions for each page. In order to use this 
// function effectively rename the id selectors below to fit your page ids and delete extra pages if not needed
const pageOneId = "#pageOne";
const pageTwoId = "#pageTwo";
const pageThreeId = "#pageThree";
const pageFourId = "#pageFour";
const pageFiveId = "#pageFive";
//variables for page objects -- rename the values below to fit your page.js objects and delete extra pages if not needed
const pageOneObj = pageOne;
const pageTwoObj = pageTwo;
const pageThreeObj = pageThree;
const pageFourObj = pageFour;
const pageFiveObj = pageFive;

//view id and page object get passed to route views
function routeViews({ selectedViewObject, selectedViewId, selectedButton }) {
	//toggle "--selected" to the selected button
	if(!selectedButton.hasClass("menu-bar__button --selected")){
  		selectedButton.toggleClass("--selected");
	}
	selectedButton.parent().siblings().children().removeClass("--selected");

	$(selectedViewId).length ? $(selectedViewId).show() : selectedViewObject.generate();
	$(selectedViewId).siblings().hide();
}

//click/route function for menu buttons delete extra functions if you have less than 5 buttons
$buttonOne.on("click", function() {
	routeViews({
		selectedViewObject: pageOneObj, 
		selectedViewId: pageOneId,
		selectedButton: $buttonOne 
	});
});

$buttonTwo.on("click", function() {
	routeViews({
		selectedViewObject: pageTwoObj,
		selectedViewId: pageTwoId,
		selectedButton: $buttonTwo
	});
});

$buttonThree.on("click", function() {
	routeViews({
		selectedViewObject: pageThreeObj,
		selectedViewId: pageThreeId,
		selectedButton: $buttonThree
	}); 
});

$buttonFour.on("click", function() {
	routeViews({
		selectedViewObject: pageFourObj,
		selectedViewId: pageFourId,
		selectedButton: $buttonFour
	}); 
});

$buttonFive.on("click", function() {
	routeViews({
		selectedViewObject: pageFiveObj,
		selectedViewId: pageFiveId,
		selectedButton: $buttonFive
	});
});
