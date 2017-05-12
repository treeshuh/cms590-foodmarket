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
	GARLIC: {displayName: "Garlic", imageSource: "images/Garlic.png"},
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
	SALT: {displayName: "Salt", imageSource: "images/Soysauce.png"},
	SOY_SAUCE: {displayName: "Soy Sauce", imageSource: "images/Salt.png"},
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
		new RecipeStep("Mix the bread with the tomato and cucumber mixture, and add salt and pepper", STATIONS.PLATING, [INGREDIENTS.BREAD, INGREDIENTS.TOMATO, INGREDIENTS.TOMATO, INGREDIENTS.CUCUMBER, INGREDIENTS.CUCUMBER, INGREDIENTS.JALAPENO,
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

RECIPES.BEANS = new Recipe("Spicy Green Beans", [], [], "Good job, you finished the Spicy Green Beans Recipe!", "images/GreenBeansEND.png");
RECIPES.CORN_SOUP = new Recipe("Corn Soup", [], [], "Good job, you finished the Corn Soup!", "images/CornSoup.png");
RECIPES.PASTA = new Recipe("Pasta with Eggplant and Tomato", [], [], "Good job, you finished the Pasta Recipe!", "images/CornSoup.png");
RECIPES.CAULIFLOWER = new Recipe("Smoked and Spicy Roasted Cauliflower", [], [], "Good job, you finished the Cauliflower Recipe!", "images/CornSoup.png");

var STATES = {
	SHOPORCOOK: 0,
	DRAGDROP: 1,
	CUTTINGBOARD: 2,
	FARMERSMARKET: 3,
	SUPERMARKET: 4
}