/*
*  Manage all routes here
*/

const userHandler = require('../controllers/users.controller')
const defaultHandler = require('../controllers/default.controller')
const tokenHandler = require('../controllers/tokens.controller')

// Set the container
const routes = {}

// Initiate Routes
routes.notFound = defaultHandler.notFound
routes.ping = defaultHandler.ping

routes.users = userHandler.users
routes.tokens = tokenHandler.tokens


module.exports = routes


