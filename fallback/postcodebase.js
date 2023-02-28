const puppeteer = require( 'puppeteer' );

const defaultConfig = {
    fields: {
        'postal_code': 0,
        'admin_name_1': 1,
    }
}

const scrape = async ( config ) => {
    const { url } = config;
    const resultsSelector = '.views-table tbody tr';
    const linkSelector = '.pager-next a';
    const browser = await puppeteer.launch( { headless: false } );
    const page = await browser.newPage();

    config.fields = config.fields ?? defaultConfig.fields;

    let entries = [];

    console.log( `${ config.countryCode }: Downloading data from: ${ url }` );

    await page.goto( url );

    while ( true ) {

        try {
            await page.waitForSelector( resultsSelector );
            const results = await page.$$( resultsSelector );
            const newEntries = await Promise.all( results.map( async result => {
                const entry = { country_code: config.countryCode };
                const data = await result.$$eval( 'td', tds => tds.map( td => td.innerText ) );
                Object.keys( config.fields ).forEach( key => {
                    const index = config.fields[ key ];
                    if ( data[ index ] ) {
                        entry[ key ] = data[ index ];
                    }
                } );
                return entry;
            } ) );

            entries = entries.concat( newEntries );

            await page.waitForSelector( linkSelector, { timeout: 1000 } );
            await new Promise( r => setTimeout( r, 500 ) );
            await page.click( linkSelector );
        } catch ( err ) {
            console.log( err );
            break;
        }
    }

    await browser.close();

    return entries;
}

module.exports = {
    scrape,
}
