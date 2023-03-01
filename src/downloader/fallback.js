const { getOutputForEntries } = require( '../entry' );
const { logError } = require('../logger');
const { createFile, getUniqueEntries } = require( '../utils' );

const downloadFromFallback = async ( countryCode ) => {
    
    try {
        const { default: fallback } = await import( `../../fallback/${ countryCode }/${ countryCode }.js` );
        const entries = await fallback.getEntries();
        const output = getOutputForEntries( entries );
        
        createFile( `./data/${ countryCode }`, 'raw.txt', output )
        
        return {
            success: true,
            source: fallback.source
        }
    } catch ( error ) {
        logError( error );

        return {
            success: false,
            error
        }
    }
}

module.exports = downloadFromFallback;

