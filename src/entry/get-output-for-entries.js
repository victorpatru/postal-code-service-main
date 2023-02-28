const getOutputForEntries = ( entries ) => {

    return entries.map( entry => {
        return [
            entry.country_code,
            entry.postal_code,
            entry.municipality,
            entry.admin_name_1,
            entry.admin_code_1,
            entry.admin_name_2,
            entry.admin_code_2,
            entry.admin_name_3,
            entry.admin_code_3,
            entry.latitude,
            entry.longitude,
            entry.accuracy,
            entry.region_code
        ].join( '\t' );
    } ).join( '\n' );
}

module.exports = getOutputForEntries;
