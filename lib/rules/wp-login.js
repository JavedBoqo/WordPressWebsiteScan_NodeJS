
/**
 * wpcheck module wp-login.js
 * Scan WordPress login page for mistakes
 */


/**
 * Required modules
 */

const request = require( 'request' ).defaults( { followRedirect: false } )
const fs = require( '../fs' )
const log = require( '../log' )


/**
 * Initiator method
 *
 * @param   {Object}  data  Data object with request values
 * @return  void
 */

exports.fire = ( data ) => new Promise(function (resolve, reject) {
{

    const { wpURL, userAgent, silentMode } = data

    const filterName = fs.fileName( __filename, '.js' )

    const logObj = { silentMode, filterName }

    const targetURL = `${wpURL}/wp-login.php`
    
    request( {
        'url': targetURL,
        'method': 'HEAD',
        'headers': { 'User-Agent': userAgent }
    }, ( error, response ) => {
        // console.log("wp-login response",error,response.statusCode,response.request.uri.protocol)
        if ( error || response.statusCode === 404 ) {
            // return log.info( `${targetURL} is not found`, logObj )
            reject({"info":`${targetURL} is not found`})
        }

        if ( response.request.uri.protocol !== 'https:' ) {
            // log.info( `${targetURL} doesn't use HTTPS protocol`, logObj )
            reject({"info":`${targetURL} doesn't use HTTPS protocol`})
        } else {
            // log.ok( `${targetURL} uses HTTPS protocol`, logObj )
            resolve({"ok":`${targetURL} uses HTTPS protocol`})
        }

        if ( ! [401, 403].includes( response.statusCode ) ) {
            // return log.info( `${targetURL} is not protected by HTTP Auth`, logObj )
            reject({"info":`${targetURL} is not protected by HTTP Auth`})
        }

        // return log.ok( `${targetURL} is protected by HTTP Auth`, logObj )
        resolve({"ok":`${targetURL} is protected by HTTP Auth`})

    } )
}
})
