// MC: has only one postal code (98000) but multiple entries
// BA, GR, RU2 have some values that are too long for the database constraints

const db = require( './db' );
const { getEntriesFromFile } = require('./utils');

(async() => {
    const entries = await getEntriesFromFile( './data/BA/processed.txt' );
    entries.forEach( entry => {
        Object.values( entry ).forEach( value => {
            if ( typeof value === "string" && value.length > 20 ) {
                console.log( entry );
            }
        } )
    } );
    // await db.client.connect();
    // await db.dropTable();
    // await db.createTable();
    // await db.client.end();
})();