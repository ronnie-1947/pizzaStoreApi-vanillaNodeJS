/*
* Request Handlers
*/

const helpers = require('../lib/helpers')
const diskUtils = require('../lib/diskUtils')

const tokenHandler = require('./tokens.controller')

// Creating Container
const handlers = {}

handlers.users = (data, callback) => {

    const acceptTableMethods = ['post', 'get', 'put', 'delete']

    if (acceptTableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback)
    } else {
        callback(405, { msg: 'Invalid method' });
    }
}


// Container for the users submethods
handlers._users = {};


// Post a new user
handlers._users.post = (data, callback) => {

    // Check that all required fields are filled out
    const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (!firstName || !lastName || !phone || !password) {
        callback(400, { Error: 'Missing required fields' })
        return
    }

    const hashedPassword = helpers.encryptString(password)

    const userData = {
        firstName,
        lastName,
        phone,
        password: hashedPassword
    }

    // Make new user in disk
    diskUtils.create('users', phone, userData, (err) => {

        if (err) {
            callback(500, { Error: 'Server Internal Error' })
            return
        }

        callback(false, {})
    })

}


// Get current user info
handlers._users.get = (data, callback) => {

    // Check that the phone number is valid
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (!phone) {
        callback(400, { Error: 'Missing required field' });
        return;
    }

    // Get the token in headers
    const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

    // Verify the token validation
    tokenHandler._tokens.verifyToken(token, phone, (validity) => {
        if (!validity) {
            callback(403, { Error: 'You are not authorized' })
            return
        }

        diskUtils.read('users', phone, (err, data) => {
            if (err || !data) {
                callback(404, { Error: 'User not found' })
                return
            }

            // Remove hashed password
            delete data.password;

            callback(200, data)
        })
    })
};


// Update the user
handlers._users.put = (data, callback) => {

    // Check that the phone number is valid
    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    // Check for the optional fields
    const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if the phone is invalid in all cases
    if (!phone) {
        callback(400, { Error: 'Missing phone number' });
        return;
    }

    // Get the token in headers
    const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

    // Verify the token validation
    tokenHandler._tokens.verifyToken(token, phone, (validity) => {

        if (!validity) {
            callback(403, { Error: 'You are not authorized' })
            return
        }

        // Error if nothing is sent to update
        if (firstName || lastName || password) {

            // Lookup User
            diskUtils.read('users', phone, (err, userData) => {
                if (err || !userData) {
                    callback(400, { Error: 'User not exist' })
                    return
                }

                firstName ? userData.firstName = firstName : '';
                lastName ? userData.lastName = lastName : '';
                password ? userData.hashedPassword = helpers.hash(password) : '';

                // Store the new updates
                diskUtils.update('users', phone, userData, err => {

                    if (err) {
                        callback(500, { Error: 'Could not update the user' })
                        return
                    }
                    callback(200)
                })
            })
        } else {
            callback(400, { Error: 'Missing Fields to update' })
            return
        }
    })
}


// Delete a user
// @Todo Delete additional fields related to customer
handlers._users.delete = (data, callback)=>{

    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (!phone) {
        callback(400, { Error: 'Missing required field' });
        return;
    }

    
    diskUtils.read('users', phone, (err, userData) => {
        
        if (err || !userData) {
            callback(500, { Error: 'Could not find user with the phone' })
            return
        }
        
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify the token validation
        tokenHandler._tokens.verifyToken(token, phone, (validity) => {

            if (!validity) {
                callback(403, { Error: 'You are not authorized' })
                return
            }
            diskUtils.delete('users', phone, err => {
                if (err) {
                    callback(500, { Error: 'Error in deleting user' })
                    return
                }

                callback(200)
            })
        })
    })
}

// Exporting the handler
module.exports = handlers