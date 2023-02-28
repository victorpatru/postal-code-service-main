const decompress = require( 'decompress' );
const http = require( 'https' );
const fs = require( 'fs' );

const downloadTo = ( url, dest ) => {
    return new Promise((resolve, reject) => {
        
        http.get( url, ( response ) => {

            if ( 404 === response.statusCode ) {
                reject( '404');
                return;
            }

            const file = fs.createWriteStream( dest );
            response.pipe( file );

            file.on( 'finish', () => {
                file.close( resolve );
            } );

        } ).on( 'error', ( err ) => {
            if ( fs.existsSync( dest ) ) {
                fs.unlinkSync( dest );
            }
            reject( 'ERROR' );
        } );
    });
}

// download data for a country and unzip file using decompress
const downloadFromGeonames = async ( countryCode ) => {
    try {
        const url = `https://download.geonames.org/export/zip/${ countryCode }.zip`;
        const zipFilePath = `./data/${ countryCode }.zip`;
        await downloadTo( url, zipFilePath );
        await decompress( zipFilePath, `./data/${ countryCode }` );

        fs.renameSync( `./data/${ countryCode }/${ countryCode }.txt`, `./data/${ countryCode }/raw.txt` );
        fs.unlinkSync( zipFilePath );

        return {
            success: true,
            source: url
        }
    } catch ( error ) {
        return {
            success: false,
            error
        }
    }
}

module.exports = downloadFromGeonames;
