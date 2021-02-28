/*
* Request Handlers
*/

const helpers = require('../lib/helpers')
const diskUtils = require('../lib/diskUtils')

// Creating Container
const handlers = {}

handlers.users = (data, callback) => {

    const acceptTableMethods = ['post', 'get', 'put', 'delete']
    
    if (acceptTableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback)
    } else {
        callback(405, {msg: 'Invalid method'});
    }
}


// Container for the users submethods
handlers._users = {};


// Post a new user
handlers._users.post = (data, callback)=>{
    
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
    diskUtils.create('users', phone, userData, (err)=>{

        if(err){
            callback(500, {Error: 'Server Internal Error'})
            return
        }

        callback(false, {})
    })

}




// Exporting the handler
module.exports = handlers