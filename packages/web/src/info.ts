/* eslint-disable no-console */

import {infoWebModule} from './index';

infoWebModule()
    .then((healthInfo) => {
        console.log(JSON.stringify(healthInfo));
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
