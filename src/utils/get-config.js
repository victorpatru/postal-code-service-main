const yargs = require( 'yargs/yargs' );
const { hideBin } = require( 'yargs/helpers' );
const argv = yargs( hideBin( process.argv ) ).argv;
const countryFoldersList = require( './country-folders-list' );

const getConfig = () => {

    const config = {
        countries: []
    }

    const { countries, ...args } = argv;

    if ( argv.countries ) {
        if ( argv.countries === 'all' ) {
            args.countries = Object.values( countryFoldersList );
        } else {
            args.countries = Array.isArray( argv.countries ) ? argv.countries : argv.countries.split(',');
        }
    }

    Object.assign( config, args );

    return config;
}

module.exports = {
    getConfig
}