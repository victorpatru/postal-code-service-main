const db = require( '../db' );
const { logError } = require( '../logger' );
const { getConfig } = require( '../utils' );

(async () => {
    const config = getConfig();
    const countryCodes = config.countries;

    await db.client.connect();
    await Promise.all( countryCodes.map( async ( countryCode ) => {
        try {
            await db.dropPartition( countryCode );
        } catch ( error ) {
            logError( error )
        }
    } ) );
    await db.client.end();
})();