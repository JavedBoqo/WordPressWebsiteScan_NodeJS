
/**
 * wpcheck module sensitive-files.js
 * Check WordPress/Apache/Dot files for their availability
 */


/**
 * Required modules
 */

const request = require('request').defaults({ followRedirect: false })
const fs = require('../fs')
const log = require('../log')


const checkVulnarable = async (url, userAgent, method = "GET", pattern = null) => new Promise((resolve, reject) => {
    {
        request({
            'url': url,
            'method': method,
            'headers': { 'User-Agent': userAgent }
        }, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                reject({ "ok": `${url} is not public` })
            }

            if (!pattern) {
                reject({ "warning": `${url} is public` })
            }

            if (!body.includes(pattern)) {
                reject({ "info": `${url} is public but safe` })
            }

            resolve({ "warning": `${url} is public and not safe` })
        });
    }
});

/**
 * Initiator method
 *
 * @param   {Object}  data  Data object with request values
 * @return  void
 */

exports.fire = (data) => new Promise(async function (resolve, reject) {
    {

        const { wpURL, siteURL, userAgent, silentMode } = data

        const filterName = fs.fileName(__filename, '.js')

        const logObj = { silentMode, filterName }

        let vulnerability = [];

        try {
            const vr = await checkVulnarable(`${wpURL}/wp-config.php`, userAgent, 'HEAD', 'DB_PASSWORD');
            console.log('wp-config s', vr);
            vulnerability.push(vr);
        } catch (e) {
            console.log('wp-config e', e);
            vulnerability.push(e);
        }

        try {
            const vr = await checkVulnarable(`${wpURL}/wp-admin/maint/repair.php`, userAgent, 'HEAD', 'repair.php');
            console.log('repair s', vr);
            vulnerability.push(vr);
        } catch (e) {
            console.log('repair e', e);
            vulnerability.push(e);
        }

        try {
            const vr = await checkVulnarable(`${siteURL}/.htaccess`, userAgent);
            console.log('htaccess s', vr);
            vulnerability.push(vr);
        } catch (e) {
            console.log('htaccess e', e);
            vulnerability.push(e);
        }

        try {
            const vr = await checkVulnarable(`${siteURL}/.htpasswd`, userAgent);
            console.log('htpasswd s', vr);
            vulnerability.push(vr);
        } catch (e) {
            console.log('htpasswd e', e);
            vulnerability.push(e);
        }

        try {
            const vr = await checkVulnarable(`${siteURL}/.ssh`, userAgent);
            console.log('ssh s', vr);
            vulnerability.push(vr);
        } catch (e) {
            console.log('ssh e', e);
            vulnerability.push(e);
        }


        try {
            const vr = await checkVulnarable(`${siteURL}/.npmrc`, userAgent);
            console.log('npmrc s', vr);
            vulnerability.push(vr);
        } catch (e) {
            console.log('npmrc e', e);
            vulnerability.push(e);
        }


        try {
            const vr = await checkVulnarable(`${siteURL}/.gitconfig`, userAgent);
            console.log('gitconfig s', vr);
            vulnerability.push(vr);
        } catch (e) {
            console.log('gitconfig e', e);
            vulnerability.push(e);
        }


        try {
            const vr = await checkVulnarable(`${siteURL}/config.json`, userAgent);
            console.log('config s', vr);
            vulnerability.push(vr);
        } catch (e) {
            console.log('config e', e);
            vulnerability.push(e);
        }

        try {
            const vr = await checkVulnarable(`${wpURL}/wp-config-sample.php`, userAgent);
            console.log('wp-config-sample s', vr);
            vulnerability.push(vr);
        } catch (e) {
            console.log('wp-config-sample e', e);
            vulnerability.push(e);
        }


        try {
            const vr = await checkVulnarable(`${wpURL}/wp-content/debug.log`, userAgent);
            console.log('debug s', vr);
            vulnerability.push(vr);
        } catch (e) {
            console.log('debug e', e);
            vulnerability.push(e);
        }//*/



        resolve(vulnerability);
        /*const targets = [
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
        
        targets.forEach( ( { url, method = 'GET', pattern = null } ) => {        
            request( {
                'url': url,
                'method': method,
                'headers': { 'User-Agent': userAgent }
            }, ( error, response, body ) => {
    
                if ( error || response.statusCode !== 200 ) {
                    // return log.ok( `${url} is not public`, logObj )
                    reject({"ok":`${url} is not public`})
                }
    
                if ( ! pattern ) {
                    // return log.warn( `${url} is public`, logObj )
                    reject({"warning":`${url} is public`})
                }
    
                if ( ! body.includes( pattern ) ) {
                    // return log.info( `${url} is public but safe`, logObj )
                    reject({"info":`${url} is public but safe`})
                }
    
                // return log.warn( `${url} is public and not safe`, logObj )
                resolve({"warning":`${url} is public and not safe`})
    
            } )
    
        } )//*/
    }
})
