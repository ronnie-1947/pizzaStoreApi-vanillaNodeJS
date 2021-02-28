/*
*  Manage all routes here
*/

const userHandler = require('../controllers/users.controller')
const defaultHandler = require('../controllers/default.controller')

// Set the container
const routes = {}

// Initiate Routes
routes.notFound = defaultHandler.notFound
routes.ping = defaultHandler.ping

module.exports = routes


