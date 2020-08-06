import {ErrorAbstract} from './error.abstract';

export class DbmsUpgradeError extends ErrorAbstract {
    constructor(message: string, upstreamError?: string, actions: string[] = []) {
        const msg = upstreamError ? `${message}.\n\nUpstream error:\n${upstreamError}\n` : message;

        super(msg, actions);
    }
}
