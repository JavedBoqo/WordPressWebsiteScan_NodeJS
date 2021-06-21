
/**
 * wpcheck module directory-listings.js
 * Scan /wp-includes for Apache directory listing
 */


/**
 * Required modules
 */

const request = require('request').defaults({ followRedirect: false })
// const fs = require('../fs')
const fs = require( 'fs' )
const log = require('../log')


const checkDirectoryListing = async(targetURL, userAgent, method = "GET",siteURL) => new Promise((resolve, reject) => {
    {
        request({
            'url': targetURL,
            'method': method,
            'headers': { 'User-Agent': userAgent }
        }, (error, response, body) => {
            console.log('body',error)
            fs.writeFile('myresponse.txt',JSON.stringify(body),function(err){
                if(err) console.log(err);
            })

            if (error || response.statusCode === 404) {
                reject({ "info": `${targetURL} is not found` })
            }

            if ((body && body.includes('.php')) || response && response.statusCode === 200) {
                reject({ "warning": `${siteURL} has directory listing on` })
            }

            resolve({ "ok": `${siteURL} has directory listing off` })
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
        let vulnerability = [];

        
        try {
            const vr = await checkDirectoryListing(`${wpURL}/wp-includes/`, userAgent,siteURL);
            vulnerability.push(vr);
        } catch (e) {            
            vulnerability.push(e);
        }

        try {
            const vr = await checkDirectoryListing(`${wpURL}/wp-content/uploads/`, userAgent,siteURL);
            vulnerability.push(vr);
        } catch (e) {
            vulnerability.push(e);
        }
        resolve(vulnerability);//*/



        // const { wpURL, siteURL, userAgent, silentMode } = data
    
        
       /*const p1 = await new Promise(async function (resolve, reject) { 
            request( {
            'url': `${wpURL}/wp-content/uploads/`,
            'method': 'GET',
            'headers': { 'User-Agent': userAgent }
        }, ( error, response, body ) => {
            console.log('statusCode',response.statusCode);
            
            if ( body.includes( '.php' ) || response.statusCode === 200) {
                reject({"warning":`${siteURL} has directory listing on`})
            }
    
            resolve({"ok":`${siteURL} has directory listing off`})            
        })
    });
    
     try {
            console.log('vrs',p1)
            vulnerability.push(vr);
        } catch (e) {            
            console.log('vre',e)
            vulnerability.push(e);
        }

        resolve(vulnerability);//*/
        /*const filterName = fs.fileName( __filename, '.js' )
    
        // const logObj = { silentMode, filterName }
    
        const targetURL = `${wpURL}/wp-includes/`    
        await request( {
            'url': targetURL,
            'method': 'GET',
            'headers': { 'User-Agent': userAgent }
        }, ( error, response, body ) => {
            if ( error || response.statusCode === 404 ) {
                reject({"info":`${targetURL} is not found`})
            }
    
            if ( body.includes( '.php' )  || response.statusCode === 200 ) {
                reject({"warning":`${siteURL} has directory listing on`})
            }
    
            resolve({"ok":`${siteURL} has directory listing off`})
    
        } )//*/



    }
})
