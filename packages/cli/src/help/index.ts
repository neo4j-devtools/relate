/* eslint-disable no-console */
import {Interfaces, Help} from '@oclif/core';

import chalk from 'chalk';

const fromViaToPattern = (from: string, via: string, to: string) => {
    const relationship = via.length > 0 ? chalk`{cyan -[}${via}{cyan ]->}` : chalk`{cyan -->}`;
    return chalk`{blue (}${from}{blue )}${relationship}{green (}${to}{green )}`;
};

export default class RelateHelpClass extends Help {
    // the formatting responsible for the header
    // displayed for the root help
    formatRoot(): string {
        const oclifHelp = super.formatRoot();

        return `${fromViaToPattern('relate', 'by', 'neo4j')}

${oclifHelp}`;
    }

    // the formatting for an individual topic
    formatTopic(topic: Interfaces.Topic): string {
        const oclifHelp = super.formatTopic(topic);

        return `${fromViaToPattern('relate', 'topic', topic.name)}

${oclifHelp}
    `;
    }
}
