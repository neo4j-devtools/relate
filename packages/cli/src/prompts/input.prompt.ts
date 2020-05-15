import {prompt} from 'enquirer';

export const inputPrompt = async (message: string, initial?: string): Promise<string> => {
    const {selection} = await prompt({
        initial,
        message,
        name: 'selection',
        type: 'input',
    });

    return selection;
};
