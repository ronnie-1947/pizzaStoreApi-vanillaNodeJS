/*
* Request Handlers
*/

// Creating Container
const handler = {}

handler.notFound = (data, callback)=>{
    callback(false,{ping: 'successful'})
}

handler.ping = (data, callback)=>{
    callback(false, {ping: 'successful'})
}



// Exporting the handler
module.exports = handler