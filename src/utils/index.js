const fs = require( 'fs' );
const readline = require("readline");
const csv = require('fast-csv');



const countryFoldersList = require( './country-folders-list' );

const { createEntriesFromContent } = require( '../entry' );
const { getConfig } = require( './get-config' );

const getEntriesFromFile = async ( filePath ) => {
    const content = await getFileContent( filePath );
    return createEntriesFromContent( content );
}

const getEntriesForCountries = async ( countryCodes ) => {
    let entries = [];

    for ( countryCode of countryCodes ) {
        try {
            const countryEntries = await getCountryEntries( countryCode );
            entries = entries.concat( countryEntries );
        } catch ( err ) {
            log( err );
        }
    }

    return entries;
}

const getFileContent = ( filepath ) => {
    return fs.readFileSync( filepath, { encoding: 'utf8' } );
}

const getFileContentStream = async (filepath, countryCode) => {
    const data = []

    return new Promise( resolve => {

        fs.createReadStream(filepath, { encoding: 'utf8' })
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => {
           data.push({
            country_code: countryCode,
            municipality: row['Ward'],
            postal_code: row['Postcode'],
            admin_name_1: row['District'],
            admin_code_1: '',
            admin_name_2: row['County'],
            admin_code_2: '',
            latitude: row['Latitude'],
            longitude: row['Longitude'],
            accuracy: 6,
            region_code: ''
           })
        })
        .on('end', () => resolve(data));
    })

}

const createFile = ( directory, filename, output ) => {
    const config = getConfig();
    const filepath = `${ directory }/${ filename }`;
    
    fs.mkdirSync( directory, { recursive: true } );

    if ( ! fs.existsSync( filepath ) || config.force ) {
        fs.writeFileSync( filepath, output );
    } else {
        console.log( `File ${ filepath } already exists. Use --force to overwrite.` );
    }
}

const getUniqueEntries = ( entries ) => {
    return entries.filter( ( entry, index, arr ) => {
        const foundIndex = arr.findIndex( ( e ) => {
            const keys = Object.keys( entry );
            return keys.every( key => e[ key ] === entry[ key ] );
        } );
        return foundIndex === index;
    } );
}

const getSafeName = async ( sourceFolderName ) => {
    const countryName = await getCountryName( sourceFolderName );

    if ( ! countryName ) {
        throw new Error( `Country ${ sourceFolderName } not found.` );
    }

    return countryName.match( /[a-zA-Z]+/g ).map( word => word.toLowerCase() ).join( '_' );
}

const getPartitionName = async ( sourceFolderName, partition ) => {
    const name = await getSafeName( sourceFolderName );
    return `location_partition_${ name }_${ partition }`;
}

const sliceIntoChunks = ( arr, chunkSize ) => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

const getCountryName = async ( folderName ) => {
    const { iso31661 } = await import( 'iso-3166' );
    const countryCode = folderName.slice(0, 2);

    const overridesMap = {
        'MD': 'Moldova',
        'XK': 'Kosovo',
        'RU': 'Russia',
        'GB': 'United Kingdom',
        'VA': 'Vatican City',
    };

    if ( overridesMap[ countryCode ] ) {
        return overridesMap[ countryCode ];
    }

    const countryData = iso31661.find( code => code.alpha2 === countryCode );
    return countryData?.name;
}

module.exports = {
    createFile,
    getCountryName,
    getFileContent,
    getFileContentStream,
    getConfig,
    getEntriesFromFile,
    getEntriesForCountries,
    getUniqueEntries,
    getSafeName,
    getPartitionName,
    countryFoldersList,
    sliceIntoChunks,
}