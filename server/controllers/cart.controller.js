/*
* Request Handlers
*/

const helpers = require('../lib/helpers')
const diskUtils = require('../lib/diskUtils')

const menu = require('../menu')

// Creating Container
const handlers = {}

handlers.cart = (data, callback) => {

    const acceptTableMethods = ['post', 'get', 'put', 'delete']

    if (acceptTableMethods.indexOf(data.method) > -1) {
        handlers._cart[data.method](data, callback)
    } else {
        callback(405, { msg: 'Invalid method' });
    }
}

// Creating container
handlers._cart = {}


// Set Item To Cart
handlers._cart.post = (data, callback) => {

    // Get the token in headers
    const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

    diskUtils.read('tokens', token, (err, tokenData) => {

        if (err || !tokenData) {
            callback(403, { Error: 'You are not authorized' })
            return
        }

        if (Date.now() > tokenData.expires) {
            callback(403, { Error: 'Your session expired' })
            return
        }


        diskUtils.read('users', tokenData.phone, (err, userData) => {

            if (err && !userData) {
                callback(403, { Error: 'You are not authorized' })
            }

            const menuId = typeof (data.payload.id) == 'string' ? data.payload.id : false;

            // Check for menuId
            if (!menuId) {
                callback(400, { Error: 'Missing menu Id' })
                return
            }

            // Check for menuItem
            let menuObj = menu.filter(c => c.id == menuId)[0]
            if (!menuObj) {
                callback(400, { Error: 'Invalid menu Id' })
                return
            }

            const userCart = typeof (userData.cart) == 'object' && userData.cart instanceof Array ? userData.cart : [];

            // Check cart item availablity
            const existingItemIndex = userCart.map(c => c.id).indexOf(menuId);

            // Updating cart
            if (existingItemIndex > -1) {
                menuObj = userCart[existingItemIndex];
                menuObj.quantity += 1;
                userCart[existingItemIndex] = menuObj
            } else {
                menuObj.quantity = 1
                userCart.push(menuObj)
            }

            // Update new userdata
            userData.cart = userCart

            // Write new userData to disk
            diskUtils.update('users', userData.phone, userData, (err) => {

                if (err) {
                    callback(500, { Error: 'Couldn\'t write data to disk' })
                    return
                }
                callback(200)
            })
        })
    })
}


// Get the cart details
handlers._cart.get = (data, callback) => {

    // Get the token in headers
    const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

    diskUtils.read('tokens', token, (err, tokenData) => {

        if (err || !tokenData) {
            callback(403, { Error: 'You are not authorized' })
            return
        }

        if (Date.now() > tokenData.expires) {
            callback(403, { Error: 'Your session expired' })
            return
        }

        diskUtils.read('users', tokenData.phone, (err, userData) => {

            if (err || !userData) {
                callback(403, { Error: 'You are not authorized' })
                return
            }

            callback(200, { cart: userData.cart })
        })

    })
}



// Remove a cart Item
handlers._cart.delete = (data, callback) => {

    // Get the token in headers
    const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

    diskUtils.read('tokens', token, (err, tokenData) => {

        if (err || !tokenData) {
            callback(403, { Error: 'You are not authorized' })
            return
        }

        if (Date.now() > tokenData.expires) {
            callback(403, { Error: 'Your session expired' })
            return
        }


        diskUtils.read('users', tokenData.phone, (err, userData) => {

            if (err && !userData) {
                callback(403, { Error: 'You are not authorized' })
            }

            const menuId = typeof (data.payload.id) == 'string' ? data.payload.id : false;

            // Check for menuId
            if (!menuId) {
                callback(400, { Error: 'Missing menu Id' })
                return
            }

            let userCart = typeof (userData.cart) == 'object' && userData.cart instanceof Array ? userData.cart : [];

            userCart = userCart.filter(c=>c.id!=menuId)

            // Update new userdata
            userData.cart = userCart

            // Write new userData to disk
            diskUtils.update('users', userData.phone, userData, (err) => {

                if (err) {
                    callback(500, { Error: 'Couldn\'t write data to disk' })
                    return
                }
                callback(200, {msg: 'Successfully updated cart'})
            }) 
        })
    })

}


module.exports = handlers