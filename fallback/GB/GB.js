const { getFileContentStream } = require("../../src/utils");

module.exports = {
  getEntries: async ( path ) => {
    const csvEngland = await getFileContentStream('./fallback/GB/rawEngland.csv', 'GB-ENG')
    const csvScotland = await getFileContentStream('./fallback/GB/rawScotland.csv', 'GB-SCT')
    const csvWales = await getFileContentStream('./fallback/GB/rawScotland.csv', 'GB-WLS')
    const csvNorthernIreland = await getFileContentStream('./fallback/GB/rawScotland.csv', 'GB-NIR')
    const greatBritainArray = [...csvEngland, ...csvScotland, ...csvWales, ...csvNorthernIreland]

    return greatBritainArray;
},
source: 'https://www.doogal.co.uk/PostcodeDownloads'
}