const https = require( 'https' );
const fs = require( 'fs' );

const { ZIPCODEBASE_API_KEY } = require( '../config/api.config' );

const getZipCodesForRegion = async ( countryCode, regionCode ) => {
    const url = `https://app.zipcodebase.com/api/v1/code/state?apikey=${ ZIPCODEBASE_API_KEY }&state_name=${ regionCode }&country=${ countryCode }`

    return new Promise((resolve, reject) => {
        https.get( url, res => {
            let body = '';

            res.on( 'data', chunk => {
                body += chunk;
            } );

            res.on( 'end', () => {
                resolve( JSON.parse( body ).results );
            } );

        } ).on( 'error', ( err ) => {
            reject( err )
        } );
    });
}

const downloadFromZipCodebase = async ( countryCode ) => {
    const { iso31662 } = await import( 'iso-3166' );
    const codes = iso31662.filter( code => code.parent === countryCode );
    
    let output = '';

    for ( code of codes ) {
        const region = code.name;
        const zipCodes = await getZipCodesForRegion( countryCode, region );

        if ( ! Array.isArray( zipCodes ) ) {
            continue;
        }

        zipCodes.forEach( zipCode => {
            
            const entry = [
                countryCode,
                zipCode,
                '', // municipality
                '', // admin_name_1
                '', // admin_code_1
                '', // admin_name_2
                '', // admin_code_2
                '', // admin_name_3
                '', // admin_code_3
                '', // latitude
                '', // longitude
                '', // accuracy
                code.code.split( '-' )[ 1 ] // region_code,
            ];

            const newLine = `${ entry.join( '\t' ) }\n`;

            output = `${ output }${ newLine }`;
        } )
    }

    const destination = `data/${ countryCode }`;

    if ( output === '' ) {
        return {
            success: false,
        }
    }

    if ( ! fs.existsSync( destination ) ) {
        fs.mkdirSync( destination );
    }

    const filepath = `${ destination }/raw.txt`

    if ( fs.existsSync( filepath ) ) {
        fs.unlinkSync( filepath );
    }

    fs.appendFileSync( filepath, output, ( err ) => {
        // console.log( err );
    } );

    return {
        success: true,
        source: 'https://zipcodebase.com'
    }
}

module.exports = downloadFromZipCodebase;
