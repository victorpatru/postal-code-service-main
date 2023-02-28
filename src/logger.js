const fs = require( 'fs' );

const log = ( message ) => {
    const timestamp = new Date();

    fs.appendFileSync( 'log.txt', `${ timestamp.toLocaleString( 'en-US' ) }: ${ message } \n`, ( err ) => {
        // console.log( err );
    } );
}

const logError = ( err ) => {
    console.log( err.toString().split( '\n' )[0] );
}

const printSuccess = ( message ) => {
    console.log( `\x1b[32m${ message }\x1b[37m` );
}

const printError = ( message ) => {
    console.log( `\x1b[31m${ message }\x1b[37m` );
}

const print = ( message ) => {
    console.log( `\x1b[37m${ message }` );
}

module.exports = {
    log,
    logError,
    print,
    printSuccess,
    printError
};
