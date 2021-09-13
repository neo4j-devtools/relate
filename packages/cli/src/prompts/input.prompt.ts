import {prompt} from 'enquirer';
import {IInputPromptOptions} from '../constants';

export const inputPrompt = async (message: string, options?: IInputPromptOptions): Promise<string> => {
    const {selection} = await prompt({
        message,
        initial: options?.initial,
        name: 'selection',
        type: 'input',
        required: options?.required !== false,
    });

    return selection;
};
