const Ingredient = require('../models/Ingredient');
const PizzaVariety = require('../models/PizzaVariety');
const asyncHandler = require('../utils/asyncHandler');

const getPizzas = asyncHandler(async (_req, res) => {
  const pizzas = await PizzaVariety.find({ isAvailable: true }).sort({ name: 1 });
  res.json({ pizzas });
});

const getIngredients = asyncHandler(async (_req, res) => {
  const ingredients = await Ingredient.find().sort({ category: 1, name: 1 });
  const grouped = ingredients.reduce((result, ingredient) => {
    if (!result[ingredient.category]) result[ingredient.category] = [];
    result[ingredient.category].push(ingredient);
    return result;
  }, {});
  res.json({ ingredients, grouped });
});

module.exports = { getPizzas, getIngredients };
