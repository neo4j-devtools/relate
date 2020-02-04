/* eslint-disable*/

const fs = require('fs-extra');
const path = require('path');
const {of, zip} = require('rxjs');
const {filter, flatMap, groupBy, map, mergeMap, toArray} = require('rxjs/operators');

const allLicenses = require('./reader');

const licenses = allLicenses.pipe(
    flatMap(Object.entries),
    filter(([, {licenseFile}]) => Boolean(licenseFile)),
    flatMap(([name, package]) => fs.readFile(package.licenseFile, 'utf8').then((license) => [name, package, license])),
    groupBy(([, , license]) => license),
    mergeMap((group) => zip(of(group.key), group.pipe(toArray()))),
    map(formatLicense),
);

const LICENSE_HEADER = path.join(__dirname, '../static_data/LICENSES_HEADER.txt');
const LICENSES = path.join(process.cwd(), 'LICENSES.txt');
const licenseStream = fs.createWriteStream(LICENSES, 'utf8');
const licenseHeader = fs.readFileSync(LICENSE_HEADER, 'utf8');

licenseStream.write(`${licenseHeader}\n\n`);

licenses.subscribe({
    next(data) {
        licenseStream.write(`${data}\n\n`);
    },
    complete() {
        licenseStream.end();
    },
    error() {
        licenseStream.end();
    },
});

function formatLicense([license, packages]) {
    return `
The following software may be included in this product: ${packages.map(([packageName]) => packageName).join(', ')}.
A copy of the source code may be downloaded from ${packages
        .map(([packageName, {repository}]) => `${repository} (${packageName})`)
        .join(', ')}. 
This software contains the following license and notice below:

${license}

-----
    `;
}
