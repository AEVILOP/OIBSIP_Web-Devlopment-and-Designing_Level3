const Ingredient = require('../models/Ingredient');
const PizzaVariety = require('../models/PizzaVariety');

const BASE_CUSTOM_PRICE = 199;

const cleanIds = (ids = []) => [...new Set(ids.map(String))];

const calculateOrder = async (details, options = {}) => {
  if (details.orderType === 'menu') {
    const pizza = await PizzaVariety.findOne({
      _id: details.pizzaVarietyId,
      isAvailable: true,
    }).session(options.session || null);

    if (!pizza) {
      const error = new Error('This pizza is unavailable or does not exist');
      error.status = 400;
      throw error;
    }

    return {
      totalPrice: pizza.basePrice,
      pizzaVariety: pizza,
      customization: undefined,
      stockItems: [],
    };
  }

  const requested = [
    details.baseId,
    details.sauceId,
    details.cheeseId,
    ...cleanIds(details.veggieIds),
    ...cleanIds(details.meatIds),
  ].filter(Boolean).map(String);

  if (new Set(requested).size !== requested.length) {
    const error = new Error('The same ingredient cannot be selected more than once');
    error.status = 400;
    throw error;
  }

  const ingredients = await Ingredient.find({ _id: { $in: requested } })
    .session(options.session || null);

  if (ingredients.length !== requested.length) {
    const error = new Error('One or more selected ingredients do not exist');
    error.status = 400;
    throw error;
  }

  const byId = new Map(ingredients.map((item) => [item._id.toString(), item]));
  const requireCategory = (id, category, label) => {
    const item = byId.get(String(id));
    if (!item || item.category !== category) {
      const error = new Error(`Please select a valid ${label}`);
      error.status = 400;
      throw error;
    }
    if (!item.isAvailable || item.stock < 1) {
      const error = new Error(`${item.name} is currently out of stock`);
      error.status = 409;
      throw error;
    }
    return item;
  };

  const base = requireCategory(details.baseId, 'base', 'base');
  const sauce = requireCategory(details.sauceId, 'sauce', 'sauce');
  const cheese = requireCategory(details.cheeseId, 'cheese', 'cheese');
  const veggies = cleanIds(details.veggieIds).map((id) => requireCategory(id, 'veggie', 'veggie'));
  const meats = cleanIds(details.meatIds).map((id) => requireCategory(id, 'meat', 'meat'));

  const snapshot = (item) => ({
    ingredientId: item._id,
    name: item.name,
    price: item.price,
  });

  const selected = [base, sauce, cheese, ...veggies, ...meats];
  return {
    totalPrice: BASE_CUSTOM_PRICE + selected.reduce((sum, item) => sum + item.price, 0),
    pizzaVariety: null,
    customization: {
      base: snapshot(base),
      sauce: snapshot(sauce),
      cheese: snapshot(cheese),
      veggies: veggies.map(snapshot),
      meats: meats.map(snapshot),
    },
    stockItems: selected,
  };
};

module.exports = { calculateOrder, BASE_CUSTOM_PRICE };
