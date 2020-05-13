import {prompt} from 'enquirer';

export const passwordPrompt = async (message: string): Promise<string> => {
    const {selection} = await prompt({
        message,
        name: 'selection',
        type: 'invisible',
    });

    return selection;
};
