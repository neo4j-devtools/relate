import {prompt} from 'enquirer';
import {IInputPromptOptions} from '../constants';

export const inputPrompt = async (message: string, options?: IInputPromptOptions): Promise<string> => {
    const {selection} = await prompt({
        message,
        initial: options?.initial,
        name: 'selection',
        type: 'input',
        // eslint-disable-next-line no-unneeded-ternary
        required: options?.required === false ? false : true,
    });

    return selection;
};
