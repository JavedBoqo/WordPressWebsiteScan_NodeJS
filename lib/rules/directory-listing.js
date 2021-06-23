
/**
 * wpcheck module directory-listings.js
 * Scan /wp-includes for Apache directory listing
 */


/**
 * Required modules
 */

const request = require('request').defaults({ followRedirect: false })
// const fs = require('../fs')
//const fs = require( 'fs' )


/**
 * Initiator method
 *
 * @param   {Object}  data  Data object with request values
 * @return  void
 */

exports.fire = (data) => new Promise(async function (resolve, reject) {
    {
        // console.log('data',data)
        const { wpURL, siteURL, userAgent, silentMode,listing } = data
        
            request( {
            'url': `${wpURL}${listing}`,
            'method': 'GET',
            'headers': { 'User-Agent': userAgent }
        }, ( error, response, body ) => {
            // console.log('statusCode',response.statusCode);
            
            if (error || response.statusCode === 404) {
                reject({ "info": `${targetURL} is not found` })
            }

            if ( body.includes( '.php' ) || response.statusCode === 200) {
                reject({"warning":`${siteURL}${listing} has directory listing on`})
            }
    
            resolve({"ok":`${siteURL}${listing} has directory listing off`})            
        })
    }
})
