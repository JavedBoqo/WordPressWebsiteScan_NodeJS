
/**
 * Required modules
 */

const request = require('request').defaults({ timeout: 9999 })
const fs = require('./fs')
const url = require('./url')
const log = require('./log')
const config = require('../config/app.json')


/**
 * Initiator method
 *
 * @param   {Object}  data  Initial data
 * @return  void
 */

module.exports.wpcheck = async (data) => //new Promise(async function (resolve, reject) {
{
    let response = {
        "success": false,
        "error": null,
        "data": []
    }
    // console.log("test", data); //return true;
    // App version
    if (data.v) {
        return require('./version')
    }

    // App help
    if (data.h) {
        return require('./help')
    }

    // Bulk file
    if (data.b) {
        // console.log("bbbb")
        try {
            data._.push(...fs.readFileLines(data.b))
        } catch (error) {
            log.warn(error)
        }
    }

    try {
        const url = data._[0];
        const first = await init({
            'wpURL': url,
            'siteURL': url,
            'rulesDir': data.r,
            'userAgent': data.u,
            'ignoreRule': data.i,
            'silentMode': data.s
        });
        // console.log(first);

        const second = await lookupSiteURL(first);
        // console.log('second', second);

        const third = await lookupWpURL(second);
        // console.log('third', third);

        const fourth = await loadRules(third);
        // console.log('fourth', fourth);
        response.success = true;
        response.data = fourth;
        // return fourth;

    } catch (e) {
        // console.log("NOw we eereeee", e.message);
        response.error = e.message;
    }
    return response;
}

/**
 * Validate URl and start lookup
 *
 * @param   {Object}  data  Initial data
 * @return  void
 */

const init = (data) => {

    return new Promise((resolve, reject) => {

        // Init siteURL
        const siteURL = url.normalize(data.siteURL)

        // Invalid URL?
        if (!siteURL) {
            return reject(new Error(`${data.siteURL} is not a valid URL`))
        }

        // Save URLs
        data.siteURL = data.wpURL = siteURL

        // Resolve data
        return resolve(data)

    })

}


/**
 * Lookup for the site URL
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

const lookupSiteURL = (data) => {

    return new Promise((resolve, reject) => {

        // Constants from data
        const { siteURL, userAgent, silentMode } = data

        // Request
        request({
            'url': siteURL,
            'method': 'HEAD',
            'headers': { 'User-Agent': userAgent }
        }, (error, response) => {

            // Handle errors
            if (error) {
                return reject(new Error(`Can not resolve ${siteURL} (${error.message})`))
            }

            // Status code not OK
            if (response.statusCode !== 200) {
                return reject(new Error(`Can not resolve ${siteURL} (${response.statusCode} status code)`))
            }

            // Override siteURL
            if (url.hasRedirects(response)) {
                const finalURL = url.getRedirect(response)

                if (finalURL) {
                    data.siteURL = data.wpURL = finalURL

                    log.info(`New site URL: ${siteURL} \u2192 ${finalURL}`, { silentMode })
                }
            }

            // Resolve data
            return resolve(data)

        })

    })

}


/**
 * Lookup for the WordPress URL
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

const lookupWpURL = (data) => {

    return new Promise((resolve, reject) => {

        // Constants from data
        const { wpURL, siteURL, userAgent, silentMode } = data

        // Test file URL
        const targetURL = siteURL + config.testFile

        // Request
        request({
            'url': targetURL,
            'method': 'HEAD',
            'headers': { 'User-Agent': userAgent }
        }, (error, response) => {

            // Extract URL from page content
            if (error || response.statusCode !== 200) {
                return extractWpURL(data).then(data => {

                    return resolve(data)

                }).catch(error => {
                    //console.log("okkk ererrrr")
                    return reject(error) // new Error() already called in extractWpURL()

                })
            }

            // Override wpURL
            if (url.hasRedirects(response)) {
                const finalURL = url.getRedirect(response)

                if (finalURL) {
                    data.wpURL = finalURL

                    // Small talk
                    log.info(`New WordPress URL: ${wpURL} \u2192 ${finalURL}`, { silentMode })
                }
            }

            // Resolve data
            return resolve(data)

        })

    })
}


/**
 * Extract WordPress URL from page content
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

const extractWpURL = (data) => {

    return new Promise((resolve, reject) => {

        // Constants from data
        const { wpURL, siteURL, userAgent, silentMode } = data

        // Request
        request({
            'url': wpURL,
            'method': 'GET',
            'headers': { 'User-Agent': userAgent }
        }, (error, response, body) => {

            // Handle errors
            if (error || response.statusCode !== 200) {
                return reject(new Error(`${siteURL} is not using WordPress (response error)`))
            }

            // Identifier not found
            if (!body.includes('/wp-')) {
                return reject(new Error(`${siteURL} is not using WordPress (no references to wp-*)`))
            }

            // Regexp discovery
            const [, parsedURL] = body.match(/["'](https?[^"']+)\/wp-(?:content|includes)/) || []

            // Unescape URL
            const finalURL = url.normalize(parsedURL)

            // Validate URL
            if (!finalURL) {
                return reject(new Error(`${siteURL} is not using WordPress (no valid references)`))
            }

            // Override wpURL
            data.wpURL = finalURL

            // Small talk
            log.info(`New WordPress URL: ${wpURL} \u2192 ${finalURL}`, { silentMode })

            // Resolve data
            return resolve(data)

        })

    })
}


/**
 * Load module rules from rules folder
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

const loadRules = async (data) => //new Promise(async  (resolve, reject) => {
{

    // Default rules dir
    let dirPaths = [config.rulesDir]

    // Custom rules dir
    if (data.rulesDir) {
        dirPaths.push(data.rulesDir)
    }


    // Add all scan rules here
    let rootPath = 'lib/rules/';

    let finalInfo = [];

    try {
        const vul1 = await fs.requireFile(`${rootPath}/fpd-vulnerability.js`).fire(data);
        finalInfo.push(vul1);

    } catch (e) {
        // console.log("Vulneral error:", e)
        finalInfo.push(e);
    }

    try {
        
        data.listing = '/wp-content/uploads/';
        const vul2 = await fs.requireFile(`${rootPath}/directory-listing.js`).fire(data);
        finalInfo.push(vul2);

    } catch (e) {
        // console.log("Vulneral error:", e)
        finalInfo.push(e);
    }

    try {
        data.listing = '/wp-includes/';
        const vul2_1 = await fs.requireFile(`${rootPath}/directory-listing.js`).fire(data);
        finalInfo.push(vul2_1);

    } catch (e) {
        // console.log("Vulneral error:", e)
        finalInfo.push(e);
    }

    try {
        const vul3 = await fs.requireFile(`${rootPath}/sensitive-files.js`).fire(data);
        vul3.map((item, i) => {
            finalInfo.push(item);
        })

    } catch (e) {
        // console.log("Vulneral error:", e)
        finalInfo.push(e);
    }

    try {
        const vul4 = await fs.requireFile(`${rootPath}/wp-login.js`).fire(data);
        finalInfo.push(vul4);

    } catch (e) {
        // console.log("Vulneral error:", e)
        finalInfo.push(e);
    }//*/

    return finalInfo;
}
// })