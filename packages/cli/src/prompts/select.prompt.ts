import {prompt} from 'enquirer';
import {Environment} from '@relate/common';

interface IChoice {
    name: string;
    message?: string;
    value?: string;
    hint?: string;
    disabled?: boolean | string;
}

export const selectPrompt = async (message: string, choices: string[] | IChoice[]): Promise<string> => {
    const {selection} = await prompt({
        choices,
        message,
        name: 'selection',
        type: 'select',
    });

    return selection;
};

export const selectDbmsPrompt = async (message: string, environment: Environment): Promise<string> => {
    const dbmss = await environment.listDbmss();

    return selectPrompt(
        message,
        dbmss.map((dbms) => ({
            message: `[${dbms.id.slice(0, 8)}] ${dbms.name}`,
            name: dbms.id,
        })),
    );
};
