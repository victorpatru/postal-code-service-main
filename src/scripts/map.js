const { logError } = require('../logger');
const { getConfig } = require( '../utils' );
const { map } = require( './utils' );

(async () => {
    const config = getConfig();
    const countryCodes = config.countries;
    await Promise.all( countryCodes.map( async ( countryCode ) => {
        try {
            await map( countryCode );
        } catch ( error ) {
            console.log( error );
            logError( error )
        }
    } ) );
})();
