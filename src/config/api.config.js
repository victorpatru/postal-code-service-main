if ( process.env.NODE_ENV !== 'production' ) {
    require( 'dotenv' ).config();
}

module.exports = {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    ZIPCODEBASE_API_KEY: process.env.ZIPCODEBASE_API_KEY,
}
