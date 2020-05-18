import {prompt} from 'enquirer';

export const inputPrompt = async (message: string, initial?: string): Promise<string> => {
    const {selection} = await prompt({
        message,
        initial,
        name: 'selection',
        type: 'input',
    });

    return selection;
};
