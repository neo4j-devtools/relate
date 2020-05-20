import {prompt} from 'enquirer';
import {Environment, IExtensionMeta, NotFoundError} from '@relate/common';

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

export const selectDbmsPrompt = async (message: string, environment: Environment): Promise<string> => {
    const dbmss = await environment.listDbmss();

    if (!dbmss.length) {
        throw new NotFoundError('No DBMS is installed', ['Run "relate dbms:install" and try again']);
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
