/*
* Library for Storing and Editing File
*/

// Dependencies
const fs = require('fs')
const path = require('path')

const helpers = require('../lib/helpers')

// Create the container
const lib = {}

// Make base Directory of the data folder
const baseDir = path.join(__dirname, '..', '.data')

// Create a new file and write data
lib.create = (dir, file, data, callback)=>{

    fs.open(`${baseDir}/${dir}/${file}.json`, 'wx', (err, fd)=>{

        if(err || !fd){
            callback('Could\'t create a new file, It may already exist')
            return
        }

        // Convert data to string
        const str = JSON.stringify(data)

        // Write to file and close it
        fs.writeFile(fd, str, err=>{

            if(err){
                callback('Error writing to file')
                return
            }

            fs.close(fd, err=>{
                if(err){
                    callback('Error closing new file')
                    return
                }
                callback(false)
            })
        })
    })
}


// Read data from an existing file
lib.read = (dir, file, callback)=>{

    fs.readFile(`${baseDir}/${dir}/${file}.json`, 'utf8', (err, data)=>{

        if(err){
            callback(err, data);
            return
        }
        
        const parsedData = helpers.parseJsonToObject(data)
        callback(false, parsedData)
    })
}

// Update the existing file
lib.update = (dir, file, data, callback)=>{

    // Open the file for writing
    fs.open(`${baseDir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor)=>{
        if(err){
            callback('Could not open the file for updating. May not existing yet')
            return
        }

        // Convert data to string
        const stringData = JSON.stringify(data);

        // Write to file and close it
        fs.ftruncate(fileDescriptor, (err)=>{ 
            if(err){
                callback('Error truncating file')
                return
            }

            fs.writeFile(fileDescriptor, stringData, (err)=>{
                if(err){
                    callback('Error in writing in existing fle')
                    return
                }
                fs.close(fileDescriptor, err=>{
                    if(err){
                        callback('Error in closing the file')
                        return
                    }
                    callback(false)
                })

            })
        })
    })
}


// Delete a file
lib.delete = (dir, file, callback)=>{

    // unlink the file
    fs.unlink(`${baseDir}/${dir}/${file}.json`, (err)=>{
        if(err){
            callback('Error in deleting file')
            return
        }
        callback(false)
    })
}



module.exports = lib