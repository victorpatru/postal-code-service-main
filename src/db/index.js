const { Client } = require( 'pg' );

const dbConfig = require( '../config/db.config' );
const { getPartitionName } = require( '../utils' );

const client = new Client( dbConfig );

/**
 * Drop the table.
 */
const dropTable = async () => {
    await client.query(
        `DROP TABLE IF EXISTS "location"."location";`
    );
}

/**
 * Create the table.
 */
const createTable = async () => {
    await client.query(
        `
        CREATE TABLE "location"."location" (
            country_code varchar(2) NOT NULL,
            postal_code varchar(20) NOT NULL,
            municipality varchar(180) NULL,
            admin_name_1 varchar(100) NULL,
            admin_code_1 varchar(20) NULL,
            admin_name_2 varchar(100) NULL,
            admin_code_2 varchar(20) NULL,
            admin_name_3 varchar(100) NULL,
            admin_code_3 varchar(20) NULL,
            latitude numeric NULL,
            longitude numeric NULL,
            accuracy int4 NULL,
            region_code varchar(20) NULL,
            create_date timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
        )
        PARTITION BY LIST (country_code);
        CREATE INDEX location_country_code_postal_code_ix ON ONLY location.location USING btree (country_code, postal_code);
        `
    )
}

/**
 * Create a table partition
 * @param {string} countryCode 
 */
const createPartition = async ( folderName, partition ) => {
    const countryCode = folderName.slice(0, 2);
    const partitionName = await getPartitionName( folderName, partition );
    const query = `CREATE TABLE location.${ partitionName } PARTITION OF location.location FOR VALUES IN ('${ countryCode }');`;
    await client.query( query );
}

/**
 * Drop table partitions
 * @param {string} countryCode
 */
const dropPartition = async ( countryCode, partition ) => {
    const partitionName = await getPartitionName( countryCode, partition );
    const query = `DROP TABLE IF EXISTS "location"."${ partitionName }";`
    await client.query( query );
}

/**
 * Delete all entries for the specified country code.
 * @param {string} countryCode 
 */
const deleteCountryEntries = async ( countryCode ) => {
    await client.query(
        `DELETE FROM "location"."location" WHERE country_code = '${ countryCode }';`
    );
}

/**
 * Format a cell for insertion into the database.
 * @param {*} cell 
 * @returns {*} formatted cell
 */
const formatCell = ( cell ) => {
    if ( cell === null ) {
        return 'NULL';
    }
    if ( typeof cell === 'string' ) {
        return `'${ cell.replace( /'/g, "''" ) }'`;
    }
    return cell;
}

/**
 * Format a row for insertion into the database.
 * @param {array} row 
 * @returns {string} values to be inserted into the database
 */
const getInsertQueryString = ( entries ) => {

    const keys = [
        'country_code', 
        'postal_code', 
        'municipality', 
        'admin_name_1', 
        'admin_code_1', 
        'admin_name_2', 
        'admin_code_2', 
        'admin_name_3', 
        'admin_code_3', 
        'latitude', 
        'longitude', 
        'accuracy', 
        'region_code'
    ]

    const columns = keys.join( ', ' );

    if ( ! entries.length ) {
        return '';
    }

    const values = entries.map( entry => {

        const entryValues = keys.map( key => {
            return formatCell( entry[ key ] );
        } ).join( ', ' );

        return `(${ entryValues })`
    } ).join( ', ' );

    return `INSERT INTO "location"."location"(${ columns }) VALUES ${ values };`;
}

module.exports = {
    client,
    createPartition,
    createTable,
    dropTable,
    dropPartition,
    deleteCountryEntries,
    getInsertQueryString
};
