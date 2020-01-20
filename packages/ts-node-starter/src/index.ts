import server from './server';

import {HTTP_PORT} from './constants/server';

server.listen(HTTP_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server listening on port ${HTTP_PORT}!`);
});
