import {getParseLaunchTokenPayload} from './utils';
import {APP_LAUNCH_DATA_RESOLVER, DEFAULT_CLIENT_REMOTE} from './constants';

export interface IAppLaunchData {
    accessToken?: string;
    dbms: {
        id: string;
        name: string;
        connectionUri: string;
    };
    principal?: string;
    project?: {
        name: string;
    };
}

export interface IRelateClientConfig {
    appName: string;
    remote: string;
}

export class RelateClient {
    private readonly config: IRelateClientConfig;

    constructor(config: Omit<IRelateClientConfig, 'remote'>) {
        this.config = {
            remote: DEFAULT_CLIENT_REMOTE,
            ...config,
        };
    }

    getAppLaunchData(launchToken: string): Promise<IAppLaunchData> {
        const payload = getParseLaunchTokenPayload(this.config.appName, launchToken);

        return fetch(this.config.remote, {
            body: JSON.stringify(payload),
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed');
                }

                return res.json();
            })
            .then(({data}) => data)
            .then((data) => {
                if (!data[APP_LAUNCH_DATA_RESOLVER]) {
                    throw new Error('Unable to parse App Launch Token');
                }

                return data[APP_LAUNCH_DATA_RESOLVER];
            });
    }
}
