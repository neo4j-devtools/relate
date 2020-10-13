/* eslint-disable no-console */
import Help from '@oclif/plugin-help';
import {Topic, Command} from '@oclif/config';

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
    formatTopic(topic: Topic): string {
        const oclifHelp = super.formatTopic(topic);

        return `${fromViaToPattern('relate', 'topic', topic.name)}

${oclifHelp}
    `;
    }

    public showCommandHelp(command: Command) {
        const name = command.id;
        const depth = name.split(':').length;

        const subTopics = this.sortedTopics.filter(
            (t) => t.name.startsWith(`${name}:`) && t.name.split(':').length === depth + 1,
        );
        const subCommands = this.sortedCommands.filter(
            (c) => c.id.startsWith(`${name}:`) && c.id.split(':').length === depth + 1,
        );

        const colonIndex = command.id.indexOf(':');
        const topicName = command.id.slice(0, colonIndex);
        const commandName = command.id.slice(colonIndex + 1);

        const title = fromViaToPattern('relate', commandName, topicName);
        if (title) {
            console.log(`${title}\n`);
        }

        const description = command.description && this.render(command.description).split('\n')[0];
        if (description) {
            console.log(`${description}\n`);
        }

        console.log(this.formatCommand(command));
        console.log('');

        if (subTopics.length > 0) {
            console.log(this.formatTopics(subTopics));
            console.log('');
        }

        if (subCommands.length > 0) {
            console.log(this.formatCommands(subCommands));
            console.log('');
        }
    }
}
