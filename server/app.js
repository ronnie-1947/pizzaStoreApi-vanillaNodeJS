const http = require('http')
const url = require('url')
const {StringDecoder} = require('string_decoder')

const config = require('./config')

const helpers = require('./lib/helpers')
const router = require('./routes/routes')

const app = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true)
    const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')

    let buffer = ''

    req.on('data', data=>{
        const decoder = new StringDecoder(utf8)
        buffer += decoder.write(data)
    })

    req.on('end', ()=>{

        // Get request data
        const data = {
            trimmedPath,
            method: req.method,
            headers: req.headers,
            queryStringObject: parsedUrl.query,
            payload: helpers.parseJsonToObject(buffer)
        }

        // Choose the route
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router.notFound
        chosenHandler(data, (statusCode, payload)=>{

            // Use the status code called back
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Using the payload
            payload = typeof (payload) == 'object' ? payload : {};

            const payloadStr = JSON.stringify(payload)
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadStr)
        })
        
    
    })

})

app.listen(config.httpPort, () => {
    console.log(`Pizza store started on port ${config.httpPort} in ${config.envName} environment`)
})