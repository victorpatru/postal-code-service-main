const downloadFromGeonames = require( './geonames' );
const downloadFromZipCodebase = require( './zipcodebase' );
const downloadFromFallback = require( './fallback' );

module.exports = {
    downloadFromGeonames,
    downloadFromZipCodebase,
    downloadFromFallback
}
