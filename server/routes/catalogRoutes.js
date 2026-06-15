const express = require('express');
const controller = require('../controllers/catalogController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/pizzas', controller.getPizzas);
router.get('/ingredients', auth, controller.getIngredients);

module.exports = router;
