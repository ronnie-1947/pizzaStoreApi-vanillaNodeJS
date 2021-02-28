/*
* Request Handlers
*/

// Creating Container
const handler = {}

handler.notFound = (data, callback)=>{
    callback(404 , {msg: 'Not Found'})
}

handler.ping = (data, callback)=>{
    callback(false, {ping: 'successful'})
}



// Exporting the handler
module.exports = handler