const pbcopy = ( data ) => {
    var proc = require( 'child_process' ).spawn( 'pbcopy' ); 
    proc.stdin.write( data ); proc.stdin.end();
}

const regionCodeMapping = {
    // AD => Andorra
    'AD': ( entry ) => {
        return entry.admin_code_1;
    },
    // https://en.wikipedia.org/wiki/ISO_3166-2:AT
    // https://www.iso.org/obp/ui/#iso:code:3166:BE - stated as AT-1, AT-2, etc.
    // OK
    'AT': ( entry ) => {
        return entry.admin_code_1.replace(/^0+/, ''); // remove leading zeros
    },
    // https://en.wikipedia.org/wiki/ISO_3166-2:BE
    // https://www.iso.org/obp/ui/#iso:code:3166:BE - stated as BE-BRU, BE-VLG, etc.
    // 3 letter code: BRU, VLG, WAL
    // OK
    'BE': ( entry ) => {
        return entry.admin_code_1;
    },
    // https://en.wikipedia.org/wiki/ISO_3166-2:BG
    // https://www.iso.org/obp/ui/#iso:code:3166:BG - stated as BG-01, BG-02, etc.
    // OK
    'BG': ( entry ) => {

        const map = {
            'BLG': '01', // Благоевград
            'BGS': '02', // Бургас
            'VAR': '03', // Варна
            'VTR': '04', // Велико Търново
            'VID': '05', // Видин
            'VRC': '06', // Враца
            'GAB': '07', // Габрово
            'DOB': '08', // Добрич
            'KRZ': '09', // Кърджали
            'KNL': '10', // Кюстендил
            'LOV': '11', // Ловеч
            'MON': '12', // Монтана
            'PAZ': '13', // Пазарджик
            'PER': '14', // Перник
            'PVN': '15', // Плевен
            'PDV': '16', // Пловдив
            'RAZ': '17', // Разград
            'RSE': '18', // Русе
            'SLS': '19', // Силистра
            'SLV': '20', // Сливен
            'SML': '21', // Смолян
            'SOF': '22', // Sofia / София
            'SFO': '23', // Sofia (stolica) / Софийска област
            'SZR': '24', // Стара Загора
            'TGV': '25', // Търговище
            'HKV': '26', // Хасково
            'SHU': '27', // Шумен
            'JAM': '28', // Ямбол
        };

        if ( map[ entry.admin_code_1 ] ) {
            return map[ entry.admin_code_1 ];
        } else {
            throw new Error( `Unknown region code: ${ entry.admin_code_1 }` );
        }
    },
    'BY': ( entry ) => {

        const map = {
            'Brest': 'BR',
            'Gomel': 'HO',
            'Grodno': 'HR',
            'Minsk': 'MI',
            'Vitebsk': 'VI',
            'Moghilev': 'MA',

            // Probably a typo in the data
            'Rodno': 'HR',
        }

        if ( [ 'Минск', 'Minsk' ].includes( entry.municipality ) ) {
            return 'HM';
        }

        const admin_name = entry.admin_name_1 ?? entry.admin_name_2;

        if ( map[ admin_name ] ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region code: ${ admin_name }` );
        }
    },
    // https://en.wikipedia.org/wiki/ISO_3166-2:CY
    // https://www.iso.org/obp/ui/#iso:code:3166:CY - stated as CY-01, CY-02, etc.
    // OK
    'CY': ( entry ) => {

        const map = {
            'Lefkosia': '01',
            'Lemesos': '02',
            'Larnaka': '03',
            'Ammochostos': '04',
            'Pafos': '05',
            'Keryneia': '06',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'CZ': ( entry ) => {
        const map = {
            'Hlavní město Praha': '10',
            'Středočeský kraj': '20',
            'Jihočeský kraj': '31',
            'Plzeňský kraj': '32',
            'Karlovarský kraj': '41',
            'Ústecký kraj': '42',
            'Liberecký kraj': '51',
            'Královéhradecký kraj': '52',
            'Pardubický kraj': '53',
            'Kraj Vysočina': '63',
            'Jihomoravský kraj': '64',
            'Olomoucký kraj': '71',
            'Zlínský kraj': '72',
            'Moravskoslezský kraj': '80',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    // https://en.wikipedia.org/wiki/ISO_3166-2:DE
    // https://www.iso.org/obp/ui/#iso:code:3166:DE - stated as DE-BW, DE-BY, etc.
    // OK
    'DE': ( entry ) => {
        return entry.admin_code_1;
    },
    'DK': ( entry ) => {

        const map = {
            'Region Hovedstaden': '84',
            'Capital Region': '84',
            'Region Midtjylland': '82',
            'Central Jutland': '82',
            'North Denmark': '81',
            'Region Nordjylland': '81',
            'Zealand': '85',
            'Region Syddanmark': '83',
            'South Denmark': '83',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'DZ': ( entry ) => {
        return entry.admin_code_1;
    },
    'EE': ( entry ) => {

        const map = {
            'Harju maakond': '37',
            'Hiiu maakond': '39',
            'Ida-Viru maakond': '45',
            'Jõgeva maakond': '50',
            'Järva maakond': '52',
            'Lääne maakond': '56',
            'Lääne-Viru maakond': '60',
            'Põlva maakond': '64',
            'Pärnu maakond': '68',
            'Rapla maakond': '71',
            'Saare maakond': '74',
            'Tartu maakond': '79',
            'Valga maakond': '81',
            'Viljandi maakond': '84',
            'Võru maakond': '87',
        };

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'ES': ( entry ) => {
        return entry.admin_code_1;
    },
    'FI': ( entry ) => {

        const map = {
            // FI-01 - Aland (autonomous region) is missing from entries
            'South Karelia': '02', // Etelä-Karjala
            'South Ostrobothnia Region': '03', // Etelä-Pohjanmaa
            'Southern Savonia': '04', // Etelä-Savo
            'Kainuu': '05',
            'Kanta-Häme': '06',
            'Central Ostrobothnia Region': '07', // Keski-Pohjanmaa
            'Central Finland Region': '08', // Keski-Suomi
            'Kymenlaakso': '09',
            'Lapland': '10', // Lappi
            'Pirkanmaa': '11',
            'Ostrobothnia Region': '12', //	Pohjanmaa
            'North Karelia': '13', // Pohjois-Karjala
            'North Ostrobothnia Region': '14', // Pohjois-Pohjanmaa
            'Northern Savo': '15', // Pohjois-Savo
            'Päijänne Tavastia': '16', // Päijät-Häme
            'Satakunta': '17', // Satakunta
            'Uusimaa': '18', // Nyland
            'Southwest Finland': '19', // Varsinais-Suomi
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'FR': ( entry ) => {

        const map = {
            'Auvergne-Rhône-Alpes': 'ARA',
            'Île-de-France': 'IDF',
            'Centre-Val de Loire': 'CVL',
            'Bourgogne-Franche-Comté': 'BFC',
            'Normandie': 'NOR',
            'Hauts-de-France': 'HDF',
            'Mondescourt': 'HDF',
            'Grand Est': 'GES',
            'Pays de la Loire': 'PDL',
            'Bretagne': 'BRE',
            'Nouvelle-Aquitaine': 'NAQ',
            'Occitanie': 'OCC',
            'Provence-Alpes-Côte d\'Azur': 'PAC',
            'Corse': '20R',
            // https://en.wikipedia.org/wiki/ISO_3166-2:FR
            'Clipperton Island': 'CP',
        }

        const admin_name = entry.admin_name_1 ?? entry.municipality;


        /**
         * Couple entries don't have admin_name_1
         *
         * FR	60400	Mondescourt							49.5982	3.1129	5
         * FR	98799	Clipperton Island							10.2922	-109.2072	5
         */
        // if ( admin_name === null ) {
        //     return null;
        // }

        if ( map[ admin_name ] ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    // https://en.wikipedia.org/wiki/ISO_3166-2:HR
    // https://www.iso.org/obp/ui/#iso:code:3166:HR - stated as HR-01, HR-02, etc.
    // OK
    'HR': ( entry ) => {

        const map = {
            'Zagrebačka': '01',
            'Krapinsko-Zagorska': '02',
            'Sisačko-Moslavačka': '03',
            'Karlovačka': '04',
            'Varaždinska': '05',
            'Koprivničko-Križevačka': '06',
            'Bjelovarsko-Bilogorska': '07',
            'Primorsko-Goranska': '08',
            'Ličko-Senjska': '09',
            'Virovitičko-Podravska': '10',
            'Požeško-Slavonska': '11',
            'Brodsko-Posavska': '12',
            'Zadarska': '13',
            'Osječko-Baranjska': '14',
            'Šibensko-Kninska': '15',
            'Vukovarsko-Srijemska': '16',
            'Splitsko-Dalmatinska': '17',
            'Istarska': '18',
            'Dubrovačko-Neretvanska': '19',
            'Međimurska': '20',
            'Grad Zagreb': '21',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'HU': ( entry ) => {
        const prioritiseCity = true;

        const map = {
            'Békéscsaba': 'BC',
            'Debrecen': 'DE',
            'Dunaújváros': 'DU',
            'Eger': 'EG',
            'Érd': 'ER',
            'Győr': 'GY',
            'Hódmezővásárhely': 'HV',
            'Kaposvár': 'KV',
            'Kecskemét': 'KM',
            'Miskolc': 'MI',
            'Nagykanizsa': 'NK',
            'Nyíregyháza': 'NY',
            'Pécs': 'PS',
            'Salgótarján': 'ST',
            'Sopron': 'SN',
            'Szeged': 'SD',
            'Székesfehérvár': 'SF',
            'Szekszárd': 'SS',
            'Szolnok': 'SK',
            'Szombathely': 'SH',
            'Tatabánya': 'TB',
            'Veszprém': 'VM',
            'Zalaegerszeg': 'ZE',
        }

        if ( prioritiseCity && map[ entry.municipality ] ) {
            return map[ entry.municipality ];
        }

        return entry.admin_code_1;
    },
    'IE': ( entry ) => {
        return entry.admin_code_1;
    },
    'GB': ( entry ) => {
         /* How to Map: If you can't find the code in the County Column go for the District Column */

    // County name to code
    const map = {
        Cambridgeshire: "CAM",
        Cumbria: "CMA",
        Derbyshire: "DBY",
        Devon: "DEV",
        Dorset: "DOR",
        "East Sussex": "ESX",
        Essex: "ESS",
        Gloucestershire: "GLS",
        Hampshire: "HAM",
        Hertfordshire: "HRT",
        Kent: "KEN",
        Lancashire: "LAN",
        Leicestershire: "LEC",
        Lincolnshire: "LIN",
        Norfolk: "NFK",
        "North Yorkshire": "NYK",
        Nottinghamshire: "NTT",
        Oxfordshire: "OXF",
        Somerset: "SOM",
        Staffordshire: "STS",
        Suffolk: "SFK",
        Surrey: "SRY",
        Warwickshire: "WAR",
        "West Sussex": "WSX",
        Worcestershire: "WOR",
        "City of London": "LND",
        "Barking and Dagenham": "BDG",
        Barnet: "BNE",
        Bexley: "BEX",
        Brent: "BEN",
        Bromley: "BRY",
        Camden: "CMD",
        Croydon: "CRY",
        Ealing: "EAL",
        Enfield: "ENF",
        Greenwich: "GRE",
        Hackney: "HCK",
        "Hammersmith and Fulham": "HMF",
        Haringey: "HRY",
        Harrow: "HRW",
        Havering: "HAV",
        Hillingdon: "HIL",
        Hounslow: "HNS",
        Islington: "ISL",
        "Kensington and Chelsea": "KEC",
        "Kingston upon Thames": "KTT",
        Lambeth: "LBH",
        Lewisham: "LEW",
        Merton: "MRT",
        Newham: "NWM",
        Redbridge: "RBD",
        "Richmond upon Thames": "RIC",
        Southwark: "SWK",
        Sutton: "STN",
        "Tower Hamlets": "TWH",
        "Waltham Forest": "WFT",
        Wandsworth: "WND",
        Westminster: "WSM",
        Barnsley: "BNS",
        Birmingham: "BIR",
        Bolton: "BOL",
        Bradford: "BRD",
        Bury: "BUR",
        Calderdale: "CLD",
        Coventry: "COV",
        Doncaster: "DNC",
        Dudley: "DUD",
        Gateshead: "GAT",
        Kirklees: "KIR",
        Knowsley: "KWL",
        Leeds: "LDS",
        Liverpool: "LIV",
        Manchester: "MAN",
        "Newcastle upon Tyne": "NET",
        "North Tyneside": "NTY",
        Oldham: "OLD",
        Rochdale: "RCH",
        Rotherham: "ROT",
        "St. Helends": "SHN",
        Salford: "SLF",
        Sandwell: "SAW",
        Sefton: "SFT",
        Sheffield: "SHF",
        Solihull: "SOL",
        "South Tyneside": "STY",
        Stockport: "SKP",
        Sunderland: "SND",
        Tameside: "TAM",
        Trafford: "TRF",
        Wakefield: "WKF",
        Walsall: "WLL",
        Wigan: "WGN",
        Wirral: "WRL",
        Wolverhampton: "WLV",
        "Bath and North East Somerset": "BAS",
        Bedford: "BDF",
        "Blackburn with Barwen": "BBD",
        Blackpool: "BPL",
        "Bournemouth, Christchurch and Poole": "BCP",
        "Bracknell Forest": "BRC",
        "Brighton and Hove": "BNH",
        "Bristol, City of": "BST",
        Buckinghamshire: "BKM",
        "Central Bedfordshire": "CBF",
        "Cheshire East": "CHE",
        "Cheshire West and Chester": "CHW",
        Cornwall: "CON",
        Darlington: "DAL",
        Derby: "DER",
        "County Durham": "DUR",
        "East Riding of Yorkshire": "ERY",
        Halton: "HAL",
        Hartlepool: "HPL",
        Herefordshire: "HEF",
        "Isle of Wight": "IOW",
        "Isles of Scilly": "IOS",
        "Kingston upon Hull": "KHL",
        Leicester: "LCE",
        Luton: "LUT",
        Medway: "MDW",
        Middlesbrough: "MDB",
        "Milton Keynes": "MIK",
        "North East Lincolnshire": "NEL",
        "North Lincolnshire": "NLN",
        "North Northamptonshire": "NNH",
        "North Somerset": "NSM",
        Northumberland: "NBL",
        Nottingham: "NGM",
        Peterborough: "PTE",
        Plymouth: "PLY",
        Portsmouth: "POR",
        Reading: "RDG",
        "Redcar and Cleveland": "RCC",
        Rutland: "RUT",
        Shropshire: "SHR",
        Slough: "SLG",
        "South Gloucestershire": "SGC",
        Southampton: "STH",
        "Southend-on-Sea": "SOS",
        "Stockton-on-Tees": "STT",
        "Stoke-on-Trent": "STE",
        Swindon: "SWD",
        "Telford and Wrekin": "TFW",
        Thurrock: "THR",
        Torbay: "TOB",
        Warrington: "WRT",
        "West Berkshire": "WBK",
        "West Northamptonshire": "WNH",
        Wiltshire: "WIL",
        "Windsor and Maidenhead": "WNM",
        Wokingham: "WOK",
        York: "YOR",
        "Antrim and Newtownabbey": "ANN",
        "Ards and North Down": "AND",
        "Armagh City, Banbridge and Craigavon": "ABC",
        "Belfast City": "BFS",
        "Causeway Coast and Glens": "CCG",
        "Derry and Strabane": "DRS",
        "Fermanagh and Omagh": "FMO",
        "Lisburn and Castlereagh": "LBC",
        "Mid and East Antrim": "MEA",
        "Mid-Ulster": "MUL",
        "Newry, Mourne and Down": "NMD",
        "Aberdeen City": "ABE",
        Aberdeenshire: "ABD",
        Angus: "ANS",
        "Argyll and Bute": "AGB",
        Clackmannanshire: "CLK",
        "Dumbfries and Galloway": "DGY",
        "Dundee City": "DND",
        "East Ayrshire": "EAY",
        "East Dunbartonshire": "EDU",
        "East Lothian": "ELN",
        "East Renfrewshire": "ERW",
        "Edinburgh, City of": "EDH",
        "Eilean Siar": "ELS",
        Falkirk: "FAL",
        Fife: "FIF",
        "Glasgow City": "GLG",
        Highland: "HLD",
        Inverclyde: "IVC",
        Midlothian: "MLN",
        Moray: "MRY",
        "North Ayrshire": "NAY",
        "North Lanarkshire": "NLK",
        "Orkney Islands": "ORK",
        "Perth and Kinross": "PKN",
        Renfrewshire: "RFW",
        "Scottish Borders": "SCB",
        "Shetland Islands": "ZET",
        "South Ayrshire": "SAY",
        "South Lanarkshire": "SLK",
        Stirling: "STG",
        "West Dunbartonshire": "WDU",
        "West Lothian": "WLN",
        "Blaenau Gwent": "BGW",
        Bridgend: "BGE",
        Caerphilly: "CAY",
        Cardiff: "CRF",
        Carmarthenshire: "CMN",
        Ceredigion: "CGN",
        Conwy: "CWY",
        Denbighshire: "DEN",
        Flintshire: "FLN",
        Gwynedd: "GWN",
        "Isle of Anglesey": "AGY",
        "Merthyr Tydfil": "MTY",
        Monmouthshire: "MON",
        "Neath Port Talbot": "NTL",
        Newport: "NWP",
        Pembrokeshire: "PEM",
        Powys: "POW",
        "Rhondda Cynon Taff": "RCT",
        Swansea: "SWA",
        Torfaen: "TOF",
        "Vale of Glamorgan, The": "VGL",
        Wrexham: "WRX",
        null: ''
      };
  
  
      // Cases where we want to use District Name to get the Code
      // If one of the following counties appears in our mapping we want to be using the District Column instead
      const englandDistrict = ["Bedfordshire", "Berkshire", "Bristol", "Greater London", "Greater Manchester", "Merseyside", "Northamptonshire", "South Yorkshire", "Tyne and Wear", "West Midlands", "West Yorkshire", "Cheshire"]
  
      // Create another map for Greater London Region
      if (map[entry.admin_name_2]) {
        // Add a case if the admin_name_1 is equal to Greater London => use the second map
        return map[entry.admin_name_2];
      } if (englandDistrict.includes(entry.admin_name_2)) {
        return map[entry.admin_name_1]
      } if (entry.admin_name_1 === null || entry.admin_name_2 === null) {
        return ''
      }
        else {
        throw new Error(`Unknown region: ${entry.admin_name_2}`);
      }
  
    },
    'IT': ( entry ) => {

        const map = {
            'Abruzzi': '65',
            'Basilicata': '77',
            'Calabria': '78',
            'Campania': '72',
            'Emilia-Romagna': '45',
            'Lazio': '62',
            'Liguria': '42',
            'Lombardia': '25',
            'Marche': '57',
            'Molise': '67',
            'Piemonte': '21',
            'Puglia': '75',
            'Toscana': '52',
            'Umbria': '55',
            'Veneto': '34',
            // Autonomous regions
            'Friuli-Venezia Giulia': '36',
            'Sardegna': '88',
            'Sicilia': '82',
            'Trentino-Alto Adige': '32',
            'Valle D\'Aosta': '23',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'LI': ( entry ) => {
        const map = {
            'Balzers': '01',
            'Eschen': '02',
            'Gamprin': '03',
            'Mauren': '04',
            'Planken': '05',
            'Ruggell': '06',
            'Schaan': '07',
            'Schellenberg': '08',
            'Triesen': '09',
            'Triesenberg': '10',
            'Vaduz': '11',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'LT': ( entry ) => {
        const map = {
            'Alytus County': 'AL',
            'Kaunas County': 'KU',
            'Klaipėda County': 'KL',
            'Marijampolė County': 'MR',
            'Panevėžys': 'PN',
            'Šiauliai County': 'SA',
            'Tauragė County': 'TA',
            'Telšių apskritis': 'TE',
            'Utena County': 'UT',
            'Vilniaus apskritis': 'VL',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'LU': ( entry ) => {
        return entry.admin_code_1;
    },
    'LV': ( entry ) => {
        const map = {
            'Daugavpils': 'DGV',
            'Jelgava': 'JEL',
            'Jurmala': 'JUR',
            'Liepaja': 'LPX',
            'Rezekne': 'REZ',
            'Riga': 'RIX',
            'Ventspils': 'VEN',
            'Aizkraukles nov.': '002',
            'Alūksnes nov.': '007',
            'Balvu nov.': '015',
            'Bauskas nov.': '016',
            'Cēsu nov.': '022',
            'Dobeles nov.': '026',
            'Gulbenes nov.': '033',
            'Jelgavas nov.': '041',
            'Jēkabpils nov.': '042',
            'Krāslavas nov.': '047',
            'Kuldīgas nov.': '050',
            'Limbažu nov.': '054',
            'Ludzas nov.': '058',
            'Madonas nov.': '059',
            'Ogres nov.': '067',
            'Preiļu nov.': '073',
            'Rēzeknes nov.': '077',
            'Saldus nov.': '088',
            'Talsu nov.': '097',
            'Tukuma nov.': '099',
            'Valkas nov.': '101',
            'Valmieras nov.': '113',
            'Valmiera': 'VMR', // @todo: on Wikipedia, on 25-11-2021 VMR was deleted should be 113 like Valmieras nov.?
            'Ventspils nov.': '106',
            'Ādažu nov.': '011',
            'Ķekavas nov.': '052',
            'Līvānu nov.': '056',
            'Mārupes nov.': '062',
            'Olaines nov.': '068',
            'Augšdaugavas nov.': '111',
            'Ropažu nov.': '080',
            'Salaspils nov.': '087',
            'Saulkrastu nov.': '089',
            'Siguldas nov.': '091',
            'Smiltenes nov.': '094',
            'Dienvidkurzemes nov.': '112',
            'Varakļānu nov.': '102',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'MT': ( entry ) => {
        return entry.admin_code_1;
    },
    'MC': ( entry ) => {

        const map = {
            'La Condamine': 'CO',
            'Fontvieille': 'FO',
            'Larvotto': 'LA',
            'Monte-Carlo': 'MC',
            'Les Moneghetti': 'MG',
            'Monaco-Ville': 'MO',
            'Monaco': 'MO',
            
            // Regions missing from source data

            // MC-JE	Jardin Exotique
            // MC-CL	La Colle
            // MC-GA	La Gare
            // MC-MA	Malbousquet
            // MC-MU	Moulins
            // MC-PH	Port-Hercule
            // MC-SR	Saint-Roman
            // MC-SD	Sainte-Dévote
            // MC-SP	Spélugues
            // MC-VR	Vallon de la Rousse
        }

        if ( map[ entry.admin_name_3 ] ) {
            return map[ entry.admin_name_3 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_3 }` );
        }

    },
    'MD': ( entry ) => {
        
        const map = {
            'Chisinau': 'CU',
            'Chișinău': 'CU',
            'Strășeni District': 'ST',
            'Raionul Strășeni': 'ST',
            'Raionul Soroca': 'SO',
            'Soroca District': 'SO',
            'Florești District': 'FL',
            'Raionul Florești': 'FL',
            'Bălți': 'BA',
            'Bender': 'BD',
            'Anenii Noi': 'AN',
            'АнеНий-Ной': 'AN',
            'Județul Tighina': 'AN', // *
            'Administrative-Territorial Units of the Left Bank of the Dniester': 'SN',
            'Unitățile administrativ-teritoriale din stînga Nistrului': 'SN',
            'Ribnita 1': 'SN', // ***
            'Ofatinti': 'SN', // ***
            'Lisaia Gora': 'SN', // ***
            'Ghersunovca': 'SN', // ***
            'Căușeni District': 'CS',
            'Raionul Hîncești': 'HI',
            'Hîncești District': 'HI',
            'Raionul Orhei': 'OR',
            'Orhei District': 'OR',
            'Criuleni District': 'CR',
            'Ungheni District': 'UN',
            'Nisporeni District': 'NI',
            'Raionul Ungheni': 'UN',
            'Iaşi': 'UN', // **
            'Călărași District': 'CL',
            'Raionul Călărași': 'CL',
            'Raionul Criuleni': 'CR',
            'Găgăuzia': 'GA',
            'Gagauzia': 'GA',
            'Carbalia': 'GA', // ***
            'Taraclia District': 'TA',
            'Raionul Taraclia': 'TA',
            'Cahul District': 'CA',
            'Raionul Cahul': 'CA',
            'Raionul Cimișlia': 'CM',
            'Cimișlia District': 'CM',
            'Raionul Ștefan Vodă': 'SV',
            'Ștefan Vodă District': 'SV',
            'Raionul Căușeni': 'CS',
            'Dubăsari District': 'DU',
            'Raionul Dubăsari': 'DU',
            'Edineț': 'ED',
            'Edineţ District': 'ED',
            'Raionul Briceni': 'BR',
            'Briceni District': 'BR',
            'Glodeni District': 'GL',
            'Glodeni': 'GL',
            'Balti': 'BA',
            'Drochia District': 'DR',
            'Raionul Drochia': 'DR',
            'Sîngerei District': 'SI',
            'Sîngerei': 'SI',
            'Dondușeni District': 'DO',
            'Raionul Dondușeni': 'DO',
            'Rîșcani District': 'RI',
            'Raionul Rîșcani': 'RI',
            'Rezina District': 'RE',
            'Raionul Rezina': 'RE',
            'Buciusca': 'RE', // ***
            'Telenești District': 'TE',
            'Telenești': 'TE',
            'Negureni': 'TE', // ***
            'Raionul Fălești': 'FA',
            'Fălești District': 'FA',
            'Raionul Leova': 'LE',
            'Leova District': 'LE',
            'Cantemir District': 'CT',
            'Raionul Cantemir': 'CT',
            'Raionul Nisporeni': 'NI',
            'Șoldănești District': 'SD',
            'Raionul Șoldănești': 'SD',
            'Basarabeasca District': 'BS',
            'Raionul Ialoveni': 'IA',
            'Ialoveni District': 'IA',
            'Ocnița District': 'OC',
            'Raionul Ocnița': 'OC',
        }
        // * Varnita (geocoded in Judetul Tighina) is actually part of Anenii noi
        // ** first result from Google API for Medeleni is Iaşi instead of Ungheni
        // *** failed to geocode properly

        const admin_name = entry.admin_name_1 ?? entry.municipality;

        if ( map[ admin_name ] ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'NL': ( entry ) => {

        const map = {
            'Drenthe': 'DR',
            'Friesland': 'FR',
            'Gelderland': 'GE',
            'Groningen': 'GR',
            'Limburg': 'LI',
            'Noord-Brabant': 'NB',
            'Noord-Holland': 'NH',
            'Utrecht': 'UT',
            'Zeeland': 'ZE',
            'Zuid-Holland': 'ZH',
            'Overijssel': 'OV',
            'Flevoland': 'FL',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'NO': ( entry ) => {
        
        const map = {
            'Agder': '42',
            'Innlandet': '34',
            'Møre og Romsdal': '15',
            'Nordland': '18',
            'Oslo County': '03',
            'Rogaland': '11',
            'Troms og Finnmark': '54',
            'Trøndelag': '50',
            'Vestfold og Telemark': '38',
            'Vestland': '46',
            'Viken': '30',
            'Jan Mayen': '22',
            'Svalbard': '21',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'PL': ( entry ) => {

        const map = {
            'Lower Silesia': '02',
            'Kujawsko-Pomorskie': '04',
            'Łódź Voivodeship': '10',
            'Lublin': '06',
            'Lubusz': '08',
            'Lesser Poland': '12',
            'Mazovia': '14',
            'Opole Voivodeship': '16',
            'Subcarpathia': '18',
            'Podlasie': '20',
            'Pomerania': '22',
            'Silesia': '24',
            'Świętokrzyskie': '26',
            'Warmia-Masuria': '28',
            'Greater Poland': '30',
            'West Pomerania': '32',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'PT': ( entry ) => {

        const map = {
            'Aveiro': '01',
            'Beja': '02',
            'Braga': '03',
            'Bragança': '04',
            'Castelo Branco': '05',
            'Coimbra': '06',
            'Évora': '07',
            'Faro': '08',
            'Guarda': '09',
            'Leiria': '10',
            'Lisboa': '11',
            'Portalegre': '12',
            'Porto': '13',
            'Santarém': '14',
            'Setúbal': '15',
            'Viana do Castelo': '16',
            'Vila Real': '17',
            'Viseu': '18',
            'Azores': '20',
            'Madeira': '30',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'RO': ( entry ) => {
        
        const map = {
            'Alba': 'AB',
            'Arad': 'AR',
            'Argeş': 'AG',
            'Bacău': 'BC',
            'Bihor': 'BH',
            'Bistriţa-Năsăud': 'BN',
            'Botoşani': 'BT',
            'Brăila': 'BR',
            'Braşov': 'BV',
            'Bucureşti': 'B',
            'Buzău': 'BZ',
            'Caraş-Severin': 'CS',
            'Călăraşi': 'CL',
            'Cluj': 'CJ',
            'Constanţa': 'CT',
            'Covasna': 'CV',
            'Dâmboviţa': 'DB',
            'Dolj': 'DJ',
            'Galaţi': 'GL',
            'Giurgiu': 'GR',
            'Gorj': 'GJ',
            'Harghita': 'HR',
            'Hunedoara': 'HD',
            'Ialomiţa': 'IL',
            'Iaşi': 'IS',
            'Ilfov': 'IF',
            'Maramureş': 'MM',
            'Mehedinţi': 'MH',
            'Mureş': 'MS',
            'Neamţ': 'NT',
            'Olt': 'OT',
            'Prahova': 'PH',
            'Sălaj': 'SJ',
            'Satu Mare': 'SM',
            'Sibiu': 'SB',
            'Suceava': 'SV',
            'Teleorman': 'TR',
            'Timiş': 'TM',
            'Tulcea': 'TL',
            'Vaslui': 'VS',
            'Vâlcea': 'VL',
            'Vrancea': 'VN',
        }

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'RU': ( entry ) => {
        const map = {
            'Адыгея Республика': 'AD',
            'Алтай Республика': 'AL',
            'Алтайский Край': 'ALT',
            'Амурская Область': 'AMU',
            'Архангельская Область': 'ARK',
            'Астраханская Область': 'AST',
            'Башкортостан Республика': 'BA',

            'Байконур': null, // Baykonur Cosmodrome, Kazakhstan
            
            'Белгородская Область': 'BEL',
            'Брянская Область': 'BRY',
            'Бурятия Республика': 'BU',
            'Чеченская Республика': 'CE',
            'Челябинская Область': 'CHE',
            'Чувашская Республика': 'CU',
            'Дагестан Республика': 'DA',
            'Ингушетия Республика': 'IN',
            'Иркутская Область': 'IRK',
            'Ивановская Область': 'IVA',
            'Кабардино-Балкарская Республика': 'KB',
            'Калининградская Область': 'KGD',
            'Калмыкия Республика': 'KL',
            'Калужская Область': 'KLU',
            'Карачаево-Черкесская Республика': 'KC',
            'Карелия Республика': 'KR',
            'Кемеровская Область': 'KEM',
            'Хабаровский Край': 'KHA',
            'Хакасия Республика': 'KK',
            'Кировская Область': 'KIR',
            'Коми Республика': 'KO',
            'Костромская Область': 'KOS',
            'Краснодарский Край': 'KDA',
            'Курганская Область': 'KGN',
            'Курская Область': 'KRS',
            'Ленинградская Область': 'LEN',
            'Липецкая Область': 'LIP',
            'Магаданская Область': 'MAG',
            'Марий Эл Республика': 'ME',
            'Мордовия Республика': 'MO',
            'Московская Область': 'MOS',
            'Москва': 'MOW',
            'Мурманская Область': 'MUR',
            'Нижегородская Область': 'NIZ',
            'Новгородская Область': 'NGR',
            'Новосибирская Область': 'NVS',
            'Омская Область': 'OMS',
            'Оренбургская Область': 'ORE',
            'Орловская Область': 'ORL',
            'Пензенская Область': 'PNZ',
            'Приморский Край': 'PRI',
            'Псковская Область': 'PSK',
            'Ростовская Область': 'ROS',
            'Рязанская Область': 'RYA',
            'Саха (Якутия) Республика': 'SA',
            'Сахалинская Область': 'SAK',
            'Самарская Область': 'SAM',
            'Санкт-Петербург': 'SPE',
            'Саратовская Область': 'SAR',
            'Северная Осетия-Алания Республика': 'SE',
            'Смоленская Область': 'SMO',
            'Ставропольский Край': 'STA',
            'Свердловская Область': 'SVE',
            'Тамбовская Область': 'TAM',
            'Татарстан Республика': 'TA',
            'Томская Область': 'TOM',
            'Тульская Область': 'TUL',
            'Тверская Область': 'TVE',
            'Тюменская Область': 'TYU',
            'Тыва Республика': 'TY',
            'Удмуртская Республика': 'UD',
            'Ульяновская Область': 'ULY',
            'Владимирская Область': 'VLA',
            'Волгоградская Область': 'VGG',
            'Вологодская Область': 'VLG',
            'Воронежская Область': 'VOR',
            'Ярославская Область': 'YAR',
            'Пермский Край': 'PER',
            'Красноярский Край': 'KYA',
            'Камчатская Область': 'KAM',

            'Читинская Область': 'ZAB', // Chita, Zabaykalsky Krai, Russia

            'Биробиджан': 'YEV', // Birobidzhan, Jewish Autonomous Oblast, Russia
            'Биробиджан 2': 'YEV',
            'Биробиджан 5': 'YEV',
            'Биробиджан 6': 'YEV',
            'Биробиджан 11': 'YEV',
            'Биробиджан 13': 'YEV',
            'Биробиджан 14': 'YEV',
            'Биробиджан 15': 'YEV',
            'Биробиджан 16': 'YEV',
            'Биробиджан 17': 'YEV',
            'Биробиджан-Сту': 'YEV',
            'ОБЛУЧЕНСКИЙ РАЙОН': 'YEV',
            'СМИДОВИЧСКИЙ РАЙОН': 'YEV',
            'БИРОБИДЖАНСКИЙ РАЙОН': 'YEV',
            'Уфпс Еврейской Автономной Области': 'YEV',

            'ОКТЯБРЬСКИЙ РАЙОН': 'PRI',

            'ЛЕНИНСКИЙ РАЙОН': 'MOS',
            'Анадырь': 'CHU',
            'БЕРИНГОВСКИЙ РАЙОН': 'CHU',
            'ИУЛЬТИНСКИЙ РАЙОН': 'CHU',
            'ПРОВИДЕНСКИЙ РАЙОН': 'CHU',
            'ЧУКОТСКИЙ РАЙОН': 'CHU',
            'ШМИДТОВСКИЙ РАЙОН': 'CHU',
            'ЧАУНСКИЙ РАЙОН': 'CHU',
            'БИЛИБИНСКИЙ РАЙОН': 'CHU',
            'АНАДЫРСКИЙ РАЙОН': 'CHU',
            'Уфпс Чукотского Автономного Округа': 'CHU',
        }

        const admin_name = entry.admin_name_1 ?? entry.admin_name_2 ?? entry.admin_name_3 ?? entry.municipality;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'RU2': ( entry ) => {
        const map = {
            'Adygea, Republic Of': 'AD',
            'Altai Republic': 'AL',
            'Bashkortostan, Republic Of': 'BA',
            'Buryatia, Republic Of': 'BU',
            'Chechen Republic': 'CE',
            'Chuvash Republic': 'CU',
            'Dagestan, Republic Of': 'DA',
            'Ingushetia, Republic Of': 'IN',
            'Kabardino-Balkar Republic': 'KB',
            'Karachay-Cherkess Republic': 'KC',
            'Khakassia, Republic Of': 'KK',
            'Kalmykia, Republic Of': 'KL',
            'Komi Republic': 'KO',
            'Karelia, Republic Of': 'KR',
            'Mari El Republic': 'ME',
            'Mordovia, Republic Of': 'MO',
            'Sakha (Yakutia) Republic': 'SA',
            'North Ossetia-Alania, Republic Of': 'SE',
            'Tatarstan, Republic Of': 'TA',
            'Tuva Republic': 'TY',
            'Udmurt Republic': 'UD',

            'Altai Krai': 'ALT',
            'Amur Oblast': 'AMU',
            'Arkhangelsk Oblast': 'ARK',
            'Astrakhan Oblast': 'AST',
            'Belgorod Oblast': 'BEL',
            'Bryansk Oblast': 'BRY',
            'Chelyabinsk Oblast': 'CHE',
            'Irkutsk Oblast': 'IRK',
            'Ivanovo Oblast': 'IVA',
            'Kamchatka Krai': 'KAM',
            'Krasnodar Krai': 'KDA',
            'Kemerovo Oblast': 'KEM',
            'Khabarovsk Krai': 'KHA',
            'Khanty?Mansi Autonomous Okrug ? Yugra': 'KHM',
            'Kaliningrad Oblast': 'KGD',
            'Kurgan Oblast': 'KGN',
            'Kirov Oblast': 'KIR',
            'Kaluga Oblast': 'KLU',
            'Kostroma Oblast': 'KOS',
            'Kursk Oblast': 'KRS',
            'Krasnoyarsk Krai': 'KYA',
            'Leningrad Oblast': 'LEN',
            'Lipetsk Oblast': 'LIP',
            'Magadan Oblast': 'MAG',
            'Moscow Oblast': 'MOS',
            'Moscow': 'MOW',
            'Murmansk Oblast': 'MUR',
            'Novgorod Oblast': 'NGR',
            'Novosibirsk Oblast': 'NVS',
            'Nizhny Novgorod Oblast': 'NIZ',
            'Omsk Oblast': 'OMS',
            'Orenburg Oblast': 'ORE',
            'Oryol Oblast': 'ORL',
            'Penza Oblast': 'PNZ',
            'Primorsky Krai': 'PRI',
            'Perm Krai': 'PER',
            'Pskov Oblast': 'PSK',
            'Rostov Oblast': 'ROS',
            'Ryazan Oblast': 'RYA',
            'Sakhalin Oblast': 'SAK',
            'Samara Oblast': 'SAM',
            'Saratov Oblast': 'SAR',
            'Smolensk Oblast': 'SMO',
            'Saint Petersburg': 'SPE',
            'Sevastopol': null, // 
            'Sverdlovsk Oblast': 'SVE',
            'Tambov Oblast': 'TAM',
            'Tomsk Oblast': 'TOM',
            'Tula Oblast': 'TUL',
            'Tver Oblast': 'TVE',
            'Tyumen Oblast': 'TYU',
            'Ulyanovsk Oblast': 'ULY',
            'Volgograd Oblast': 'VGG',
            'Voronezh Oblast': 'VOR',
            'Vladimir Oblast': 'VLA',
            'Vologda Oblast': 'VLG',
            'Yaroslavl Oblast': 'YAR',
        }

        const admin_name = entry.admin_name_1 ?? entry.admin_name_2 ?? entry.admin_name_3 ?? entry.municipality;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'SM': ( entry ) => {
        // mapping postal code directly to region code
        // instead of adding entry for each municipality

        const map = {
            '47891': '09', // Serravalle
            '47892': '01', // Acquaviva
            '47894': '02', // Chiesanuova
            '47895': '03', // Domagnano
            '47896': '04', // Faetano
            '47897': '05', // Fiorentino
            '47893': '06', // Borgo Maggiore
            '47890': '07', // Citta di San Marino
            '47898': '08', // Montegiardino
            '47899': '09', // Serravalle
        }

        if ( ! entry.postal_code ) {
            return null;
        }

        if ( map[ entry.postal_code ] !== undefined ) {
            return map[ entry.postal_code ];
        } else {
            throw new Error( `Unknown postal code: ${ entry.postal_code }` );
        }
    },
    'SK': ( entry ) => {
        return entry.admin_code_1;
    },
    'SE': ( entry ) => {
        
        if ( entry.admin_code_1 ) {
            return entry.admin_code_1;
        }

        const admin_name = entry.admin_name_1 ?? entry.municipality;

        const map = {
            'Stockholms län': 'AB',
            'Stockholm': 'AB',
            'Stockholm County': 'AB',
            'Skåne': 'M',
            'Skåne län': 'M',
            'Västra Götaland': 'O',
            'Gotlands län': 'I',
            'Gotland': 'I',
            'Västmanland': 'U',
            'Uppsala': 'C',
        }

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'CH': ( entry ) => {
        return entry.admin_code_1;
    },
    'TR': ( entry ) => {
        const map = {
            'Adana': '01',
            'Adiyaman': '02',
            'Afyonkarahisar': '03',
            'Ağri': '04',
            'Amasya': '05',
            'Ankara': '06',
            'Antalya': '07',
            'Artvin': '08',
            'Aydin': '09',
            'Balikesir': '10',
            'Bilecik': '11',
            'Bingöl': '12',
            'Bitlis': '13',
            'Bolu': '14',
            'Burdur': '15',
            'Bursa': '16',
            'Çanakkale': '17',
            'Çankiri': '18',
            'Çorum': '19',
            'Denizli': '20',
            'Diyarbakir': '21',
            'Edirne': '22',
            'Elaziğ': '23',
            'Erzincan': '24',
            'Erzurum': '25',
            'Eskişehir': '26',
            'Gaziantep': '27',
            'Giresun': '28',
            'Gümüşhane': '29',
            'Hakkari': '30',
            'Hatay': '31',
            'Isparta': '32',
            'Mersin(İçel)': '33',
            'İstanbul': '34',
            'İzmir': '35',
            'Kars': '36',
            'Kastamonu': '37',
            'Kayseri': '38',
            'Kirklareli': '39',
            'Kirşehir': '40',
            'Kocaeli': '41',
            'Konya': '42',
            'Kütahya': '43',
            'Malatya': '44',
            'Manisa': '45',
            'Kahramanmaraş': '46',
            'Mardin': '47',
            'Muğla': '48',
            'Muş': '49',
            'Nevşehir': '50',
            'Niğde': '51',
            'Ordu': '52',
            'Rize': '53',
            'Sakarya': '54',
            'Samsun': '55',
            'Siirt': '56',
            'Sinop': '57',
            'Sivas': '58',
            'Tekirdağ': '59',
            'Tokat': '60',
            'Trabzon': '61',
            'Tunceli': '62',
            'Şanliurfa': '63',
            'Uşak': '64',
            'Van': '65',
            'Yozgat': '66',
            'Zonguldak': '67',
            'Aksaray': '68',
            'Bayburt': '69',
            'Karaman': '70',
            'Kirikkale': '71',
            'Batman': '72',
            'Şirnak': '73',
            'Bartin': '74',
            'Ardahan': '75',
            'Iğdir': '76',
            'Yalova': '77',
            'Karabük': '78',
            'Kilis': '79',
            'Osmaniye': '80',
            'Düzce': '81',

            // KKTC (Turkish Republic of Northern Cyprus)
            'Kktc': null,
        }

        if ( map[ entry.admin_name_1 ] !== undefined ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'UA': ( entry ) => {
        const map = {
            'Cherkaska': '71',
            'Chernihivska': '74',
            'Chernivetska': '77',
            'Dnipropetrovska': '12',
            'Donetska': '14',
            'Ivano-Frankivska': '26',
            'Kharkivska': '63',
            'Khersonska': '65',
            'Khmelnytska': '68',
            'Kirovohradska': '35',
            'Kyivska': '32',
            'Kyiv': '30',
            'Luhanska': '09',
            'Lvivska': '46',
            'Mykolaivska': '48',
            'Odeska': '51',
            'Poltavska': '53',
            'Rivnenska': '56',
            'Sumska': '59',
            'Ternopilska': '61',
            'Vinnytska': '05',
            'Volynska': '07',
            'Zakarpatska': '21',
            'Zaporizka': '23',
            'Zhytomyrska': '18',
        }

        if ( map[ entry.admin_name_1 ] !== undefined ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'VA': ( entry ) => {
        return null;
    },
    'MK': ( entry ) => {
        const map = {
            'Centar': '814',
            'Municipality of Čučer-Sandevo': '816',
            'Kisela Voda': '809',
            'Municipality of Ilinden': '807',
            'Municipality of Petrovec': '810',
            'Municipality of Aracinovo': '802',
            'Gazi Baba': '804',
            'Municipality of Zelenikovo': '806',
            'Municipality of Demir Hisar': '502',
            'Gjorche Petrov': '805',
            'Saraj': '811',
            'Сараj': '811',
            'Komuna e Tetovës': '609',
            'Municipality of Tearce': '608',
            'Municipality of Jegunovce': '606',
            'Komuna e Tearcës': '608',
            'Municipality of Bogovinje': '601',
            'Komuna e Bërvenicës': '602',
            'Municipality of Želino': '605',
            'Komuna e Bogovinës': '601',
            'Municipality of Brvenica': '602',
            'Municipality of Gostivar': '604',
            'Komuna e Gostivarit': '604',
            'Municipality of Negotino': '106',
            'Komuna e Vrapçishtit': '603',
            'Municipality of Vrapčište': '603',
            'Municipality of Debar': '303',
            'Municipality of Mavrovo and Rostuša': '607',
            'Municipality of Centar Župa': '313',
            'Municipality of Kumanovo': '703',
            'Municipality of Staro Nagorichane': '706',
            'Општина Куманово': '703',
            'Municipality of Lipkovo': '704',
            'Komuna e Likovës': '704',
            'Municipality of Rankovce': '705',
            'Municipality of Kriva Palanka': '702',
            'Municipality of Kratovo': '701',
            'Municipality of Veles': '101',
            'Komuna e Velesit': '101',
            'Municipality of Čaška': '109',
            'Municipality of Gradsko': '102',
            'Municipality of Rosoman': '107',
            'Municipality of Kavadarci': '104',
            'Komuna e Kavadarit': '104',
            'Municipality of Demir Kapija': '103',
            'Municipality of Gevgelija': '405',
            'Municipality of Bogdanci': '401',
            'Municipality of Dojran': '406',
            'Municipality of Štip': '211',
            'Municipality of Karbinci': '205',
            'Lozovo Municipality': '105',
            'Probištip Municipality': '209',
            'Municipality of Sveti Nikole': '108',
            'Kočani Municipality': '206',
            'Municipality of Češinovo-Obleševo': '210',
            'Municipality of Makedonska Kamenica': '207',
            'Municipality of Zrnovci': '204',
            'Municipality of Vinica': '202',
            'Komuna e Vinicës': '202',
            'Municipality of Berovo': '201',
            'Municipality of Delcevo': '203',
            'Municipality of Pehčevo': '208',
            'Municipality of Strumitsa': '410',
            'Municipality of Vasilevo': '404',
            'Municipality of Radoviš': '409',
            'Municipality of Konche': '407',
            'Municipality of Bosilovo': '402',
            'Komuna e Bosilovës': '402',
            'Municipality of Novo Selo': '408',
            'Municipality of Valandovo': '403',
            'Municipality of Ohrid': '310',
            'Kičevo Municipality': '307',
            'Municipality of Resen': '509',
            'Komuna e Resnjës': '509',
            'Municipality of Struga': '312',
            'Vevčani Municipality': '301',
            'Komuna e Debarcës': '304',
            'Municipality of Debarca': '304',
            'Municipality of Makedonski Brod': '308',
            'Plasnica Municipality': '311',
            'Municipality of Bitola': '501',
            'Komuna e Manastirit': '501',
            'Municipality of Novaci': '507',
            'Mogila': '506',
            'Komuna e Demir Hisarit': '502',
            'Prilep Municipality': '508',
            'Komuna e Prilepit': '508',
            'Municipality of Dolneni': '503',
            'Komuna e Krivogashtanit': '504',
            'Municipality of Krivogaštani': '504',
            'Municipality of Kruševo': '505',
        }

        const admin_name = entry.admin_name_2 ?? entry.admin_name_1 ?? entry.municipality;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            throw new Error( `MK: Unknown region: ${ admin_name }` );
        }
    },
    'AL': ( entry ) => {
        const map = {
            'Berat County': '01',
            'Qarku i Beratit': '01',
            'Durrës County': '02',
            'Qarku i Durrësit': '02',
            'Elbasan County': '03',
            'Qarku i Elbasanit': '03',
            'Fier County': '04',
            'Gjirokastër County': '05',
            'Qarku i Gjirokastrës': '05',
            'Korçë County': '06',
            'Qarku I Korçës': '06',
            'Kukës County': '07',
            'Qarku i Kukësit': '07',
            'Lezhë County': '08',
            'Dibër County': '09',
            'Qarku i Dibrës': '09',
            'Shkodër County': '10',
            'Tirana County': '11',
            'Vlorë County': '12',
            'Qarku i Vlorës': '12',
        }

        const admin_name = entry.admin_name_1 ?? entry.municipality;

        if ( map[ admin_name ] ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }

    },
    'GR': ( entry ) => {
        const map = {
            'East Macedonia And Thrace': 'A',
            'Attica': 'I',
            'North Aegean': 'K',
            'West Greece': 'G',
            'West Macedonia': 'C',
            'Epirus': 'D',
            'Thessaly': 'E',
            'Ionian Islands': 'F',
            'Central Macedonia': 'B',
            'Crete': 'M',
            'South Aegean': 'L',
            'Peloponnese': 'J',
            'Central Greece': 'H',
        }

        const admin_name = entry.admin_name_1;

        if ( map[ admin_name ] ) {
            return map[ admin_name ];
        } else {
            pbcopy( `'${ admin_name }': ` );
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'BA': ( entry ) => {

        const map = {
            'Brčko Distrikt': 'BRC',
            'Federacija Bosne i Hercegovine': 'BIH',
            'Republika Srpska': 'SRP',
        };

        if ( map[ entry.admin_name_1 ] ) {
            return map[ entry.admin_name_1 ];
        } else {
            throw new Error( `Unknown region: ${ entry.admin_name_1 }` );
        }
    },
    'MA': ( entry ) => {

        const map = {
            'Casablanca-Settat': '06',
            'Béni Mellal-Khénifra': '05',
            'Béni Mellal-Khenifra': '05',
            'Marrakech-Safi': '07',
            'Marrakesh-Safi': '07',
            'Fez-Meknès': '03',
            'Fès-Meknès': '03',
            'Rabat-Salé-Kénitra': '04',
            'Guelmim-Oued Noun': '10',
            'Oriental': '02',
            'Laâyoune-Sakia El Hamra': '11',
            'Drâa-Tafilalet': '08',
            'Souss Massa': '09',
            'Souss-Massa': '09',
            'Tanger-Tétouan-Al Hoceïma': '01',
            'Tangier-Tétouan-Al Hoceima': '01',
        };

        const admin_name = entry.admin_name_1;

        if ( ! admin_name ) {
            return null;
        }

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'MA2': async ( entry ) => {

        const map = {
            "Al Hoceima": "HOC",
            "Assa Zag": "ASZ",
            "Boujdour": "BOD",
            "Al Haouz": "HAO",
            "Aousserd": "AOU",
            "Agadir Ida Ou Tanan": "AGD",
            "Beni Mellal": "BEM",
            "Benslimane": "BES",
            "Azilal": "AZI",
            "Berkane": "BER",
            "Chefchaouen": "CHE",
            "El Hajeb": "HAJ",
            "El Jadida": "JDI",
            "Essaouira": "ESI",
            "Boulemane": "BOM",
            "Chichaoua": "CHI",
            "Chtouka Ait Baha": "CHT",
            "El Kelaa Des Sraghna": "KES",
            "Errachidia": "ERR",
            "Es Semara": "ESM",
            "Khenifra": "KEN",
            "Ifrane": "IFR",
            "Khemisset": "KHE",
            "Jerada": "JRA",
            "Fahs Anjra": "FAH",
            "Figuig": "FIG",
            "Fes": "FES",
            "Guelmim": "GUE",
            "Inezgane Ait Melloul": "INE",
            "Kenitra": "KEN",
            "Laayoune": "LAA",
            "Larache": "LAR",
            "Meknes": "MEK",
            "Khouribga": "KHO",
            "Mohammedia": "MOH",
            "Mediouna": "MED",
            "Nador": "NAD",
            "Nouaceur": "NOU",
            "Moulay Yacoub": "MOU",
            "Marrakech": "MAR",
            "Sidi Kacem": "SIK",
            "Tanger Assilah": "TNG",
            "Oujda Angad": "OUJ",
            "Ouarzazate": "OUA",
            "Settat": "SET",
            "Skhirate-Temara": "SKH",
            "Sale": "SAL",
            "Oued Ed-Dahab": "OUD",
            "Sefrou": "SEF",
            "Taounate": "TAO",
            "Tantan": "TNT",
            "Taourirt": "TAI",
            "Taza": "TAZ",
            "Zagora": "ZAG",
            "Tiznit": "TIZ",
            "Taroudannt": "TAR",
            "Tata": "TAT",
            "Tetouan": "TET",
        }

        const province_name = entry.admin_name_1;
        
        if ( map[ province_name ] ) {
            const province_code = map[ province_name ];
            const { iso31662 } = await import( 'iso-3166' );
            const code = iso31662.find( ( code ) => code.code === `${ entry.country_code }-${ province_code }` );
            return code.parent.split('-')[1];
        } else {
            pbcopy( `"${ province_name }": ` );
            throw new Error( `Unknown province: ${ province_name }` );
        }
    },
    'BR': ( entry ) => {

        const map = {
            'Acre': 'AC',
            'Alagoas': 'AL',
            'Alagoas ': 'AL',
            'Amapa': 'AP',
            'Amazonas': 'AM',
            'Amazonas ': 'AM',
            'Bahia': 'BA',
            'Ceara': 'CE',
            'Distrito Federal': 'DF',
            'Espirito Santo': 'ES',
            'Goias': 'GO',
            'Mato Grosso': 'MT',
            'Mato Grosso ': 'MT',
            'Mato Grosso do Sul': 'MS',
            'Maranhao': 'MA',
            'Maranhao ': 'MA',
            'Minas Gerais': 'MG',
            'Para': 'PA',
            'Paraiba': 'PB',
            'Parana': 'PR',
            'Piaui': 'PI',
            'Rio de Janeiro': 'RJ',
            'Rio de Janeiro ': 'RJ',
            'Rio Grande do Norte': 'RN',
            'Rio Grande do Norte ': 'RN',
            'Rio Grande do Sul': 'RS',
            'Rondonia': 'RO',
            'Roraima': 'RR',
            'Santa Catarina': 'SC',
            'Santa Catarina ': 'SC',
            'Sao Paulo': 'SP',
            'Sergipe': 'SE',
            'Pernambuco': 'PE',
            'Pernambuco ': 'PE',
            'Tocantins': 'TO',
        }

        const admin_name = entry.admin_name_1;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'MX': ( entry ) => {

        const map = {
            'Aguascalientes': 'AGU',
            'Baja California': 'BCN',
            'Baja California Sur': 'BCS',
            'Campeche': 'CAM',
            'Chiapas': 'CHP',
            'Chihuahua': 'CHH',
            'Coahuila de Zaragoza': 'COA',
            'Colima': 'COL',
            'Distrito Federal': 'CMX',
            'Durango': 'DUR',
            'Guanajuato': 'GUA',
            'Guerrero': 'GRO',
            'Hidalgo': 'HID',
            'Jalisco': 'JAL',
            'México': 'MEX',
            'Michoacán de Ocampo': 'MIC',
            'Morelos': 'MOR',
            'Nayarit': 'NAY',
            'Nuevo León': 'NLE',
            'Oaxaca': 'OAX',
            'Puebla': 'PUE',
            'Querétaro': 'QUE',
            'Quintana Roo': 'ROO',
            'San Luis Potosí': 'SLP',
            'Sinaloa': 'SIN',
            'Sonora': 'SON',
            'Tabasco': 'TAB',
            'Tamaulipas': 'TAM',
            'Tlaxcala': 'TLA',
            'Veracruz de Ignacio de la Llave': 'VER',
            'Yucatán': 'YUC',
            'Zacatecas': 'ZAC',
        }

        const admin_name = entry.admin_name_1;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'AM': ( entry ) => {
        const map = {
            'Aragatsotn Province': 'AG',
            'Արագածոտն': 'AG',
            'Ararat Province': 'AR',
            'Bardzrashen': 'AR', // @todo - fix geocoding --self flag to fix this kind of entry
            'Արարատ': 'AR',
            'Armavir Province': 'AV',
            'Gegharkunik Province': 'GR',
            'Kotayk Province': 'KT',
            'Lori Province': 'LO',
            'Շիրակ': 'SH', // Sirak
            'Shirak Province': 'SH',
            'Syunik Province': 'SU',
            'Tavush Province': 'TV',
            'Voskepar': 'TV',
            'Vayots Dzor Province': 'VD',
            'Jermuk': 'VD',
            'Yerevan': 'ER',
            'Երևան': 'ER',
        }

        const admin_name = entry.admin_name_1 ?? entry.municipality;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }

    },
    'BH': ( entry ) => {
        const map = {
            'Capital': '13',
            'Southern': '14',
            'Muharraq': '15',
            'Northern': '17',
        }
        
        const admin_name = entry.admin_name_1;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'GE': ( entry ) => {
        const map = {
            'Abkhazia': 'AB',
            'Adjara': 'AJ',
            'Guria': 'GU',
            'Imereti': 'IM',
            "K'Akheti": 'KA',
            'Kvemo Kartli': 'KK',
            'Mtskheta-Mtianeti': 'MM',
            "Rach'A-Lechkhumi-Kvemo Svaneti": 'RL',
            'Samegrelo-Zemo Svaneti': 'SZ',
            'Samtskhe-Javakheti': 'SJ',
            'Shida Kartli': 'SK',
            'Tbilisi': 'TB',
        }

        // * Google could not find the region for this entry

        const admin_name = entry.admin_name_1;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'RS': ( entry ) => {
        const map = {
            'Grad Beograd': '00',
            'City of Belgrade': '00',
            'Severnobački okrug': '01',
            'North Bačka District': '01',
            'Srednjobanatski okrug': '02',
            'Средњобанатски округ': '02',
            'Central Banat District': '02',
            'Severnobanatski okrug': '03',
            'North Banat District': '03',
            'Južnobanatski okrug': '04',
            'South Banat District': '04',
            'Zapadnobački okrug': '05',
            'West Bačka District': '05',
            'Južnobački okrug': '06',
            'South Backa District': '06',
            'Sremski оkrug': '07',
            'Srem District': '07',
            'Mačvanski okrug': '08',
            'Mačva District': '08',
            'Kolubarski okrug': '09',
            'Kolubara District': '09',
            'Podunavski okrug': '10',
            'Podunavlje District': '10',
            'Braničevski okrug': '11',
            'Braničevo District': '11',
            'Šumadijski okrug': '12',
            'Sumadija': '12',
            'Pomoravski okrug': '13',
            'Pomoravlje District': '13',
            'Bor District': '14',
            'Borski okrug': '14',
            'Zaječarski okrug': '15',
            'Zaječar District': '15',
            'Zlatiborski okrug': '16',
            'Zlatibor District': '16',
            'Kaluđerske Bare': '16', // *
            'Moravički okrug': '17',
            'Moravica District': '17',
            'Raški okrug': '18',
            'Raška District': '18',
            'Rasina': '19',
            'Rasinski Okrug': '19',
            'Nišavski okrug': '20',
            'Nišava District': '20',
            'Toplički okrug': '21',
            'Toplica District': '21',
            'Pirotski Okrug': '22',
            'Pirot District': '22',
            'Jablanički okrug': '23',
            'Jablanica District': '23',
            'Pčinjski Okrug': '24',
            'Pčinja District': '24',
        }

        // * Geocoding failed to find the region for this entry

        const admin_name = entry.admin_name_2 ?? entry.municipality;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            console.log( entry );
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'SI': ( entry ) => {
        const map = {
            'Municipality of Vodice': '138',
            'Ljubljana': '061',
            'Municipality of Medvode': '071',
            'Municipality of Komenda': '164',
            'Municipality of Kamnik': '043',
            'Municipality of Lukovica': '068',
            'Municipality of Domžale': '023',
            'Municipality of Mengeš': '072',
            'Municipality of Trzin': '186',
            'Municipality of Moravče': '077',
            'Municipality of Litija': '060',
            'Municipality of Dol pri Ljubljani': '022',
            'Municipality of Šmartno pri Litiji': '194',
            'Municipality of Grosuplje': '032',
            'Municipality of Škofljica': '123',
            'Municipality of Ig': '037',
            'Municipality of Ivančna Gorica': '039',
            'Municipality of Ribnica': '104',
            'Municipality of Velike Lašče': '134',
            'Municipality of Dobrepolje': '020',
            'Municipality of Sodražica': '179',
            'Municipality of Kočevje': '048',
            'Municipality of Kostel': '165',
            'Municipality of Osilnica': '088',
            'Municipality of Brezovica': '008',
            'Municipality of Borovnica': '005',
            'Municipality of Horjul': '162',
            'Municipality of Dobrova–Polhov Gradec': '021',
            'Municipality of Log - Dragomer': '208',
            'Municipality of Loška Dolina': '065',
            'Municipality of Logatec': '064',
            'Municipality of Cerknica': '013',
            'Municipality of Bloke': '150',
            'Municipality of Zagorje ob Savi': '142',
            'Municipality of Trbovlje': '129',
            'Municipality of Hrastnik': '034',
            'Municipality of Laško': '057',
            'Municipality of Radeče': '099',
            'Municipality of Sevnica': '110',
            'Maribor': '070',
            'Municipality of Kungota': '055',
            'Municipality of Miklavž na Dravskem polju': '169',
            'Municipality of Starše': '115',
            'Municipality of Hoče - Slivnica': '160',
            'Municipality of Pesnica': '089',
            'Municipality of Šentilj': '118',
            'Municipality of Apače': '195',
            'Municipality of Sveti Jurij v Slovenskih Goricah': '210',
            'Municipality of Lenart': '058',
            'Municipality of Benedikt': '148',
            'Municipality of Cerkvenjak': '153',
            'Municipality of Duplek': '026',
            'City Municipality of Ptuj': '096',
            'Municipality of Dornava': '024',
            'Municipality of Trnovska vas': '185',
            'Municipality of Sveti Andraž v Slovenskih goricah': '182',
            'Municipality of Juršinci': '042',
            'Municipality of Sveti Tomaž': '205',
            'Municipality of Ormož': '087',
            'Municipality of Gorišnica': '028',
            'Municipality of Središče ob Dravi': '202',
            'Municipality of Markovci': '168',
            'Municipality of Cirkulane': '196',
            'Municipality of Zavrč': '143',
            'Municipality of Videm': '135',
            'Municipality of Podlehnik': '172',
            'Municipality of Žetale': '191',
            'Municipality of Hajdina': '159',
            'Municipality of Majšperk': '069',
            'Municipality of Slovenska Bistrica': '113',
            'Municipality of Rače–Fram': '098',
            'Municipality of Oplotnica': '171',
            'Municipality of Poljčane': '200',
            'Municipality of Makole': '198',
            'Municipality of Kidričevo': '045',
            'Municipality of Ruše': '108',
            'Municipality of Lovrenc na Pohorju': '167',
            'Municipality of Selnica ob Dravi': '178',
            'Municipality of Radlje ob Dravi': '101',
            'Municipality of Podvelka': '093',
            'Municipality of Tabor': '184',
            'Municipality of Ribnica na Pohorju': '177',
            'Municipality of Muta': '081',
            'Municipality of Vuzenica': '141',
            'Municipality of Dravograd': '025',
            'Municipality of Slovenj Gradec': '112',
            'Municipality of Mislinja': '076',
            'Municipality of Ravne na Koroškem': '103',
            'Municipality of Prevalje': '175',
            'Municipality of Mežica': '074',
            'Municipality of Črna na Koroškem': '016',
            'Municipality of Ilirska Bistrica': '038',
            'Celje': '011',
            'Municipality of Vojnik': '139',
            'Municipality of Dobrna': '155',
            'Municipality of Vitanje': '137',
            'Municipality of Zreče': '144',
            'Municipality of Slovenske Konjice': '114',
            'Municipality of Štore': '127',
            'Municipality of Šentjur': '120',
            'Municipality of Dobje': '154',
            'Municipality of Šmarje pri Jelšah': '124',
            'Municipality of Rogaška Slatina': '106',
            'Municipality of Rogatec': '107',
            'Municipality of Podčetrtek': '092',
            'Municipality of Kozje': '051',
            'Municipality of Bistrica ob Sotli': '149',
            'Municipality of Žalec': '190',
            'Municipality of Braslovče': '151',
            'Municipality of Vransko': '189',
            'Municipality of Polzela': '173',
            'Municipality of Prebold': '174',
            'Municipality of Šoštanj': '126',
            'Municipality of Šmartno ob Paki': '125',
            'Municipality of Mozirje': '079',
            'Municipality of Nazarje': '083',
            'Municipality of Rečica ob Savinji': '209',
            'Municipality of Ljubno': '062',
            'Municipality of Luče': '067',
            'Municipality of Solčava': '180',
            'Municipality of Gornji Grad': '030',
            'City Municipality of Velenje': '133',
            'Kranj': '052',
            'Municipality of Naklo': '082',
            'Municipality of Preddvor': '095',
            'Municipality of Jezersko': '163',
            'Municipality of Cerklje na Gorenjskem': '012',
            'Municipality of Šenčur': '117',
            'Municipality of Škofja Loka': '122',
            'Municipality of Gorenja Vas-Poljane': '027',
            'Municipality of Žiri': '147',
            'Municipality of Železniki': '146',
            'Municipality of Radovljica': '102',
            'Municipality of Gorje': '207',
            'Municipality of Bled': '003',
            'Municipality of Bohinj': '004',
            'Municipality of Jesenice': '041',
            'Municipality of Žirovnica': '192',
            'Municipality of Kranjska Gora': '053',
            'Municipality of Tržič': '131',
            'Municipality of Nova Gorica': '084',
            'Municipality of Kanal ob Soči': '044',
            'Municipality of Brda': '007',
            'Municipality of Tolmin': '128',
            'Municipality of Kobarid': '046',
            'Municipality of Bovec': '006',
            'Municipality of Ajdovščina': '001',
            'Municipality of Vipava': '136',
            'Municipality of Idrija': '036',
            'Municipality of Cerkno': '014',
            'Municipality of Šempeter–Vrtojba': '183',
            'Municipality of Miren - Kostanjevica': '075',
            'Municipality of Renče-Vogrsko': '201',
            'Koper': '050',
            'Municipality of Sežana': '111',
            'Municipality of Divača': '019',
            'Municipality of Komen': '049',
            'Municipality of Postojna': '094',
            'Municipality of Hrpelje - Kozina': '035',
            'Municipality of Pivka': '091',
            'Municipality of Piran': '090',
            'Novo Mesto': '085',
            'Municipality of Trebnje': '130',
            'Municipality of Mirna Peč': '170',
            'Municipality of Šmarješke Toplice': '206',
            'Municipality of Mokronog - Trebelno': '199',
            'Municipality of Šentrupert': '211',
            'Municipality of Mirna': '212',
            'Municipality of Brežice': '009',
            'Municipality of Krško': '054',
            'Municipality of Škocjan': '121',
            'Municipality of Šentjernej': '119',
            'Municipality of Kostanjevica na Krki': '197',
            'Municipality of Metlika': '073',
            'Municipality of Semič': '109',
            'Municipality of Črnomelj': '017',
            'Municipality of Dolenjske Toplice': '157',
            'Municipality of Straža': '203',
            'Municipality of Žužemberk': '193',
            'City Municipality of Murska Sobota': '080',
            'Municipality of Puconci': '097',
            'Municipality of Gornji Petrovci': '031',
            'Municipality of Šalovci': '033',
            'Municipality of Moravske Toplice': '078',
            'Municipality of Turnišče': '132',
            'Municipality of Velika Polana': '187',
            'Municipality of Kobilje': '047',
            'Municipality of Beltinci': '002',
            'Municipality of Črenšovci': '015',
            'Municipality of Odranci': '086',
            'Municipality of Ljutomer': '063',
            'Municipality of Veržej': '188',
            'Municipality of Križevci': '166',
            'Gornja Radgona': '029',
            'Municipality of Tišina': '010',
            'Municipality of Radenci': '100',
            'Municipality of Cankova': '152',
            'Municipality of Rogašovci': '105',
            'Municipality of Kuzma': '056',
            'Municipality of Grad': '158',
            'Municipality of Izola': '040',
            'Municipality of Sveta Ana': '181',
            'Municipality of Hodoš': '161',
        }
        
        const admin_name = entry.admin_name_2;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            pbcopy( `'${ admin_name }': ` );
            throw new Error( `Unknown region: ${ admin_name }` );
        }

    },
    'SI2': ( entry ) => {
        const region_code = regionCodeMapping['SI']( entry );
        return region_code;
    },
    'TN2': ( entry ) => {
        
        const map = {
            'Ariana': '12',
            'Ben Arous': '13',
            'Kebili': '73',
            'Beja': '31',
            'Bizerte': '23',
            'Jendouba': '32',
            'Gafsa': '71',
            'Kasserine': '42',
            'Kairouan': '41',
            'Gabes': '81',
            'Sfax': '61',
            'Sousse': '51',
            'Manouba': '14',
            'Mahdia': '53',
            'Nabeul': '21',
            'Sidi Bouzid': '43',
            'Siliana': '34',
            'Monastir': '52',
            'Medenine': '82',
            'Le Kef': '33',
            'Tunis': '11',
            'Zaghouan': '22',
            'Tataouine': '83',
            'Tozeur': '72',
        };

        const admin_name = entry.admin_name_1;
    
        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            pbcopy( `'${ admin_name }': ` );
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'ME2': ( entry ) => {
        const map = {
            'Bar': '02',
            'Berane': '03',
            'Budva': '05',
            'Andrijevica': '01',
            'Herceg Novi': '08',
            'Kotor': '10',
            'Cetinje': '06',
            'Bijelo Polje': '04',
            'Kolasin': '09',
            'Danilovgrad': '07',
            'Rozaje': '17',
            'Pluzine': '15',
            'Tivat': '19',
            'Zabljak': '21',
            'Plav': '13',
            'Niksic': '12',
            'Pljevlja': '14',
            'Ulcinj': '20',
            'Podgorica': '16',
            'Savnik': '18',
        }

        const admin_name = entry.admin_name_1;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            pbcopy( `'${ admin_name }': ` );
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    },
    'EG2': ( entry ) => {
        const map = {
            'Damietta': 'DT',
            'Alexandria': 'ALX',
            'Cairo': 'C',
            'Al Sharqia': 'SHR',
            'Dakahlia': 'DK',
            'Faiyum': 'FYM',
            'Beni Suef': 'BNS',
            'Beheira': 'BH',
            'Aswan': 'ASN',
            'Asyut': 'AST',
            'Luxor': 'LX',
            'Kafr El-Sheikh': 'KFS',
            'Matrouh': 'MT',
            'Giza': 'GZ',
            'Monufia': 'MNF',
            'Minya': 'MN',
            'Gharbia': 'GH',
            'New Valley': 'WAD',
            'North Sinai': 'SIN',
            'Ismailia': 'IS',
            'Port Said': 'PTS',
            'Suez': 'SUZ',
            'Qalyubia': 'KB',
            'South Sinai': 'JS',
            'Sohag': 'SHG',
            'Qena': 'KN',
            'Red Sea': 'BA',
        }

        const admin_name = entry.admin_name_1;

        if ( map[ admin_name ] !== undefined ) {
            return map[ admin_name ];
        } else {
            pbcopy( `'${ admin_name }': ` );
            throw new Error( `Unknown region: ${ admin_name }` );
        }
    }
};

module.exports = regionCodeMapping;
