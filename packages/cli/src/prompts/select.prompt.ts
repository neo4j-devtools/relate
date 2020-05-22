import _ from 'lodash';
import {prompt} from 'enquirer';
import {Environment, IExtensionMeta, NotFoundError} from '@relate/common';

import {DBMS_FILTERS} from '../constants';

interface IChoice {
    name: string;
    message?: string;
    value?: string;
    hint?: string;
    disabled?: boolean | string;
}

export const selectPrompt = async (message: string, choices: string[] | IChoice[]): Promise<string> => {
    const {selection} = await prompt({
        message,
        choices,
        name: 'selection',
        type: 'select',
    });

    return selection;
};

export const selectDbmsPrompt = async (
    message: string,
    environment: Environment,
    filter?: DBMS_FILTERS,
): Promise<string> => {
    let dbmss = await environment.listDbmss();
    if (filter) {
        const statusDbmss = await environment.statusDbmss(_.map(dbmss, (dbms) => dbms.id));
        dbmss = _.compact(
            _.map(dbmss, (dbms, index) => {
                if (_.includes(statusDbmss[index], filter)) {
                    return dbms;
                }
            }),
        );
    }

    if (!dbmss.length) {
        if (!filter) {
            throw new NotFoundError('No DBMS is installed', ['Run "relate dbms:install" and try again']);
        }
        throw new NotFoundError(`All DBMSs are currently ${filter === DBMS_FILTERS.START ? 'running' : 'stopped'}`);
    }

    return selectPrompt(
        message,
        dbmss.map((dbms) => ({
            name: dbms.id,
            message: `[${dbms.id.slice(0, 8)}] ${dbms.name}`,
        })),
    );
};

export const selectAppPrompt = async (message: string, installedApps: IExtensionMeta[]): Promise<string> => {
    return selectPrompt(
        message,
        installedApps.map((app) => ({
            name: app.name,
            message: app.name,
        })),
    );
};
