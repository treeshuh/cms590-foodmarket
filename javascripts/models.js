// Ingredient class
// details is one of the INGREDIENT enums
function Ingredient(details, price, daysToExpiration, isDirty=false) {
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
 
// Recipe Step class
// station is one of STATIONS enums
// ingredients is an array of INGREDIENT
// utensils is an array of Utensils
// goal is the cut type (CUTS enum) or cook time or null, depending on station type
function RecipeStep(text, station, ingredients, utensils, goal) {
	this.station = station;
	this.ingredients = ingredients;
	this.utensils = utensils;
	this.goal = goal;
	this.text = text;
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
		if (this.completedSteps.has(stepNum)) {
			return false; //already done
		}
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