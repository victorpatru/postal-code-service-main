const dbConfig = require('../config/db.config');
const db = require( '../db' );
const { logError } = require('../logger');
const { getConfig } = require( '../utils' );
const { deploy } = require( './utils' );

(async () => {
    const config = getConfig();
    const countryCodes = config.countries;

    for ( const countryCode of countryCodes ) {
        try {
            await deploy( countryCode );
        } catch ( error ) {
            logError( error )
        }
    }
})();
