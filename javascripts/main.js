$(document).ready(function() {
// Ingredient class
// details is one of the INGREDIENT enums
function Ingredient(details, price, daysToExpiration) {
	this.details = details;
	this.price = price;
	this.daysToExpiration = daysToExpiration;
	this.washed = false;
	this.isCut = false;
	this.cooked = false;

	this.name = function() {
		return this.details.displayName;
	};

	this.image = function() {
		if (this.isCut) {
			return this.details.cutImageSource;
		} else {
			return this.details.imageSource;
		}
	}

	this.isExpired = function() {
		return this.daysToExpiration <= 0;
	};

	this.expireOneDay = function() {
		this.daysToExpiration -= 1;
	};

	this.wash = function() {
		this.washed = true;
	};

	this.cut = function() {
		this.isCut = true;
	};

	this.cook = function() {
		this.cooked = true;
	}
};

// utensils e.g. pots, pans
function Utensil(name) {
	this.name = name;
	this.clean = true;

	this.use = function() {
		this.clean = false;
	};

	this.wash = function() {
		this.clean = true;
	}
}

function Station(type) {
	this.type = type;
	this.inUse = false;

	this.use = function() {
		this.inUse = true;
	}

	this.finish = function() {
		this.inUse = false;
	}
}
 
var STATIONS = {
	STOVE : {id: 0, displayName:  "stove"},
	PREP : {id: 1, displayName: "prep station"},
	SINK: {id: 2, displayName: "sink"}
};

var CUTS = {
	SLICE : {id: 0, displayName: "slice"},
	MINCE : {id: 1, displayName: "mince"},
	DICE: {id: 2, displayName: "dice"}
};

var INGREDIENTS = {
	BREAD: {displayName: "Bread", imageSource: "images/Bread.png", cutImageSource: "images/BreadPieces.png"},
	CUCUMBER: {displayName: "Cucumber", imageSource: "images/Cucumber.png", cutImageSource: "images/ChoppedCucumber.png"},
	TOMATO: {displayName: "Tomato", imageSource: "images/Tomato.png", cutImageSource: "images/ChoppedTomato.png"},
};

var UTENSILS = {
	POT: {displayName: "Pot", imageSource: "images/pot.png"},
	PAN: {displayName: "Pan", imageSource: "images/pan.png"}
};

// Recipe Step class
// station is one of STATIONS enums
// ingredients is an array of INGREDIENT
// utensils is an array of Utensils
// goal is the cut type (CUTS enum) or cook time or null, depending on station type
function RecipeStep(station, ingredients, utensils, goal) {
	this.station = station;
	this.ingredients = ingredients;
	this.utensils = utensils;
	this.goal = goal;
};

// Recipe class
// steps is an array of RecipeSteps 
// dependencies is an array of arrays that denote dependencies
//		for example, [[], [0]] means the second step depends on the first
// 
function Recipe(steps, dependencies, reward) {
	this.steps = steps;
	this.dependencies = dependencies;
	this.reward = reward;
	this.completedSteps = new Set();

	this.canStartStep = function(stepNum) {
		var d = this.dependencies[stepNum];
		for (var i = 0; i < d.length; i++) {
			if (!this.completedSteps.has(d[i])) {
				return false;
			}
		}
		return true;
	};

	this.completeStep = function(stepNum) {
		if (stepNum <= this.steps.length) {
			this.completedSteps.add(stepNum);
		}
	};

	this.finished = function() {
		return this.completedSteps.size = this.steps.length;
	};
};

var STATES = {
	SHOPORCOOK: 0,
	DRAGDROP: 1,
	CUTTINGBOARD: 2,
	FARMERSMARKET: 3,
	SUPERMARKET: 4
}

var GameModel = function() {
	var me = this;
	me.STATES = ko.observable(STATES);
	me.state = ko.observable(0);
	me.title = ko.pureComputed(function() {
		switch(me.state()) {
			case STATES.SHOPORCOOK:
				return "What do you want to do?";
			case STATES.DRAGDROP: 
				return "Kitchen";
			case STATES.CUTTINGBOARD:
				return "Prep Station";
			case STATES.FARMERSMARKET:
				return "Farmer's Market";
			case STATES.SUPERMARKET:
				return "SuperMarket";
			default:
				return ""
		}
	});
	me.money = ko.observable(100);
	me.inventory = ko.observableArray([new Ingredient(INGREDIENTS.BREAD, 10, 10)]);
	me.supermarketInventory = ko.observableArray([new Ingredient(INGREDIENTS.CUCUMBER, 10, 7),
												  new Ingredient(INGREDIENTS.CUCUMBER, 10, 7),
												  new Ingredient(INGREDIENTS.TOMATO, 20, 3),
												  new Ingredient(INGREDIENTS.TOMATO, 20, 3), 
												  new Ingredient(INGREDIENTS.BREAD, 30, 14)
												  ]);

	me.countdown = ko.observable();

	me.buyFromSupermarket = function(supermarketIndex) {
		var ing = me.supermarketInventory.splice(supermarketIndex, 1)[0];
		me.inventory.push(ing);
		me.money(me.money()-ing.price);

	}
}

ko.bindingHandlers.timer = {

    update: function (element, valueAccessor) {

        // retrieve the value from the span
        var sec = $(element).text();
        var timer = setInterval(function() { 

            $(element).text(--sec);
            if (sec == 0) {
                clearInterval(timer);
            }
        }, 1000);
    }
};

ko.applyBindings(new GameModel());

}); //end of document.ready