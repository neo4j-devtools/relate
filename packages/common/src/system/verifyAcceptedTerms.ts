import fse from 'fs-extra';
import path from 'path';
import readline from 'readline';

import {NotAllowedError} from '../errors';
import {envPaths} from '../utils';

const RELATE_ACCESS_CODE = 'r31473';

export const verifyAcceptedTerms = async (): Promise<void> => {
    const acceptedTermsPath = path.join(envPaths().data, 'acceptedTerms');
    const acceptedTerms = await fse.pathExists(acceptedTermsPath);

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
                    await fse.writeFile(acceptedTermsPath, 'Relate EAP');

                    rl.close();
                    resolve();
                } else {
                    rl.close();
                    reject(
                        new NotAllowedError(
                            'Relate is available through an early access program. To request access visit http://neo4j.relate.by/invite',
                        ),
                    );
                }
            },
        );
    });
};
