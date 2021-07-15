
/**
 * wpcheck module directory-listings.js
 * Scan /wp-includes for Apache directory listing
 */


/**
 * Required modules
 */
 const cheerio = require('cheerio');
 const request = require('request').defaults({ followRedirect: false })
 // const fs = require('../fs')
 //const fs = require( 'fs' )
 
 
 const findVersion = async (url, userAgent, method = "GET",extra='') => new Promise((resolve, reject) => {
    {
        if(extra) url = `${url}/${extra}`;
        console.log(url);
        request({
            'url': url,
            'method': method,
            'headers': { 'User-Agent': userAgent }
        }, (error, response, body) => {

            if (error || response.statusCode === 404) {
                reject({ "info": `${targetURL} is not found` })
            }

            if(body){
               const $ = cheerio.load(body);
               const generator = $('meta[name="generator"]').attr('content')
               // console.log('generator',generator);
               if(generator) {
                   const wordpressLatestVersion="5.7.2";
                   const ext = generator.split(' ');                    
                   // console.log('extract',ext);
                   if(ext[1]) {
                       if(wordpressLatestVersion==ext[1]) {
                           resolve({ "ok": `${url} developed with latest version of Wordpress` })
                       }
                       reject({ "warning": `${url} is not developed with latest version of Wordpress` })
                   }
               }
           }
    
           resolve({"info":`WordPress version not found`})
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
         // console.log('data',data)
         const { wpURL, siteURL, userAgent, silentMode,listing } = data
         let vulnerability = [];

         try {
             const ver = await findVersion(`${wpURL}`, userAgent);
            //  console.log('Version is', ver);
             resolve(ver)
         } catch (e) {
             // console.log('wp-config e', e);
            //  vulnerability.push(e);
            const ver1 = await findVersion(`${wpURL}`, userAgent,'wp-admin');
            reject(e)
         }
         

         /*request( {
             'url': `${wpURL}`,
             'method': 'GET',
             'headers': { 'User-Agent': userAgent }
         }, ( error, response, body ) => {
              console.log('body',body);
             
             if (error || response.statusCode === 404) {
                 reject({ "info": `${targetURL} is not found` })
             }
 
             if(body){
                const $ = cheerio.load(body);
                const generator = $('meta[name="generator"]').attr('content')
                // console.log('generator',generator);
                if(generator) {
                    const wordpressLatestVersion="5.7.2";
                    const ext = generator.split(' ');                    
                    // console.log('extract',ext);
                    if(ext[1]) {
                        if(wordpressLatestVersion==ext[1]) {
                            resolve({ "ok": `${wpURL} developed with latest version of Wordpress` })
                        }
                        reject({ "warning": `${wpURL} is not developed with latest version of Wordpress` })
                    }
                }
            }
     
            resolve({"info":`WordPress version not found`})            
         })//*/
     }
 })
 