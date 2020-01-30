import {Output} from '@oclif/parser';

declare global {
    declare type ParsedInput<TFlags, TArgs = {[name: string]: string}> = Output<TFlags, TArgs>;
    declare type CommandUtils = {
        log: (message?: string | undefined, ...args: any[]) => void;
        debug: (...args: any[]) => void;
    };
}
