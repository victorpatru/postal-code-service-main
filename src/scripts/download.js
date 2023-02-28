const { logError } = require('../logger');
const { getConfig } = require( '../utils' );
const { download } = require( './utils' );

(async () => {
    const config = getConfig();
    const countryCodes = config.countries;
    await Promise.all( countryCodes.map( async ( countryCode ) => {
        try {
            await download( countryCode );
        } catch ( error ) {
            console.log( error );
            logError( error )
        }
    } ) );
})();
