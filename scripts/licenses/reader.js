/* eslint-disable*/

const fs = require('fs-extra');
const path = require('path');
const {of} = require('rxjs');
const {combineAll, filter, flatMap, map, reduce, share} = require('rxjs/operators');
const checker = require('license-checker');

const checkerOptions = {
    production: true,
    summary: true
};

const getDepLicenses = (start) => {
    return new Promise((res) => checker.init({...checkerOptions, start}, (err, data) => res(err ? {} : data)));
};

const DAEDALUS_REPO = 'https://github.com/neo4j-technology/daedalus';
const CWD = path.resolve(process.cwd());
const PACKAGES = path.join(CWD, '/packages');
const allPackages = fs.readdirSync(PACKAGES).map((p) => path.join(PACKAGES, p));

module.exports = of(allPackages).pipe(
    flatMap((foo) => [CWD, ...foo]),
    filter((p) => fs.statSync(p).isDirectory()),
    map(getDepLicenses),
    combineAll(),
    map((all) => all.reduce((agg, next) => ({...agg, ...next}), {})),
    flatMap(Object.entries),
    // exclude our own packages, covered by root license
    reduce((agg, [key, val]) => (val.repository === DAEDALUS_REPO ? agg : {...agg, [key]: val}), {}),
    share(),
);
