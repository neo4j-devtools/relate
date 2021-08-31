import {prompt} from 'enquirer';
import {IPromptSelection} from '../constants';
import {readStdin, isInteractive} from '../stdin';

export const passwordPrompt = async (message: string): Promise<string> => {
    if (!isInteractive()) {
        return readStdin();
    }

    const {selection} = await prompt<IPromptSelection<string>>({
        message,
        name: 'selection',
        type: 'invisible',
    });

    return selection;
};
