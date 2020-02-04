/* eslint-disable*/

const fs = require('fs-extra');
const path = require('path');
const {of, zip} = require('rxjs');
const {flatMap, groupBy, map, mergeMap, reduce, toArray} = require('rxjs/operators');
const treeify = require('object-treeify');

const allLicenses = require('./reader');

const notices = allLicenses.pipe(
    flatMap(Object.entries),
    groupBy(([, {licenses}]) => licenses),
    mergeMap((group) => zip(of(group.key), group.pipe(toArray()))),
    reduce((agg, [license, packages]) => ({...agg, [license]: formatNotices(packages)}), {}),
    map(treeify),
);

const NOTICE_HEADER = path.join(__dirname, '../static_data/NOTICE_HEADER.txt');
const NOTICE = path.join(process.cwd(), 'NOTICE.txt');
const noticeStream = fs.createWriteStream(NOTICE, 'utf8');
const noticeHeader = fs.readFileSync(NOTICE_HEADER, 'utf8');

noticeStream.write(`${noticeHeader}\n\n`);

notices.subscribe({
    next(data) {
        noticeStream.write(`${data}\n\n`);
    },
    complete() {
        noticeStream.end();
    },
    error() {
        noticeStream.end();
    },
});

function formatNotices(packages) {
    return packages.reduce(
        (agg, [packageName, {url, repository, publisher}]) => ({
            ...agg,
            [packageName]: url ? {url, repository, publisher} : {repository, publisher},
        }),
        {},
    );
}
