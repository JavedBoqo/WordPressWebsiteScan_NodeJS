
/**
 * wpcheck module directory-listings.js
 * Scan /wp-includes for Apache directory listing
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

exports.fire = async( data ) => new Promise(function (resolve, reject) {
{

    const { wpURL, siteURL, userAgent, silentMode } = data

    const filterName = fs.fileName( __filename, '.js' )

    const logObj = { silentMode, filterName }

    const targetURL = `${wpURL}/wp-includes/`    
    request( {
        'url': targetURL,
        'method': 'GET',
        'headers': { 'User-Agent': userAgent }
    }, ( error, response, body ) => {
        // console.log("RRRRR",error,response,body)
        //  console.log("RRRRR",response.statusCode)
        if ( error || response.statusCode === 404 ) {
             log.info( `${targetURL} is not found`, logObj )
            reject(`${targetURL} is not found`)
        }

        if ( body.includes( '.php' ) ) {
            // return log.warn( `${siteURL} has directory listing on`, logObj )
            reject(`${siteURL} has directory listing on`)
        }

        // return log.ok( `${siteURL} has directory listing off`, logObj )
        resolve(`${siteURL} has directory listing off`)

    } )
}
})
