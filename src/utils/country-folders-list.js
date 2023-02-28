const fs = require( 'fs' );

const getSubfolders = ( path ) => {
    const paths = fs.readdirSync( path );
    return paths.filter( path => path !== '.DS_Store' );
}

module.exports = getSubfolders( './data' );
