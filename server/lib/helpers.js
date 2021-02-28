/*
* The helper library
*/


// Creating the container
const helpers = {}

helpers.parseJsonToObject = (str)=>{
    
    if(!typeof(str)==='string' || str.length < 1){
        return false;
    }
    return JSON.parse(str);
}



module.exports = helpers;