// Dependencies
const diskUtils = require('../lib/diskUtils')

const menuItems = require('../menu')


// Creating Container
const handlers = {}

handlers.menu = (data, callback) => {

    const acceptTableMethods = ['get']

    if (acceptTableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback)
    } else {
        callback(405, { msg: 'Invalid method' });
    }
}


// Container for the users submethods
handlers._users = {};


// Post a new user
handlers._users.get = (data, callback) => {

    // Get the token in headers
    const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

    diskUtils.read('tokens', token, (err, tokenData)=>{

        if (err || !tokenData) {
            callback(403, { Error: 'You are not authorized' })
            return
        }
        
        if(Date.now() > tokenData.expires){
            callback(403, {Error: 'Your session expired'})
            return
        }

        diskUtils.read('users', tokenData.phone, (err, userData)=>{

            if(err || !userData){
                callback(403, { Error: 'You are not authorized' })
                return
            }

            callback(200, {menu: menuItems})
        })

    })
}



module.exports = handlers