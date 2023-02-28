const { log, logError, print, printError, printSuccess } = require( '../logger' );
const { getConfig, getEntriesFromFile } = require( '../utils' );

(async () => {
    const config = getConfig();
    const countryCodes = config.countries;
    const { iso31662 } = await import( 'iso-3166' );

    for ( folderName of countryCodes ) {

        try {
            const filepath = `./data/${ folderName }/processed.txt`;
            const entries = await getEntriesFromFile( filepath );

            if ( ! entries.length ) {
                continue;
            }

            const countryCode = entries[0].country_code;
            const regionCodes = iso31662.filter( obj => obj.parent === countryCode );

            if ( ! regionCodes.length ) {
                print( `${ countryCode }: No data to validate region codes` );
                continue;
            }

            const missing = regionCodes.filter( obj => {
                return ! entries.some( entry => obj.code === `${ entry.country_code }-${ entry.region_code }` );
            } );

            if ( missing.length ) {
                printError( `${ countryCode }: No entries for the following region codes: ${ missing.map( obj => obj.code ).join( ', ' ) }` );
                missing.forEach( code => { console.log( code.code, code.name ) })
            } else {
                printSuccess( `${ countryCode }: All regional codes are present in entries` );
            }
            
            const valid = entries.filter( entry => {

                if ( entry.country_code !== countryCode ) {
                    log( `${ countryCode }: Wrong country code ${ entry.country_code }` );
                    return false;
                }

                if ( ! entry.region_code ) {
                    log( `${ countryCode }: No regional code for zipcode ${ entry.postal_code }` );
                    return false;
                }
            
                if ( ! iso31662.find( obj => obj.code === `${ entry.country_code }-${ entry.region_code }` ) ) {
                    log( `${ countryCode }: Invalid regional code: ${ entry.region_code } for zipcode ${ entry.postal_code }` );
                    return false;
                }

                return true;
            } );

            const invalidEntries = entries.length - valid.length;

            if ( invalidEntries ) {
                printError( `${ countryCode }: ${ invalidEntries } invalid entries` );
            } else {
                printSuccess( `${ countryCode }: All entries have valid regional codes` );
            }

        } catch ( err ) {
            logError( err );
        }
    }
})();