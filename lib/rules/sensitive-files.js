
/**
 * wpcheck module sensitive-files.js
 * Check WordPress/Apache/Dot files for their availability
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

exports.fire = async( data ) => new Promise(async function (resolve, reject) {
{

    const { wpURL, siteURL, userAgent, silentMode } = data

    const filterName = fs.fileName( __filename, '.js' )

    const logObj = { silentMode, filterName }

    const targets = [
        {
            'url': `${wpURL}/wp-config.php`,
            'method': 'HEAD',
            'pattern': 'DB_PASSWORD'
        },
        {
            'url': `${wpURL}/wp-admin/maint/repair.php`,
            'method': 'HEAD',
            'pattern': 'repair.php'
        },
        {
            'url': `${siteURL}/.htaccess`
        },
        {
            'url': `${siteURL}/.htpasswd`
        },
        {
            'url': `${siteURL}/.ssh`
        },
        {
            'url': `${siteURL}/.npmrc`
        },
        {
            'url': `${siteURL}/.gitconfig`
        },
        {
            'url': `${siteURL}/config.json`
        },
        {
            'url': `${wpURL}/wp-config-sample.php`
        },
        {
            'url': `${wpURL}/wp-content/debug.log`
        }
    ]
    
    await targets.forEach( ( { url, method = 'GET', pattern = null } ) => {        
        request( {
            'url': url,
            'method': method,
            'headers': { 'User-Agent': userAgent }
        }, ( error, response, body ) => {

            if ( error || response.statusCode !== 200 ) {
                // return log.ok( `${url} is not public`, logObj )
                reject(`${url} is not public`)
            }

            if ( ! pattern ) {
                // return log.warn( `${url} is public`, logObj )
                reject(`${url} is public`)
            }

            if ( ! body.includes( pattern ) ) {
                // return log.info( `${url} is public but safe`, logObj )
                reject(`${url} is public but safe`)
            }

            // return log.warn( `${url} is public and not safe`, logObj )
            resolve(`${url} is public and not safe`)

        } )

    } )
}
})
