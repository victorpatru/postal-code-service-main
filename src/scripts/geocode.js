const { logError } = require('../logger');
const { getConfig } = require( '../utils' );
const { geocode } = require( './utils' );

(async () => {
    const config = getConfig();
    const countryCodes = config.countries;
    await Promise.all( countryCodes.map( async ( countryCode ) => {
        try {
            await geocode( countryCode );
        } catch ( error ) {
            logError( error );
        }
    } ) );
})();
