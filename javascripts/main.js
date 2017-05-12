$(document).ready(function() {

var GameModel = function() {
	var me = this;
	me.STATES = ko.observable(STATES);
	me.CUTS = ko.observable(CUTS);
	me.LEVELS = {EASY: 0, HARD: 1};
	me.playing = ko.observable(false);
	me.level = ko.observable(me.LEVELS.EASY);
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
	var OLD_LIME = new Ingredient(INGREDIENTS.LIME, 5, 2, false);
	OLD_LIME.cut();
	var OLD_BREAD = new Ingredient(INGREDIENTS.BREAD, 10, 10, false);
	//OLD_BREAD.cut();
	me.inventory = ko.observableArray([OLD_BREAD,
									   OLD_LIME,
									   new Ingredient(INGREDIENTS.SALT, 1, 100),
									   new Ingredient(INGREDIENTS.PEPPER, 1, 100),
									   new Ingredient(INGREDIENTS.OLIVE_OIL, 50, 100)
									   ]);
	me.supermarketInventory = ko.observableArray([new Ingredient(INGREDIENTS.CUCUMBER, 10, 7),
												  new Ingredient(INGREDIENTS.CUCUMBER, 10, 7),
												  new Ingredient(INGREDIENTS.CUCUMBER, 10, 7),
												  new Ingredient(INGREDIENTS.TOMATO, 20, 3),
												  new Ingredient(INGREDIENTS.TOMATO, 20, 3),
												  new Ingredient(INGREDIENTS.TOMATO, 20, 3), 
												  new Ingredient(INGREDIENTS.BREAD, 30, 14, false),
												  new Ingredient(INGREDIENTS.JALAPENO, 5, 7),
												  new Ingredient(INGREDIENTS.JALAPENO, 5, 7),
									   			  new Ingredient(INGREDIENTS.OLIVE_OIL, 50, 100)
												  ]);


	me.countdown = ko.observable();
	me.cookTimerLeft = ko.observable(0); //count up timer
	me.cookTimerRight = ko.observable(0); //count up timer
	me.leftStove = new Station(STATIONS.STOVE, 1);
	me.rightStove = new Station(STATIONS.STOVE, 2);
	me.leftPlate = new Station(STATIONS.PLATING, 3);
	me.rightPrep = new Station(STATIONS.PREP, 4);
	me.allStations = [me.leftStove, me.rightStove, me.leftPlate, me.rightPrep];

	me.currentRecipe = RECIPES.PANZANELLA;
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

	me.currentRightStoveGoal = ko.pureComputed({
		read: function() {
			if (me.rightStove.hasValidMove() && me.rightStove.active()) {
				return me.currentRecipe.steps[me.rightStove.hasValidMove()-1].goal;	
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
			if (me.currentCutStep()) {
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
/*			me.allStations.forEach(function(station) {
				station.hasValidMove(false);
			});*/
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
			station.hasValidMove(false);
			return me.currentRecipe.steps[stepNum];
		}
	};

	me.executePlate = function(station) {
		var step = me.executeStep(station);
		/*station.items().forEach(function(ing, index) {
			ing.pending(false);
		});
		station.items([]);*/
		if (me.currentRecipe.finished()) {
			me.completeRecipe(station);
		}
		me.dropHandler(me.dropHandler() + 1);
	}

	// should only be called on ingredients
	me.executeWash = function(station) {
		var step = me.executeStep(station);
		station.items().forEach(function(ing, index) {
			ing.wash();
			ing.pending(false);
		});
		station.items([]);
		if (me.currentRecipe.finished()) {
			me.completeRecipe(station);
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
			me.completeRecipe(station);
		}
		me.dropHandler(me.dropHandler() + 1);	
		me.state(STATES.DRAGDROP);	
	}

	me.executeCook = function(station, element, timer) {
		var progressElement = $($(element).closest("td")).find(".progress-bar");
		if (progressElement.hasClass("over")) {
			window.alert("looks like you burned your food :( we'll let you pass this time!");
		} else if (progressElement.hasClass("pending")) {
			window.alert("looks like you're not quite done cooking. please wait some more :)");
			return;
		}
		var step = me.executeStep(station);
		station.items().forEach(function(ing, index) {
			ing.cook();
			ing.pending(false);
		});
		station.items([]);
		if (me.currentRecipe.finished()) {
			me.completeRecipe(station);
		}
		timer(0);
		station.active(false);
		me.dropHandler(me.dropHandler() + 1);
	}

	me.completeRecipe = function(lastStation) {
		window.alert(me.currentRecipe.reward);
		me.finishedRecipes.push(me.currentRecipe);

		lastStation.items().forEach(function(ing, index) {
			for (var i = 0; i < me.inventory().length; i++) {
				if (ing.equals(me.inventory()[i])) {
					me.inventory.splice(i, 1);
					break;
				}
			}			
		});
		me.state(me.STATES().SHOPORCOOK)

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
		if (!values.goal() && _timers[values.id]) {
			clearInterval(_timers[values.id]);
			$(element).removeClass("ready");
			$(element).removeClass("over");
			$(element).removeClass("pending");
		}
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