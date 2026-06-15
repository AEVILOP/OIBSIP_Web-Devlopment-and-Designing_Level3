const Ingredient = require('../models/Ingredient');
const PizzaVariety = require('../models/PizzaVariety');

const ingredients = [
  { name: 'Classic Thin Crust', category: 'base', price: 0, imageEmoji: '◯' },
  { name: 'Thick Crust', category: 'base', price: 40, imageEmoji: '◎' },
  { name: 'Stuffed Crust', category: 'base', price: 80, imageEmoji: '◉' },
  { name: 'Whole Wheat', category: 'base', price: 30, imageEmoji: '🌾' },
  { name: 'Gluten-Free Base', category: 'base', price: 70, imageEmoji: 'GF' },
  { name: 'Classic Tomato', category: 'sauce', price: 0, imageEmoji: '🍅' },
  { name: 'Pesto', category: 'sauce', price: 35, imageEmoji: '🌿' },
  { name: 'BBQ', category: 'sauce', price: 30, imageEmoji: '🔥' },
  { name: 'Alfredo', category: 'sauce', price: 45, imageEmoji: '🥛' },
  { name: 'Spicy Arrabbiata', category: 'sauce', price: 25, imageEmoji: '🌶️' },
  { name: 'Mozzarella', category: 'cheese', price: 45, imageEmoji: '🧀' },
  { name: 'Cheddar', category: 'cheese', price: 50, imageEmoji: '🧀' },
  { name: 'Parmesan', category: 'cheese', price: 60, imageEmoji: '🧀' },
  { name: 'Vegan Cheese', category: 'cheese', price: 70, imageEmoji: '🌱' },
  { name: 'Mushrooms', category: 'veggie', price: 25, imageEmoji: '🍄' },
  { name: 'Bell Peppers', category: 'veggie', price: 20, imageEmoji: '🫑' },
  { name: 'Onions', category: 'veggie', price: 15, imageEmoji: '🧅' },
  { name: 'Olives', category: 'veggie', price: 30, imageEmoji: '●' },
  { name: 'Jalapeños', category: 'veggie', price: 25, imageEmoji: '🌶️' },
  { name: 'Corn', category: 'veggie', price: 20, imageEmoji: '🌽' },
  { name: 'Spinach', category: 'veggie', price: 20, imageEmoji: '🍃' },
  { name: 'Sun-dried Tomatoes', category: 'veggie', price: 35, imageEmoji: '🍅' },
  { name: 'Pepperoni', category: 'meat', price: 60, imageEmoji: '🔴' },
  { name: 'Chicken', category: 'meat', price: 70, imageEmoji: '🍗' },
  { name: 'Bacon', category: 'meat', price: 75, imageEmoji: '🥓' },
  { name: 'Sausage', category: 'meat', price: 65, imageEmoji: '🟤' },
].map((item) => ({ stock: 100, threshold: 20, isAvailable: true, ...item }));

const pizzas = [
  // 1-5 Classics
  { name: 'Ember Margherita', description: 'Tomato, fresh mozzarella, basil, and a blistered thin crust.', basePrice: 299, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80', category: 'veg' },
  { name: 'Classic Pepperoni', description: 'Double pepperoni, mozzarella, and our signature tomato sauce.', basePrice: 449, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80', category: 'non-veg' },
  { name: 'Veggie Supreme', description: 'Peppers, mushrooms, olives, corn, onions, and mozzarella.', basePrice: 379, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=80', category: 'veg' },
  { name: 'Smoky BBQ Chicken', description: 'Roasted chicken, smoky BBQ sauce, onions, and mozzarella.', basePrice: 429, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80', category: 'non-veg' },
  { name: 'Hawaiian Bliss', description: 'Ham, pineapple chunks, mozzarella, and a light tomato base.', basePrice: 399, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80', category: 'non-veg' }, // Reusing image for brevity, in real app use distinct
  
  // 6-10 Veggie Lovers
  { name: 'Forest Pesto', description: 'Pesto, mushrooms, spinach, parmesan, and toasted garlic.', basePrice: 399, image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80', category: 'veg' },
  { name: 'Vegan Firegarden', description: 'Arrabbiata, vegan cheese, peppers, olives, and jalapeños.', basePrice: 419, image: 'https://images.unsplash.com/photo-1576458088443-04a19bb13da6?auto=format&fit=crop&w=900&q=80', category: 'vegan' },
  { name: 'Four Cheese (Quattro Formaggi)', description: 'Mozzarella, cheddar, parmesan, and blue cheese on a garlic butter base.', basePrice: 459, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80', category: 'veg' },
  { name: 'Paneer Tikka', description: 'Spiced paneer chunks, onions, capsicum, and a tandoori sauce drizzle.', basePrice: 389, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=80', category: 'veg' },
  { name: 'Mushroom Truffle', description: 'Roasted mushrooms, truffle oil, white sauce, and thyme.', basePrice: 499, image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80', category: 'veg' },
  
  // 11-15 Meat Lovers
  { name: 'Meat Feast', description: 'Pepperoni, chicken, bacon, sausage, and ham on a BBQ base.', basePrice: 599, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80', category: 'non-veg' },
  { name: 'Spicy Sausage', description: 'Italian sausage, jalapeños, arrabbiata sauce, and chili flakes.', basePrice: 419, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80', category: 'non-veg' },
  { name: 'Chicken Alfredo', description: 'Grilled chicken, creamy alfredo sauce, spinach, and garlic.', basePrice: 439, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80', category: 'non-veg' },
  { name: 'Bacon & Brie', description: 'Crispy bacon, melted brie cheese, caramelized onions, and balsamic glaze.', basePrice: 479, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80', category: 'non-veg' },
  { name: 'Buffalo Chicken', description: 'Spicy buffalo chicken, blue cheese drizzle, and fresh celery.', basePrice: 429, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80', category: 'non-veg' },
  
  // 16-20 Exotics & Specials
  { name: 'Mediterranean', description: 'Feta cheese, kalamata olives, sun-dried tomatoes, and fresh oregano.', basePrice: 389, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80', category: 'veg' },
  { name: 'Prosciutto & Arugula', description: 'Thinly sliced prosciutto, fresh arugula, parmesan shavings, and olive oil.', basePrice: 549, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80', category: 'non-veg' },
  { name: 'Roasted Garlic & Spinach', description: 'Lots of roasted garlic, wilted spinach, and a blend of three cheeses.', basePrice: 369, image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80', category: 'veg' },
  { name: 'Chicken Tikka Masala', description: 'Indian spiced chicken tikka, coriander, onions, and a rich makhani sauce.', basePrice: 459, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80', category: 'non-veg' },
  { name: 'The Everything', description: 'A massive mix of 10 toppings. Only for the brave.', basePrice: 649, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=80', category: 'non-veg' },

  // Drinks
  { name: 'Classic Cola', description: 'Chilled 500ml classic cola.', basePrice: 60, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80', category: 'drink' },
  { name: 'Lemon-Lime Soda', description: 'Refreshing 500ml citrus soda.', basePrice: 60, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80', category: 'drink' },
  { name: 'Orange Soda', description: 'Sweet orange soda, 500ml.', basePrice: 60, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80', category: 'drink' },
  { name: 'Iced Lemon Tea', description: 'Cold brewed tea with a dash of lemon.', basePrice: 80, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80', category: 'drink' },
  { name: 'Sparkling Water', description: 'Crisp carbonated water.', basePrice: 50, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80', category: 'drink' },

  // Combos
  { name: 'Couple\'s Combo', description: '2 Medium Pizzas (Veg/Non-Veg) + 2 Soft Drinks + Garlic Bread.', basePrice: 899, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', category: 'combo' },
  { name: 'Party Pack', description: '4 Large Pizzas + 4 Soft Drinks + 2 Sides.', basePrice: 1999, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', category: 'combo' },
  { name: 'Game Night Special', description: '1 Large Meat Feast + 1 Large Veggie Supreme + 2 Colas.', basePrice: 949, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', category: 'combo' },
  { name: 'Vegan Deal', description: '1 Vegan Firegarden + 1 Sparkling Water + Vegan Garlic Bites.', basePrice: 499, image: 'https://images.unsplash.com/photo-1576458088443-04a19bb13da6?auto=format&fit=crop&w=900&q=80', category: 'combo' },
  { name: 'Solo Lunch', description: '1 Personal Pizza (Margherita or Pepperoni) + 1 Drink.', basePrice: 299, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80', category: 'combo' },
].map((pizza) => ({ isAvailable: true, ...pizza }));

const seedData = async () => {
  const [ingredientCount, pizzaCount] = await Promise.all([
    Ingredient.countDocuments(),
    PizzaVariety.countDocuments(),
  ]);

  if (ingredientCount === 0) {
    await Ingredient.insertMany(ingredients);
    console.log(`Seeded ${ingredients.length} ingredients`);
  }

  // Force re-seed to get all 30 items
  if (pizzaCount < pizzas.length) {
    await PizzaVariety.deleteMany({});
    await PizzaVariety.insertMany(pizzas);
    console.log(`Seeded ${pizzas.length} menu items (pizzas, drinks, combos)`);
  }
};

module.exports = seedData;
