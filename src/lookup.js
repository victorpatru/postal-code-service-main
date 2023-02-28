const { setTimeout } = require( 'timers/promises' );
const fetch = require( 'node-fetch' );

const { logError } = require( './logger' );
const { getConfig, sliceIntoChunks } = require( './utils' );

const { GOOGLE_MAPS_API_KEY } = require( './config/api.config' );

const findComponent = ( results, type ) => {
    
    for ( result of results ) {
        const found = result.address_components.find( c => c.types.includes( type ) );
        
        if ( found ) {
            return found;
        }
    }

    return null;
}

const fillEntryMunicipalityField = ( entry, results ) => {
    if ( ! entry.municipality ) {
        const component = findComponent( results, 'locality' );
        
        if ( component ) {
            entry.municipality = component.long_name;
        }
    }
}

const fillEntryAdminIndex = ( entry, results, index ) => {
    const admin_name = `admin_name_${ index }`;
    const admin_code = `admin_code_${ index }`;
    const componentType = `administrative_area_level_${ index }`;

    if ( ! entry[ admin_code ] && ! entry[ admin_name ] ) {
        const component = findComponent( results, componentType );
        
        if ( component ) {
            entry[ admin_name ] = component.long_name;
            
            if ( component.long_name !== component.short_name && component.short_name.length < 4 ) {
                entry[ admin_code ] = component.short_name;
            }
        }
    }
}

const fillEntryAdminFields = ( entry, results ) => {
    const config = getConfig();

    if ( config.forceLookup ) {
        entry.admin_name_1 = null;
        entry.admin_code_1 = null;
    }

    fillEntryAdminIndex( entry, results, 1 );
    fillEntryAdminIndex( entry, results, 2 );
    fillEntryAdminIndex( entry, results, 3 );
}

const findRegionCode = async ( entry, results ) => {
    const { iso31662 } = await import( 'iso-3166' );

    const component = results.find( result => {
        return result.address_components.find( component => {
            const isAreaLevel1 = component.types.includes( 'administrative_area_level_1' );
            const compare = `${ entry.country_code }-${ component.short_name }`;
            const isRegion = iso31662.find( code => code.code === compare );
            return isAreaLevel1 && isRegion;
        } );
    } );

    if ( component ) {
        return component.short_name;
    }

    return null;
};

const fillEntryLocationFields = ( entry, results ) => {
    
    if ( ! entry.latitude || ! entry.longitude ) {
        const result = results.find( result => result?.geometry?.location );
        
        if ( result ) {
            entry.latitude = result?.geometry?.location?.lat;
            entry.longitude = result?.geometry?.location?.lng;
        }
    }
}

const fillEntryRegionCode = async ( entry, results ) => {

    if ( ! entry.region_code ) {
        const regionCode = await findRegionCode( entry, results );

        if ( regionCode ) {
            entry.region_code = regionCode;
        }
    }
}

const getUrl = async ( entry ) => {
    const { country_code, postal_code, region_code, latitude, longitude } = entry;
    const { iso31661, iso31662 } = await import( 'iso-3166' );
    const apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    const country = iso31661.find( c => c.alpha2 === country_code )?.name ?? country_code;
    const regionISO = iso31662.find( r => r.code === `${ country_code }-${ region_code }` )?.name ?? region_code;
    const region = regionISO ?? entry.municipality;

    if ( ! country ) {
        return null;
    }
    
    if ( latitude && longitude ) {
        return `${ apiUrl }?latlng=${ latitude },${ longitude }&key=${ GOOGLE_MAPS_API_KEY }`;
    }
    
    if ( postal_code ) {
        const region_component = encodeURIComponent( region ? `,${ region }` : ( entry.admin_name_1 ? `,${ entry.admin_name_1 }` : '' ) );
        const country_component = encodeURIComponent( country ? `,${ country }` : '' );
        return `${ apiUrl }?address=${ postal_code }${ region_component }${ country_component }&key=${ GOOGLE_MAPS_API_KEY }`;
    }
    
    return null;
}

const fixEntry = async ( entry ) => {
    const url = await getUrl( entry );

    console.log( url );

    if ( ! url ) {
        return null;
    }

    try {
        const response = await fetch( url );
        const json = await response.json();
        
        if ( ! json.results ) {
            return null;
        }

        const results = json.results.filter( result => {
            const countryComponent = findComponent( [ result ], 'country' );
            return countryComponent && countryComponent.short_name === entry.country_code;
        } );

        if ( ! results ) {
            return null;
        }

        await fillEntryMunicipalityField( entry, results );
        await fillEntryLocationFields( entry, results );
        await fillEntryAdminFields( entry, results );
        await fillEntryRegionCode( entry, results );

        if ( ! entry.latitude || ! entry.longitude ) {
            logError( `Could not find location for entry ${ entry.country_code }: ${ entry.postal_code }` );
        }
    } catch ( err ) {
        logError( err );
        console.log( `Error while fetching ${ url }` );
    }
}

// try to lookup the country code for each entry with the reverse geocoding API from Google
const fixEntriesWGoogle = async ( entries ) => {
    // @todo fetch only unique urls
    await Promise.all( entries.map( fixEntry ) );
    return entries;
}

const throttledFixEntries = async ( entries ) => {
    const chunkSize = 50;
    const delay = 1000;

    const chunks = sliceIntoChunks( entries, chunkSize );

    for ( let i = 0; i < chunks.length; i++ ) {
        await Promise.all( chunks[i].map( fixEntry ) );
        await setTimeout( delay );
    }
}

const throttledFixEntriesWGoogle = async ( entries, forceLookup, secondRun ) => {

    const requiredKeys = [
        'municipality',
        'admin_name_1',
        'admin_code_1',
        'admin_name_2',
        'admin_code_2',
        'admin_name_3',
        'admin_code_3',
    ]
    
    if ( secondRun ) {
        requiredKeys.splice( 0, 3 );
    }

    const candidates = entries.filter( entry => {
        const missingCoords = ! entry.latitude || ! entry.longitude;
        const missingInfo = requiredKeys.every( key => ! entry[ key ] );
        
        return forceLookup || missingCoords || missingInfo;
    } );

    await throttledFixEntries( candidates );
}

module.exports = {
    fixEntry,
    fixEntriesWGoogle,
    throttledFixEntriesWGoogle,
    fillEntryAdminFields,
}
