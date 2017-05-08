$(document).ready(function() {
// Ingredient class
// details is one of the INGREDIENT enums
function Ingredient(details, price, daysToExpiration, isDirty=true) {
	this.details = details;
	this.price = price;
	this.daysToExpiration = daysToExpiration;
	this.pending = ko.observable(false);
	this.washed = ko.observable(!isDirty);
	this.isCut = ko.observable(false);
	this.cooked = false;

	this.name = function() {
		return this.details.displayName;
	};

	this.image = function() {
		if (this.isCut()) {
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
		this.washed(true);
	};

	this.cut = function() {
		this.isCut(true);
	};

	this.cook = function() {
		this.cooked = true;
	};

	this.equals = function(other) {
		return this.details.displayName == other.details.displayName && this.daysToExpiration == other.daysToExpiration
			&& this.washed == other.washed && this.pending == other.pending && this.isCut == other.isCut && this.cooked == other.cooked;
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

function Station(type, id) {
	var me = this;
	this.id = id;
	this.type = type;
	this.hasValidMove = ko.observable(false);
	this.active = ko.observable(false);
	this.items = ko.observableArray();
	this.latest = ko.computed({
		read: function() {
			return me.items().length ? me.items()[0] : "";
		}, 
		write: function(value) {
			value.pending(true);
			me.items.push(value);
		}
	});

	this.hasItem = function(itemToMatch) {
		var out = false;
		this.items().forEach(function(item) {
			if (item.name() == itemToMatch.displayName) {
				out = true;
			}
		});
		return out;
	};
}
 
var STATIONS = {
	STOVE : {id: 0, displayName:  "stove"},
	PREP : {id: 1, displayName: "prep station"},
	SINK: {id: 2, displayName: "sink"}
};

var CUTS = {
	SLICE : {id: 'SLICE', displayName: "slice" },
	MINCE : {id: 'MINCE', displayName: "mince"},
	DICE: {id: 'DICE', displayName: "dice", horzCuts: [50, 90, 130], vertCuts: [40, 80, 120, 160, 200, 240]}
};

var INGREDIENTS = {
	BREAD: {displayName: "Bread", imageSource: "images/Bread.png", cutImageSource: "images/BreadPieces.png"},
	CUCUMBER: {displayName: "Cucumber", imageSource: "images/Cucumber.png", cutImageSource: "images/ChoppedCucumber.png"},
	TOMATO: {displayName: "Tomato", imageSource: "images/Tomato.png", cutImageSource: "images/ChoppedTomatoes.png"},
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
function Recipe(name, steps, dependencies, reward, image) {
	this.name = name;
	this.steps = steps;
	this.image = image;
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
		return this.completedSteps.size == this.steps.length;
	};
};

var STUPID_RECIPE = new Recipe("Panzanella",
		//new RecipeStep(STATIONS.SINK, [INGREDIENTS.TOMATO, INGREDIENTS.CUCUMBER], [], null), // wash cucumber and tomato
		//new RecipeStep(STATIONS.PREP, [INGREDIENTS.TOMATO, INGREDIENTS.CUCUMBER, INGREDIENTS.BREAD], [], CUTS.DICE), // dice cucumber, tomato, and bread
		[new RecipeStep(STATIONS.STOVE, [INGREDIENTS.BREAD], [], 10)
	], [[]], ':D', "images/Panzanella.png");

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
	me.CUTS = ko.observable(CUTS);
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
	me.inventory = ko.observableArray([new Ingredient(INGREDIENTS.BREAD, 10, 10, false), new Ingredient(INGREDIENTS.CUCUMBER, 10, 7, false), new Ingredient(INGREDIENTS.TOMATO, 20, 3, false)]);
	me.supermarketInventory = ko.observableArray([new Ingredient(INGREDIENTS.CUCUMBER, 10, 7),
												  new Ingredient(INGREDIENTS.CUCUMBER, 10, 7),
												  new Ingredient(INGREDIENTS.TOMATO, 20, 3),
												  new Ingredient(INGREDIENTS.TOMATO, 20, 3), 
												  new Ingredient(INGREDIENTS.BREAD, 30, 14, false)
												  ]);

	me.countdown = ko.observable();
	me.cookTimerLeft = ko.observable(0); //count up timer
	me.cookTimerRight = ko.observable(0); //count up timer
	me.leftStove = new Station(STATIONS.STOVE, 1);
	me.rightStove = new Station(STATIONS.STOVE, 2);
	me.leftSink = new Station(STATIONS.SINK, 3);
	me.rightPrep = new Station(STATIONS.PREP, 4);
	me.allStations = [me.leftStove, me.rightStove, me.leftSink, me.rightPrep];

	me.currentRecipe = STUPID_RECIPE;
	me.finishedRecipes = ko.observableArray([]);

	me.horzCuts = ko.observableArray([]);
	me.vertCuts = ko.observableArray([]);
	me.cutIndex = ko.observable(0);

	me.currentLeftStoveGoal = ko.pureComputed({
		read: function() {
			if (me.leftStove.hasValidMove() && me.leftStove.active()) {
				return me.currentRecipe.steps[me.leftStove.hasValidMove()-1].goal;	
			} else {
				return null;
			}
		}
	});

	me.currentCutStep = ko.pureComputed({
		read: function() {
			if (me.rightPrep.hasValidMove()) {
				return me.currentRecipe.steps[me.rightPrep.hasValidMove()-1];	
			} else {
				return null;
			}
		}
	});

	me.currentChop = ko.pureComputed({
		read: function() {
			if (me.rightPrep.items().length > 0) {
				return me.rightPrep.items()[me.cutIndex()];
			} else {
				return null;
			}
		}
	});

	me.currentCutType = ko.pureComputed({
		read: function() {if (me.rightPrep.hasValidMove()) {
			return me.currentCutStep().goal.id;
		}}
	});

	me.showHorzCut = function(cut) {
		return me.horzCuts().indexOf(cut) < 0;
	}

	me.registerHorzCut = function(cut) {
		me.horzCuts.push(cut);

	};

	me.showVertCut = function(cut) {
		return me.vertCuts().indexOf(cut) < 0;
	}

	me.registerVertCut = function(cut) {
		me.vertCuts.push(cut);
	};

	me.cutHandler = ko.pureComputed({
		read: function() {
			if (me.rightPrep.hasValidMove()) {
				var cutType = me.CUTS()[me.currentCutStep().goal.id];
				var h = me.horzCuts();
				var v = me.vertCuts();
				for (var i = 0; i < cutType.horzCuts.length; i++) {
					if (h.indexOf(cutType.horzCuts[i]) < 0) {
						return false;
					}
				}
				for (var j = 0; j < cutType.vertCuts.length; j++) {
					if (v.indexOf(cutType.vertCuts[j]) < 0) {

						return false;
					}
				}
				me.rightPrep.items()[me.cutIndex()].cut();
				me.cutIndex(me.cutIndex()+1);
				me.horzCuts([]);
				me.vertCuts([]);
				if (me.cutIndex() == me.rightPrep.items().length) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	});

	// checks for valid moves
	me.dropHandler = ko.pureComputed({
		read: function() {
			return "hello lol"
		},
		write: function(value) {
			me.allStations.forEach(function(station) {
				station.hasValidMove(false);
			});
			me.currentRecipe.steps.forEach(function(step, stepNum) {
				if (me.currentRecipe.canStartStep(stepNum)) {
					me.allStations.forEach(function(station) {
						if (station.type.displayName == step.station.displayName && station.items().length == step.ingredients.length + step.utensils.length) {
							var match = true;
							step.ingredients.concat(step.utensils).forEach(function(item) {
								if (!station.hasItem(item)) {
									match = false;
								}
							});
							if (match) {
								station.hasValidMove(stepNum + 1);
							}
						}
					})
				}
			})
		}
	});

	me.buyFromSupermarket = function(supermarketIndex) {
		var ing = me.supermarketInventory.splice(supermarketIndex, 1)[0];
		me.inventory.push(ing);
		me.money(me.money()-ing.price);
	};

	me.returnToFridge = function(ingredient, station, ingredientIndex) {
		ingredient.pending(false);
		station.items.splice(ingredientIndex, 1);
		me.dropHandler(0);
	};

	// returns the step
	me.executeStep = function(station) {
		if (station.hasValidMove()) {
			var stepNum = station.hasValidMove() - 1;
			me.currentRecipe.completeStep(stepNum);
			return me.currentRecipe.steps[stepNum];
		}
	};

	// should only be called on ingredients
	me.executeWash = function(station) {
		var step = me.executeStep(station);
		station.items().forEach(function(ing, index) {
			ing.wash();
			ing.pending(false);
		});
		station.items([]);
		if (me.currentRecipe.finished()) {
			window.alert(me.currentRecipe.reward);
		}
		me.dropHandler(me.dropHandler() + 1);
	}

	me.executeCut = function(station) {
		var step = me.executeStep(station);
		station.items().forEach(function(ing, index) {
			ing.cut();
			ing.pending(false);
		});
		station.items([]);
		if (me.currentRecipe.finished()) {
			window.alert(me.currentRecipe.reward);
		}
		me.dropHandler(me.dropHandler() + 1);	
		me.state(STATES.DRAGDROP);	
	}

	me.executeCook = function(station, element) {
		if ($(element).hasClass("over")) {
			window.alert("looks like you burned your food :( we'll let you pass this time!");
		}

		var step = me.executeStep(station);
		station.items().forEach(function(ing, index) {
			ing.cook();
			ing.pending(false);
			for (var i = 0; i < me.inventory().length; i++) {
				if (ing.equals(me.inventory()[i])) {
					me.inventory.splice(i, 1);
					break;
				}
			}
		});
		station.items([]);
		if (me.currentRecipe.finished()) {
			window.alert(me.currentRecipe.reward);
			me.finishedRecipes.push(me.currentRecipe);
			me.state(me.STATES().SHOPORCOOK)
		}
		me.dropHandler(me.dropHandler() + 1);
	}
}

//http://stackoverflow.com/questions/17473354/knockout-js-countdown-timer
ko.bindingHandlers.timer = {
    update: function (element, valueAccessor) {
        // retrieve the value from the span
        var sec = $(element).text();
        var timer = setInterval(function() { 
            $(element).text(--sec);
            if (sec <= 0) {
                clearInterval(timer);
            }
        }, 1000);
    }
};

var _TIMING_BUFFER = 2.5;
var _timers = {LEFT: null, RIGHT: null};
ko.bindingHandlers.verticalProgressBar = {
	update: function (element, valueAccessor) {
		var values = ko.unwrap(valueAccessor());
		if (values.goal() && !_timers[values.id]) {
			_timers[values.id] = setInterval(function() {
				if (values.current() > values.goal() + _TIMING_BUFFER) {
					clearInterval(_timers[values.id]);
					$(element).removeClass("ready");
					$(element).addClass("over");
				} else if (values.current() < values.goal() - _TIMING_BUFFER) {
					$(element).addClass("pending");
				} else {
					$(element).addClass("ready");
					$(element).removeClass("pending");
				}
				values.current(values.current() + 0.1);
				$(element).animate({height: String(Math.min(140, values.current()/values.goal()*140)) + "px"});
			}, 500);
		}
	}
}

//http://jsfiddle.net/wilsonhut/2nj9J/
var _dragged;
ko.bindingHandlers.drag = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var dragElement = $(element);
        var dragOptions = {
            helper: 'clone',
            revert: true,
            revertDuration: 0,
            cursorAt: {left: 200, top: 20},
            cursor: 'none',
            start: function() {
                _dragged = ko.utils.unwrapObservable(valueAccessor().value);
            },
            cursor: 'default'
        };
        dragElement.draggable(dragOptions).disableSelection();
    }
};

ko.bindingHandlers.drop = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var dropElement = $(element);
        var dropOptions = {
            drop: function(event, ui) {
                valueAccessor().value(_dragged);
            	valueAccessor().root.dropHandler(_dragged);
            }
        };
        dropElement.droppable(dropOptions);
    }
};

ko.applyBindings(new GameModel());

}); //end of document.ready