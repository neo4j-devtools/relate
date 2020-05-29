import {prompt} from 'enquirer';

export const inputPrompt = async (message: string, initial?: string, required: boolean = false): Promise<string> => {
    const {selection} = await prompt({
        message,
        initial,
        name: 'selection',
        type: 'input',
        required,
    });

    return selection;
};
