const puppeteer = require( 'puppeteer' );

const scrape = async ( countryCode, url ) => {
    const resultsSelector = 'table[border="1"] td[rowspan]';
    const browser = await puppeteer.launch( { headless: false } );
    const page = await browser.newPage();

    console.log( `${ countryCode }: Downloading data from: ${ url }` );

    await page.goto( url );

    console.log( 'Waiting for selector' );
    await page.waitForSelector( resultsSelector );
    console.log( 'Waited' );

    let entries = [];

    try {

        const newEntries = await page.evaluate( ( resultsSelector, countryCode ) => {
            const entries = [];
            const regionCells = Array.from( document.querySelectorAll( resultsSelector ) );

            regionCells.forEach( regionCell => {
                const region = regionCell.innerText;
                const firstRow = regionCell.parentElement;
                const municipality = firstRow.children[1].innerText;
                const postalCodes = firstRow.children[2].innerText.split( ',' ).map( code => code.trim() );
                const { rowSpan } = regionCell;

                postalCodes.forEach( code => {
                    entries.push( {
                        country_code: countryCode,
                        postal_code: code,
                        admin_name_1: region,
                        municipality,
                    } );
                } );

                for ( let i = 1; i < rowSpan; i++ ) {
                    const row = firstRow.nextElementSibling;
                    const municipality = row.children[0].innerText;
                    const postalCodes = row.children[1].innerText.split( ',' ).map( code => code.trim() );

                    postalCodes.forEach( code => {
                        entries.push( {
                            country_code: countryCode,
                            postal_code: code,
                            admin_name_1: region,
                            municipality,
                        } );
                    } );
                }
            } );

            return entries;

        }, resultsSelector, countryCode );

        entries = entries.concat( newEntries );

    } catch ( err ) {
        console.log( err );
        return [];
    }

    await browser.close();

    return entries;
}

module.exports = {
    scrape,
}
