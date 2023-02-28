const fs = require( 'fs' );
const db = require( '../db' );
const cliProgress = require( 'cli-progress' );

const { addRegionCode } = require( '../entry' );
const { throttledFixEntriesWGoogle } = require( '../lookup' );
const { getConfig, getEntriesFromFile, createFile, getFileContent, sliceIntoChunks } = require( '../utils' );
const { getOutputForEntries } = require( '../entry' );
const { downloadFromGeonames, downloadFromZipCodebase, downloadFromFallback } = require( '../downloader' );
const { logError } = require('../logger');

const downloadCountry = async ( countryCode ) => {
    const config = getConfig();

    if ( ! config.forceFallback ) {
        const result1 = await downloadFromGeonames( countryCode );
        if ( result1.success ) return result1;
        
        const result2 = await downloadFromZipCodebase( countryCode );
        if ( result2.success ) return result2;
    }
        
    return await downloadFromFallback( countryCode )
}

const download = async ( countryCode ) => {
    console.log( `${ countryCode }: Downloading` );
    
    const result = await downloadCountry( countryCode );
    
    if ( result.success ) {
        fs.writeFileSync( `./data/${ countryCode }/source.txt`, result.source );
    }
}

const geocode = async ( countryCode ) => {
    const raw = `./data/${ countryCode }/raw.txt`;
    const geocoded = `./data/${ countryCode }/geocoded.txt`;
    const config = getConfig();
    const source = fs.existsSync( geocoded ) && config.self ? geocoded : raw;
    
    if ( ! fs.existsSync( source ) ) {
        await download( countryCode );
    }
    
    // pretty slow for countries with a lot of entries
    // const entries = getUniqueEntries( await getEntriesFromFile( source ) );
    const entries = await getEntriesFromFile( source );

    console.log( `${ countryCode }: Geocoding` );
    
    await throttledFixEntriesWGoogle( entries, config.forceLookup, config.self );

    if ( config.lookupTwice ) {
        await throttledFixEntriesWGoogle( entries, config.forceLookup, true );
    }

    const output = getOutputForEntries( entries );
    createFile( `./data/${ countryCode }`, `geocoded.txt`, output );
}

const map = async ( countryCode ) => {
    const raw = `./data/${ countryCode }/raw.txt`;
    const geocoded = `./data/${ countryCode }/geocoded.txt`;
    const source = fs.existsSync( geocoded ) ? geocoded : raw;
    
    if ( ! fs.existsSync( source ) ) {
        await geocode( countryCode );
    }
    
    console.log( `${ countryCode }: Mapping` );

    const entries = await getEntriesFromFile( source );
    for ( const entry of entries ) {
        await addRegionCode( entry, countryCode );
    }

    const newOutput = getOutputForEntries( entries );
    createFile( `./data/${ countryCode }`, `processed.txt`, newOutput );
}

const sql = async ( folderName ) => {
    const config = getConfig();
    const processed = `./data/${ folderName }/processed.txt`;
    
    if ( ! fs.existsSync( processed ) ) {
        await map( folderName );
    }

    console.log( `${ folderName }: Creating SQL statements` );

    const entries = await getEntriesFromFile( processed );
    const chunkSize = Math.ceil( entries.length / 100 );
    const chunks = sliceIntoChunks( entries, chunkSize );
    const output = chunks.map( ( chunk, index ) => {
        return db.getInsertQueryString( chunk );
    } ).join( '\n' );

    createFile( `./data/${ folderName }`, `insert.sql`, output );

    if ( config.deploy ) {
        await deploy( folderName );
    }
}

const deploy = async ( folderName ) => {
    const source = `./data/${ folderName }/insert.sql`;
    const config = getConfig();

    if ( ! config.partition ) {
        throw new Error( '--partition is mandatory' );
    }

    if ( ! [ 'a', 'b' ].includes( config.partition ) ) {
        throw new Error( '--partition must be either a or b' );
    }
    
    if ( ! fs.existsSync( source ) ) {
        await sql( folderName );
    }

    const bar1 = new cliProgress.SingleBar( {}, cliProgress.Presets.shades_classic );
    
    console.log( `${ folderName }: Connecting to database` );
    db.client.connect();
    console.log( `${ folderName }: Running SQL statements` );
    
    try {
        console.log( `${ folderName }: Dropping existing partition` );
        await db.dropPartition( folderName, config.partition );
        console.log( `${ folderName }: Creating partition` );
        await db.createPartition( folderName, config.partition );
        const query = await getFileContent( source );
        const lines = query.split( '\n' );
        
        console.log( `${ folderName }: Executing insert statements` );
        bar1.start(lines.length, 0);
        for ( let i = 0; i < lines.length; i++ ) {
            bar1.update(i);
            await db.client.query( lines[i] );
        }
        bar1.update(lines.length);
        bar1.stop();
    } catch ( err ) {
        logError( err );
    }
    
    console.log( `${ folderName }: Disconnecting` );
    db.client.end();
    console.log( `${ folderName }: Done` );
}

const process = async ( countryCode ) => {
    await download( countryCode );
    await geocode( countryCode );
    await map( countryCode );
    await sql( countryCode );

    const config = getConfig();

    if ( config.deploy ) {
        await deploy( countryCode );
    }
}

module.exports = {
    download,
    geocode,
    map,
    sql,
    deploy,
    process,
}
