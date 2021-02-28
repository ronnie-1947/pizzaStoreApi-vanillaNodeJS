/*
* Request Handlers
*/

const helpers = require('../lib/helpers')
const diskUtils = require('../lib/diskUtils')

// Creating Container
const handlers = {}

handlers.tokens = (data, callback) => {

    const acceptTableMethods = ['post', 'get', 'put', 'delete']

    if (acceptTableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback)
    } else {
        callback(405, { msg: 'Invalid method' });
    }
}

// Creating container
handlers._tokens = {}


// Create new token
handlers._tokens.post = (data, callback) => {

    // Get the required fields
    const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (!phone || !password) {
        callback(400, { Error: 'missing required fields' })
        return
    }

    diskUtils.read('users', phone, (err, userData)=>{

        if (err || !userData) {
            callback(400, { Error: 'could not find the specified user' })
            return
        }

        // Password Verification
        const hashedPassword = helpers.encryptString(password);
    
        // Checking password
        if (hashedPassword != userData.password) {
            callback(400, { Error: 'Wrong password' })
            return;
        };
    
        const tokenId = helpers.createRandomString(10)
    
        const expires = Date.now() + 1000*60*60;
        const tokenObject = {
            id: tokenId,
            phone,
            expires
        };
    
        diskUtils.create('tokens', id, tokenObject, (err)=>{
            if (err) {
                callback(500, { Error: 'Could not create token' })
            }
            callback(200, tokenObject)
        })

    })

}

module.exports = handlers;