const { log } = require( '../logger' );
const regionCodeMapping = require( './mapping' );
const getOutputForEntries = require( './get-output-for-entries' );

const createEntriesFromContent = async ( content ) => {
    const rows = await parseContent( content );
    const entries = rows.map( createEntry );
    return entries;
}

/**
 * Parse the content of a file into an array of rows.
 * Split the content into lines by newline
 * Parse each line into an array of cells
 * @param {string} content - the content of a file
 * @returns {Promise} array of rows
 */
 const parseContent = ( content ) => {
    return new Promise( ( resolve, reject ) => {
        try {
            const lines = content.split( '\n' ).filter( row => row );
            const data = lines.map( line => line.trim().split( '\t' ) );
            resolve( data );
        } catch ( err ) {
            log( `ERROR: Could not parse content: ${ err }` );
            resolve( [] );
        }
    } );
}

const createEntry = ( cells ) => {

    const entry = {
        country_code: cells[0] || null,
        postal_code: cells[1] || null,
        municipality: cells[2] || null,
        admin_name_1: cells[3] || null,
        admin_code_1: cells[4] || null,
        admin_name_2: cells[5] || null,
        admin_code_2: cells[6] || null,
        admin_name_3: cells[7] || null,
        admin_code_3: cells[8] || null,
        latitude: cells[9] ? parseFloat( cells[9] ) : null,
        longitude: cells[10] ? parseFloat( cells[10] ) : null,
        accuracy: cells[11] ? parseInt( cells[11], 10 ) : null,
        region_code: cells[12] || null
    }

    return entry;
}

const createEntries = ( rows ) => {
    return rows.map( createEntry );
}

const getRegionCode = async ( entry, countryCode ) => {
    const mappingFn = regionCodeMapping[ countryCode ];

    if ( typeof mappingFn !== 'function' ) {
        return entry.region_code;
    }
    
    return await mappingFn( entry );
}

const addRegionCode = async ( entry, countryCode ) => {
    entry.region_code = await getRegionCode( entry, countryCode );
}

module.exports = {
    addRegionCode,
    createEntriesFromContent,
    getOutputForEntries,
    regionCodeMapping,
}
