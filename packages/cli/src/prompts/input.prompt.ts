import {prompt} from 'enquirer';

export const inputPrompt = async (message: string, options?: {required: boolean}): Promise<string> => {
    const {selection} = await prompt({
        message,
        name: 'selection',
        type: 'input',
        required: options?.required || false
    });

    return selection;
};
