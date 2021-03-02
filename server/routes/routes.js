/*
*  Manage all routes here
*/

const userHandler = require('../controllers/users.controller')
const defaultHandler = require('../controllers/default.controller')
const tokenHandler = require('../controllers/tokens.controller')
const menuHandler = require('../controllers/menu.controller')
const cartHandler = require('../controllers/cart.controller')

// Set the container
const routes = {}

// Initiate Routes
routes.notFound = defaultHandler.notFound
routes.ping = defaultHandler.ping

routes.users = userHandler.users
routes.tokens = tokenHandler.tokens

routes.menu = menuHandler.menu

routes.cart = cartHandler.cart


module.exports = routes


