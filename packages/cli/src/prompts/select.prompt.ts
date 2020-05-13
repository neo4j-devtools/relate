import {prompt} from 'enquirer';
import {IDbms} from '@relate/common';

interface Choice {
    name: string;
    message?: string;
    value?: string;
    hint?: string;
    disabled?: boolean | string;
}

export const selectPrompt = async (message: string, choices: string[] | Choice[]): Promise<string> => {
    const {selection} = await prompt({
        message,
        choices,
        name: 'selection',
        type: 'select',
    });

    return selection;
};

export const selectDbmsPrompt = (message: string, dbmss: IDbms[]): Promise<string> => {
    return selectPrompt(
        message,
        dbmss.map((dbms) => ({
            name: dbms.id,
            message: `[${dbms.id.slice(0, 8)}] ${dbms.name}`,
        })),
    );
};
