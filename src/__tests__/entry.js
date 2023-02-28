const { createEntriesFromContent } = require( '../entry' );
const { getInsertQueryString } = require( '../db' );

test( 'Given a correctly formatted string, create well formatted entities', async () => {
    const content = `
    AT	7000	Kleinhöflein im Burgenland	Burgenland	01	Eisenstadt Stadt	101	Eisenstadt	10101	47.8415	16.5041	4
    BE	2000	Antwerpen	Vlaanderen	VLG	Anvers	VAN	Antwerpen	11	51.2199	4.4035	4
    HR	43000	Stare Plavnice	Bjelovarsko-Bilogorska	01			Bjelovar		45.9	16.8167	4`;
    const entries = await createEntriesFromContent( content );
    
    expect( entries ).toEqual( [ {
        'country_code': 'AT',
        'postal_code': '7000',
        'municipality': 'Kleinhöflein im Burgenland',
        'admin_name_1': 'Burgenland',
        'admin_code_1': '01',
        'admin_name_2': 'Eisenstadt Stadt',
        'admin_code_2': '101',
        'admin_name_3': 'Eisenstadt',
        'admin_code_3': '10101',
        'latitude': 47.8415,
        'longitude': 16.5041,
        'accuracy': 4,
        'region_code': null,
    }, {
        'country_code': 'BE',
        'postal_code': '2000',
        'municipality': 'Antwerpen',
        'admin_name_1': 'Vlaanderen',
        'admin_code_1': 'VLG',
        'admin_name_2': 'Anvers',
        'admin_code_2': 'VAN',
        'admin_name_3': 'Antwerpen',
        'admin_code_3': '11',
        'latitude': 51.2199,
        'longitude': 4.4035,
        'accuracy': 4,
        'region_code': null,
    }, {
        'country_code': 'HR',
        'postal_code': '43000',
        'municipality': 'Stare Plavnice',
        'admin_name_1': 'Bjelovarsko-Bilogorska',
        'admin_code_1': '01',
        'admin_name_2': null,
        'admin_code_2': null,
        'admin_name_3': 'Bjelovar',
        'admin_code_3': null,
        'latitude': 45.9,
        'longitude': 16.8167,
        'accuracy': 4,
        'region_code': null,
    } ] );
} );

test( 'Given a string with missing values, replace those with null', async () => {
    const content = 'AT	7000			01					47.8415	16.5041	4';
    const entries = await createEntriesFromContent( content );
    
    expect( entries ).toEqual( [ {
        'country_code': 'AT',
        'postal_code': '7000',
        'municipality': null,
        'admin_name_1': null,
        'admin_code_1': '01',
        'admin_name_2': null,
        'admin_code_2': null,
        'admin_name_3': null,
        'admin_code_3': null,
        'latitude': 47.8415,
        'longitude': 16.5041,
        'accuracy': 4,
        'region_code': null,
    } ] );
} );

test( 'Given a string with missing values, replace those with null', async () => {
    const content = 'AT	1080	Wien, Josefstadt	Wien	09	Politischer Bezirk Wien (Stadt)	900	Gemeindebezirk Josefstadt	908';
    const entries = await createEntriesFromContent( content );
    
    expect( entries ).toEqual( [ {
        'country_code': 'AT',
        'postal_code': '1080',
        'municipality': 'Wien, Josefstadt',
        'admin_name_1': 'Wien',
        'admin_code_1': '09',
        'admin_name_2': 'Politischer Bezirk Wien (Stadt)',
        'admin_code_2': '900',
        'admin_name_3': 'Gemeindebezirk Josefstadt',
        'admin_code_3': '908',
        'latitude': null,
        'longitude': null,
        'accuracy': null,
        'region_code': null,
    } ] ); 
} );

test( 'Given an array of entry objects, create a SQL query string to insert it into the database', async () => {
    const entries = [ {
        'country_code': 'AT',
        'postal_code': '7000',
        'municipality': 'Kleinhöflein im Burgenland',
        'admin_name_1': 'Burgenland',
        'admin_code_1': '01',
        'admin_name_2': 'Eisenstadt Stadt',
        'admin_code_2': '101',
        'admin_name_3': 'Eisenstadt',
        'admin_code_3': '10101',
        'latitude': 47.8415,
        'longitude': 16.5041,
        'accuracy': 4,
        'region_code': '01',
    }, {
        'country_code': 'BE',
        'postal_code': '2000',
        'municipality': 'Antwerpen',
        'admin_name_1': 'Vlaanderen',
        'admin_code_1': 'VLG',
        'admin_name_2': 'Anvers',
        'admin_code_2': 'VAN',
        'admin_name_3': 'Antwerpen',
        'admin_code_3': '11',
        'latitude': 51.2199,
        'longitude': 4.4035,
        'accuracy': 4,
        'region_code': 'VLG',
    }, {
        'country_code': 'HR',
        'postal_code': '43000',
        'municipality': 'Stare Plavnice',
        'admin_name_1': 'Bjelovarsko-Bilogorska',
        'admin_code_1': '01',
        'admin_name_2': null,
        'admin_code_2': null,
        'admin_name_3': 'Bjelovar',
        'admin_code_3': null,
        'latitude': 45.9,
        'longitude': 16.8167,
        'accuracy': 4,
        'region_code': '07',
    } ];

    const query = getInsertQueryString( entries );

    expect( query ).toBe( `INSERT INTO "location"."location"(country_code, postal_code, municipality, admin_name_1, admin_code_1, admin_name_2, admin_code_2, admin_name_3, admin_code_3, latitude, longitude, accuracy, region_code) VALUES ('AT', '7000', 'Kleinhöflein im Burgenland', 'Burgenland', '01', 'Eisenstadt Stadt', '101', 'Eisenstadt', '10101', 47.8415, 16.5041, 4, '01'), ('BE', '2000', 'Antwerpen', 'Vlaanderen', 'VLG', 'Anvers', 'VAN', 'Antwerpen', '11', 51.2199, 4.4035, 4, 'VLG'), ('HR', '43000', 'Stare Plavnice', 'Bjelovarsko-Bilogorska', '01', NULL, NULL, 'Bjelovar', NULL, 45.9, 16.8167, 4, '07');` );
} );

test( 'Given an array with only one entry object, create a SQL query string to insert it into the database', async () => {

    const entries = [
        {
            'country_code': 'BE',
            'postal_code': '2000',
            'municipality': 'Antwerpen',
            'admin_name_1': 'Vlaanderen',
            'admin_code_1': 'VLG',
            'admin_name_2': 'Anvers',
            'admin_code_2': 'VAN',
            'admin_name_3': 'Antwerpen',
            'admin_code_3': '11',
            'latitude': 51.2199,
            'longitude': 4.4035,
            'accuracy': 4,
            'region_code': 'VLG',
        }
    ]

    const query = getInsertQueryString( entries );

    expect( query ).toBe( `INSERT INTO "location"."location"(country_code, postal_code, municipality, admin_name_1, admin_code_1, admin_name_2, admin_code_2, admin_name_3, admin_code_3, latitude, longitude, accuracy, region_code) VALUES ('BE', '2000', 'Antwerpen', 'Vlaanderen', 'VLG', 'Anvers', 'VAN', 'Antwerpen', '11', 51.2199, 4.4035, 4, 'VLG');` );

} );

test( 'Given an array with only one entry object, apostrophes are escaped properly in the returned query', async () => {

    const entries = [
        {
            'country_code': 'BE',
            'postal_code': '2000',
            'municipality': `Sint-Job-In-'T-Goor`,
            'admin_name_1': 'Vlaanderen',
            'admin_code_1': 'VLG',
            'admin_name_2': 'Anvers',
            'admin_code_2': 'VAN',
            'admin_name_3': 'Antwerpen',
            'admin_code_3': '11',
            'latitude': 51.2991,
            'longitude': 4.5729,
            'accuracy': 4,
            'region_code': 'VLG',
        }
    ]

    const query = getInsertQueryString( entries );

    expect( query ).toBe( `INSERT INTO "location"."location"(country_code, postal_code, municipality, admin_name_1, admin_code_1, admin_name_2, admin_code_2, admin_name_3, admin_code_3, latitude, longitude, accuracy, region_code) VALUES ('BE', '2000', 'Sint-Job-In-''T-Goor', 'Vlaanderen', 'VLG', 'Anvers', 'VAN', 'Antwerpen', '11', 51.2991, 4.5729, 4, 'VLG');` );

} );
