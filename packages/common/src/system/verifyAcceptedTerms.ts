import fse from 'fs-extra';
import path from 'path';
import readline from 'readline';

import {NotAllowedError} from '../errors';
import {envPaths} from '../utils';

const RELATE_ACCESS_CODE = 'r31473';
const LICENSE_NAME = 'Relate EAP';
const ACCEPTED_TERMS_PATH = path.join(envPaths().data, 'acceptedTerms');

export const acceptTerms = async (app: string): Promise<void> => {
    if (!app) {
        throw Error(`Must provide a name for the application accepting the ${LICENSE_NAME} terms`);
    }

    const acceptedTerms = await fse.pathExists(ACCEPTED_TERMS_PATH);
    if (acceptedTerms) {
        return;
    }

    if (!(await fse.pathExists(envPaths().data))) {
        await fse.ensureDir(envPaths().data);
    }

    await fse.writeFile(ACCEPTED_TERMS_PATH, `${LICENSE_NAME} (${app})`);
};

export const verifyAcceptedTerms = async (): Promise<void> => {
    const acceptedTerms = await fse.pathExists(ACCEPTED_TERMS_PATH);

    if (acceptedTerms) {
        return;
    }

    await new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
        });

        rl.question(
            'Enter the access code you received from applying at https://neo4j.relate.by/invite:',
            async (answer) => {
                if (answer === RELATE_ACCESS_CODE) {
                    await fse.writeFile(ACCEPTED_TERMS_PATH, LICENSE_NAME);

                    rl.close();
                    resolve();
                } else {
                    rl.close();
                    reject(
                        new NotAllowedError(
                            'Relate is available through an early access program. To request access visit https://neo4j.relate.by/invite',
                        ),
                    );
                }
            },
        );
    });
};
