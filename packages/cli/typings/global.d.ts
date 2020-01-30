import {Output} from '@oclif/parser';

declare global {
    declare type ParsedInput<TFlags, TArgs = {[name: string]: string}> = Output<TFlags, TArgs>;
    declare type CommandUtils = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        log: (message?: string | undefined, ...args: any[]) => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        debug: (...args: any[]) => void;
    };
}
