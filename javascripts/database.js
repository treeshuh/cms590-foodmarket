var STATIONS = {
	STOVE : {id: 0, displayName:  "stove"},
	PREP : {id: 1, displayName: "prep station"},
	SINK: {id: 2, displayName: "sink"},
	PLATING: {id: 3, displayName: "plating"}
};

var CUTS = {
	SLICE : {id: 'SLICE', displayName: "slice" },
	MINCE : {id: 'MINCE', displayName: "mince", horzCuts: [50, 70, 90, 110, 130], vertCuts: [40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240]},
	DICE: {id: 'DICE', displayName: "dice", horzCuts: [50, 90, 130], vertCuts: [40, 80, 120, 160, 200, 240]}
};

var INGREDIENTS = {
	BEANS: {displayName: "Beans", imageSource: "images/Beans.png", cutImageSource: "images/ChoppedBeans.png"},
	BREAD: {displayName: "Bread", imageSource: "images/Bread.png", cutImageSource: "images/BreadPieces.png"},
	BUTTER: {displayName: "Butter", imageSource: "images/Butter.png", cutImageSource: "images/SliceOButter.png"},
	CAULIFLOWER: {displayName: "Cauliflower", imageSource: "images/CauliflowerHead.png", cutImageSource: "images/CauliflowerThings.png"},	
	CAYENNE: {displayName: "Cayenne", imageSource: "images/CayennePepper.png"},
	CELERY: {displayName: "Celery", imageSource: "images/Celery.png", cutImageSource: "images/ChoppedCelery.png"},	
	CORN_FROZEN: {displayName: "Frozen Corn", imageSource: "images/FrozenCorn.png", cutImageSource: "images/Corn.png"},	
	CUCUMBER: {displayName: "Cucumber", imageSource: "images/Cucumber.png", cutImageSource: "images/ChoppedCucumber.png"},
	EGGPLANT: {displayName: "Eggplant", imageSource: "images/Eggplant.png", cutImageSource: "images/ChoppedEggplant.png"},	
	FLOUR: {displayName: "Flour", imageSource: "images/Flour.png"},
	GARLIC: {displayName: "Garlic", imageSource: "images/Garlic.png", cutImageSource: "images/Corn.png"},
	GINGER: {displayName: "Ginger", imageSource: "images/Ginger.png"},
	JALAPENO: {displayName: "Jalapeno", imageSource: "images/Jalapeno.png", cutImageSource: "images/ChoppedCelery.png"}, //TODO: need jalapenos
	LIME: {displayName: "Lime", imageSource: "images/Lemon.png", cutImageSource: "images/HalfLemon.png"}, //TODO: color these
	OLIVE_OIL: {displayName: "Olive Oil", imageSource: "images/OliveOil.png"},
	ONION_RED: {displayName: "Red Onion", imageSource: "images/RedOnion.png", cutImageSource: "images/ChoppedOnions.png"},
	PEPPER: {displayName: "Pepper", imageSource: "images/Pepper.png"},
	PEPPER_GREEN_BELL: {displayName: "Green Bell Pepper", imageSource: "images/GreenBellPepper.png", cutImageSource: "images/ChoppedCucumber.png"}, //TODO: need peppers
	PEPPER_RED_BELL: {displayName: "Red Bell Pepper", imageSource: "images/RedBellPepper.png", cutImageSource: "images/ChoppedRedBellPepper.png"}, 
	PEPPER_FLAKES: {displayName: "Red Pepper Flakes", imageSource: "images/Flakes.png"},
	PAPRIKA: {displayName: "Paprika", imageSource: "images/SmokedPaprika.png"},
	POTATO: {displayName: "Potato", imageSource: "images/Potato.png", cutImageSource: "images/ChoppedPotato.png"},
	RIGATONI: {displayName: "Rigatoni Pasta", imageSource: "images/Rigatoni.png"},
	SALT: {displayName: "Salt", imageSource: "images/Salt.png"},
	SOY_SAUCE: {displayName: "Soy Sauce", imageSource: "images/Soysauce.png"},
	TOMATO: {displayName: "Tomato", imageSource: "images/Tomato.png", cutImageSource: "images/ChoppedTomatoes.png"},
	TOMATO_CANNED: {displayName: "Canned Tomatos", imageSource: "images/CannedTomatoes.png"},
	BROTH_VEGETABLE: {displayName: "Vegetable Broth", imageSource: "images/VegetableBroth.png"},
	OIL_VEGETABLE: {displayName: "Vegetable Oil", imageSource: "images/VegOil.png"},
};

var UTENSILS = {
	BOWL: {displayName: "Bowl", imageSource: "images/Bowl.png"},
	GRATER: {displayName: "Grater", imageSource: "images/Grater.png"},
	JUICER: {displayName: "Juicer", imageSource: "images/Juicer.png"},
	POT: {displayName: "Pot", imageSource: "images/Pot.png"},
	PAN: {displayName: "Pan", imageSource: "images/Pan.png"}
};

var NO_THROW = [INGREDIENTS.FLOUR, INGREDIENTS.OLIVE_OIL, INGREDIENTS.PAPRIKA, INGREDIENTS.SALT, INGREDIENTS.SOY_SAUCE, INGREDIENTS.PEPPER, INGREDIENTS.OIL_VEGETABLE, INGREDIENTS.CAYENNE];

var RECIPES = {}; 

RECIPES.PANZANELLA = new Recipe("Panzanella", 
	[
		new RecipeStep("Dice 2 tomatoes and 2 cucumbers", STATIONS.PREP, [INGREDIENTS.TOMATO, INGREDIENTS.TOMATO, INGREDIENTS.CUCUMBER, INGREDIENTS.CUCUMBER], [], CUTS.DICE),
		new RecipeStep("Mince 1 jalapeno", STATIONS.PREP, [INGREDIENTS.JALAPENO], [], CUTS.MINCE),
		new RecipeStep("Mix the chopped tomatoes and cucumbers with salt and pepper", STATIONS.PLATING, [INGREDIENTS.TOMATO, INGREDIENTS.TOMATO, INGREDIENTS.CUCUMBER, INGREDIENTS.CUCUMBER, INGREDIENTS.SALT, INGREDIENTS.PEPPER], [], null),
		new RecipeStep("Heat the jalapeno with olive oil", STATIONS.STOVE, [INGREDIENTS.JALAPENO, INGREDIENTS.OLIVE_OIL], [], 10),
		new RecipeStep("Make a sauce by heating jalapeno in a pan with olive oil, lime, salt, and pepper", STATIONS.STOVE, [INGREDIENTS.JALAPENO, INGREDIENTS.LIME, INGREDIENTS.OLIVE_OIL, INGREDIENTS.SALT, INGREDIENTS.PEPPER], [], 3),
		new RecipeStep("Cut the bread into small cubes", STATIONS.PREP, [INGREDIENTS.BREAD], [], CUTS.DICE),
		new RecipeStep("Heat up the bread on the stove til crispy on the edges", STATIONS.STOVE, [INGREDIENTS.BREAD], [], 5),
		new RecipeStep("Mix the bread with the tomato and cucumber mixture and jalapeno, and add salt and pepper", STATIONS.PLATING, [INGREDIENTS.BREAD, INGREDIENTS.TOMATO, INGREDIENTS.TOMATO, INGREDIENTS.CUCUMBER, INGREDIENTS.CUCUMBER, INGREDIENTS.JALAPENO,
				INGREDIENTS.SALT, INGREDIENTS.PEPPER], [], null)
	],
	[
		[], 
		[],
		[0],
		[1],
		[3],
		[],
		[5],
		[2,4,6]
	],
	'Good job, you finished Panzanella!',
	"images/Panzanella.png"
); // end of Panzanella

RECIPES.BEANS = new Recipe("Spicy Green Beans",
	[
		new RecipeStep("Chop the green beans", STATIONS.PREP, [INGREDIENTS.BEANS], [], CUTS.DICE),
		new RecipeStep("Mince some garlic", STATIONS.PREP, [INGREDIENTS.GARLIC], [], CUTS.MINCE),
		new RecipeStep("Add the vegetable oil and green beans to the pan", STATIONS.STOVE, [INGREDIENTS.BEANS, INGREDIENTS.OIL_VEGETABLE], [], 5),
		new RecipeStep("Cook the beans with soy sauce, garlic, and red pepper flakes until fragrant", STATIONS.STOVE, [INGREDIENTS.BEANS, INGREDIENTS.SOY_SAUCE, INGREDIENTS.GARLIC, INGREDIENTS.PEPPER_FLAKES], [], 20),
		new RecipeStep("Mix the beans, more soy sauce, and more red pepper flakes to taste", STATIONS.PLATING, [INGREDIENTS.BEANS, INGREDIENTS.SOY_SAUCE, INGREDIENTS.PEPPER_FLAKES], [], null)
	], 
	[
		[], [], [0], [1, 2], [3]
	],
	"Good job, you finished the Spicy Green Beans Recipe!",
	"images/GreenBeansEND.png"
);

RECIPES.CORN_SOUP = new Recipe("Corn Soup",
	[
		new RecipeStep("Chop onions, celery, red bell pepper, and potato", STATIONS.PREP, [INGREDIENTS.ONION_RED, INGREDIENTS.CELERY, INGREDIENTS.PEPPER_RED_BELL, INGREDIENTS.POTATO], [], CUTS.DICE),
		new RecipeStep("Mince garlic", STATIONS.PREP, [INGREDIENTS.GARLIC], [], CUTS.MINCE),
		new RecipeStep("Melt the butter in a large pot and add onion, celery, bell pepper, and potato", [INGREDIENTS.ONION_RED, INGREDIENTS.CELERY, INGREDIENTS.PEPPER_RED_BELL, INGREDIENTS.POTATO, INGREDIENTS.BUTTER], [], 10),
		new RecipeStep("Now add the garlic to the pot and let simmer", [INGREDIENTS.ONION_RED, INGREDIENTS.CELERY, INGREDIENTS.PEPPER_RED_BELL, INGREDIENTS.POTATO, INGREDIENTS.GARLIC, INGREDIENTS.BUTTER], [], 10),
		new RecipeStep("Make the soup: Add vegetable broth and flour (for thickness) to the pot. Add salt and pepper to taste.", [INGREDIENTS.ONION_RED, INGREDIENTS.CELERY, INGREDIENTS.PEPPER_RED_BELL, INGREDIENTS.POTATO, INGREDIENTS.BUTTER, INGREDIENTS.GARLIC, INGREDIENTS.BROTH_VEGETABLE, INGREDIENTS.FLOUR, INGREDIENTS.SALT, INGREDIENTS.PEPPER], [], 10),
	], 
	[
		[], [], [0], [1, 2], [3]
	],
	"Good job, you finished the Corn Soup!",
	"images/CornSoup.png"
);

RECIPES.PASTA = new Recipe("Pasta with Eggplant and Tomato", 
	[
		new RecipeStep("Cube the eggplant", STATIONS.PREP, [INGREDIENTS.EGGPLANT], [], CUTS.DICE),
		new RecipeStep("Mince the garlic", STATIONS.PREP, [INGREDIENTS.GARLIC], [], CUTS.MINCE),
		new RecipeStep("Boil the pasta according to instructions", STATIONS.STOVE, [INGREDIENTS.RIGATONI], [], 20),
		new RecipeStep("Cook the eggplant with salt and olive oil in a pan", STATIONS.STOVE, [INGREDIENTS.EGGPLANT, INGREDIENTS.SALT, INGREDIENTS.OLIVE_OIL], [], 7),
		new RecipeStep("Add garlic, red pepper flakes, and canned tomatoes to the eggplant", STATIONS.STOVE, [INGREDIENTS.EGGPLANT, INGREDIENTS.SALT, INGREDIENTS.OLIVE_OIL, INGREDIENTS.GARLIC, INGREDIENTS.PEPPER_FLAKES, INGREDIENTS.TOMATO_CANNED], [], 13),
		new RecipeStep("Toss the eggplant with the pasta, and add salt and pepper to taste", STATIONS.PLATING, [INGREDIENTS.EGGPLANT, INGREDIENTS.RIGATONI, INGREDIENTS.SALT, INGREDIENTS.PEPPER], [], null)
	], 
	[
		[], [], [], [0], [1, 3], [4], [2, 5]
	],
	"Good job, you finished the Pasta Recipe!",
	"images/CornSoup.png"
);

RECIPES.CAULIFLOWER = new Recipe("Smoked and Spicy Roasted Cauliflower",
	[
		new RecipeStep("Cut the cauliflower into small pieces", STATIONS.PREP, [INGREDIENTS.CAULIFLOWER], [], CUTS.DICE),
		new RecipeStep("Bake the cauliflower, garlic, butter, paprika, cayenne pepper, salt, and pepper.", STATIONS.STOVE, [INGREDIENTS.CAULIFLOWER, INGREDIENTS.GARLIC, INGREDIENTS.BUTTER, INGREDIENTS.PAPRIKA,INGREDIENTS.CAYENNE, INGREDIENTS.SALT, INGREDIENTS.PEPPER], [], 2)],
	[
		[], [0]
	],
	"Good job, you finished the Cauliflower Recipe!",
	"images/CornSoup.png"
);

var EASY_RECIPES = [RECIPES.BEANS];
var HARD_RECIPES = [RECIPES.BEANS, RECIPES.PANZANELLA, RECIPES.CAULIFLOWER, RECIPES.PASTA, RECIPES.CORN_SOUP];

var STATES = {
	SHOPORCOOK: 0,
	DRAGDROP: 1,
	CUTTINGBOARD: 2,
	FARMERSMARKET: 3,
	SUPERMARKET: 4,
	WHICHRECIPE: 5,
	HELP: 6
}

var OLD_LIME = new Ingredient(INGREDIENTS.LIME, 5, 2, false);
OLD_LIME.cut();
var DEFAULT_INVENTORY = [OLD_LIME,
						 new Ingredient(INGREDIENTS.BREAD, 10, 10, false),
						 new Ingredient(INGREDIENTS.FLOUR, 10, 100, false),
						 new Ingredient(INGREDIENTS.OLIVE_OIL, 10, 100, false),
						 new Ingredient(INGREDIENTS.PAPRIKA, 10, 100, false),
						 new Ingredient(INGREDIENTS.SALT, 10, 100, false),
						 new Ingredient(INGREDIENTS.SOY_SAUCE, 10, 100, false),
						 new Ingredient(INGREDIENTS.PEPPER, 10, 100, false),
						 new Ingredient(INGREDIENTS.PEPPER_FLAKES, 10, 100, false),
						 new Ingredient(INGREDIENTS.OIL_VEGETABLE, 10, 100, false),
						 new Ingredient(INGREDIENTS.CAYENNE, 10, 100, false),
						 new Ingredient(INGREDIENTS.RIGATONI, 10, 100, false)];
						 
var FARMERSMARKET_INVENTORY = [new Ingredient(INGREDIENTS.CUCUMBER, 5, 7),
						 new Ingredient(INGREDIENTS.CUCUMBER, 5, 7),
						 new Ingredient(INGREDIENTS.TOMATO, 10, 3),
						 new Ingredient(INGREDIENTS.TOMATO, 10, 3), 
						 new Ingredient(INGREDIENTS.BREAD, 20, 14, false),
						 new Ingredient(INGREDIENTS.JALAPENO, 5, 7)];

var SUPERMARKET_INVENTORY = [
							 new Ingredient(INGREDIENTS.BEANS, 7, 3),
							 new Ingredient(INGREDIENTS.BUTTER, 5, 14),
							 new Ingredient(INGREDIENTS.CAULIFLOWER, 7, 3),
							 new Ingredient(INGREDIENTS.CORN_FROZEN, 3, 3), 
							 new Ingredient(INGREDIENTS.EGGPLANT, 10, 14),
							 new Ingredient(INGREDIENTS.GARLIC, 5, 17),
							 new Ingredient(INGREDIENTS.GARLIC, 5, 17),
				   			 new Ingredient(INGREDIENTS.GINGER, 3, 17),
							 new Ingredient(INGREDIENTS.PEPPER_GREEN_BELL, 7, 7),
							 new Ingredient(INGREDIENTS.PEPPER_RED_BELL, 5, 7),
							 new Ingredient(INGREDIENTS.PEPPER_RED_BELL, 5, 7),
							 new Ingredient(INGREDIENTS.POTATO, 2, 14), 
							 new Ingredient(INGREDIENTS.POTATO, 2, 14),
							 new Ingredient(INGREDIENTS.BROTH_VEGETABLE, 10, 17),							 
							 new Ingredient(INGREDIENTS.SOY_SAUCE, 25, 100),
							 new Ingredient(INGREDIENTS.CUCUMBER, 10, 7),
							 new Ingredient(INGREDIENTS.CUCUMBER, 10, 7),
							 new Ingredient(INGREDIENTS.TOMATO_CANNED, 7, 30),
							 new Ingredient(INGREDIENTS.TOMATO, 7, 3),
							 new Ingredient(INGREDIENTS.TOMATO, 7, 3),
							 new Ingredient(INGREDIENTS.TOMATO, 7, 3), 
							 new Ingredient(INGREDIENTS.BREAD, 20, 14, false),
							 new Ingredient(INGREDIENTS.JALAPENO, 5, 7),
							 new Ingredient(INGREDIENTS.JALAPENO, 5, 7),
				   			 new Ingredient(INGREDIENTS.OLIVE_OIL, 50, 100)];

var EASY_BUYS = [INGREDIENTS.BEANS, INGREDIENTS.GARLIC];