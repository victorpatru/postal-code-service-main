const puppeteer = require( 'puppeteer' );
const { sliceIntoChunks } = require( '../src/utils' );

const defaultConfig = {
    fields: {
        'postal_code': 0,
    }
}

const scrape = async ( config ) => {
    const { url } = config;
    const browser = await puppeteer.launch( { headless: false } );
    const page = await browser.newPage();

    config.fields = config.fields ?? defaultConfig.fields;

    console.log( `${ config.countryCode }: Downloading data from: ${ url }` );

    await page.goto( url );
    await page.waitForSelector( '.leftdetails .regions' );

    let entries = [];

    try {
        const regionDivs = await page.$$( '.leftdetails .regions div' );
        const chunks = sliceIntoChunks( regionDivs, 10 );

        for ( chunk of chunks ) {
            await Promise.all( chunk.map( async ( regionDiv ) => {
                const [ region, link ] = await regionDiv.$eval( 'a', a => [ a.innerText, a.href ] );
                const regionPage = await browser.newPage();
                await regionPage.goto( link );
                await regionPage.waitForSelector( '.leftdetails .regions' );
                const regionEntriesData = await regionPage.$$eval( '.leftdetails .regions div', divs => divs.map( div => div.innerText ) );

                for ( const entryData of regionEntriesData ) {
                    const data = entryData.split( ' - ' ).map( s => s.trim() );
                    const postal_code = data[0];
                    const entry = {
                        country_code: config.countryCode,
                        admin_name_1: region,
                    };

                    Object.keys( config.fields ).forEach( key => {
                        const index = config.fields[ key ];

                        if ( data[ index ] ) {
                            entry[ key ] = data[ index ];
                        }
                    } );

                    if ( ! entries.some( entry => entry.postal_code === postal_code ) ) {
                        entries.push( entry );
                    }
                }

                regionPage.close();
            } ) );
        }

    } catch ( err ) {
        console.log( err );
        return [];
    }

    await browser.close();

    return entries;
}

module.exports = {
    scrape
}
