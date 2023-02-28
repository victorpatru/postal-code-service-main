const { getFileContent, createFile, countryFoldersList, getCountryName } = require( '../utils' );

const getTableMarkdown = async () => {
    const { iso31661 } = await import( 'iso-3166' );
    const fields = [ 'Country', 'Code', 'Data Source' ];

    let output = ``;

    output += `| ${ fields.join( ' | ' ) } |\r\n`;
    output += `| ${ fields.map( () => '---' ).join( ' | ' ) } |\r\n`;

    for ( folderName of countryFoldersList ) {
        const countryName = await getCountryName( folderName );
        const sources = await getFileContent( `./data/${ folderName }/source.txt` )
        output += `| ${ countryName } | ${ folderName } | ${ sources } |\r\n`;
    }

    return output;
}

(async () => {
    const intro = await getFileContent( './src/scripts/readme/INTRO.md' );
    const sourcesTable = await getTableMarkdown();
    const output = `${ intro }
# Data Sources
${ sourcesTable }
    `;

    await createFile( `.`, `README.md`, output );
})();