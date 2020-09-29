import * as FileType from 'file-type';
import {GraphQLError, GraphQLScalarType} from 'graphql';
import {Readable} from 'stream';
import path from 'path';
import {envPaths, FileUploadError} from '@relate/common';
import fse from 'fs-extra';
import {v4 as uuidv4} from 'uuid';

export interface IFileUploadInput {
    filename: string;
    mimetype: string;
    encoding: string;
    path?: string;
    createReadStream: () => Readable;
}

export interface IFileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    path: string;
}

export const GraphQLUpload = new GraphQLScalarType({
    name: 'Upload',
    description: 'The `Upload` scalar type represents a file upload.',
    async parseValue(value: Promise<IFileUploadInput>): Promise<IFileUpload> {
        const upload = await value;
        const tmpFileDir = path.join(envPaths().tmp, uuidv4());

        await fse.ensureDir(tmpFileDir);

        // if we are coming from the sofa REST API the file has already been flushed to disk
        if (upload.path) {
            const uploadedFilePath = path.join(tmpFileDir, upload.filename);

            await fse.move(upload.path, uploadedFilePath);

            return {
                ...upload,
                path: uploadedFilePath,
            };
        }

        const stream = upload.createReadStream();
        const fileType = await FileType.fromStream(stream);

        if (fileType?.mime !== upload.mimetype) {
            throw new GraphQLError('Mime type does not match file content.');
        }

        const tmpFilePath = path.join(tmpFileDir, `${uuidv4()}.rdownload`);

        try {
            const uploadPromise = new Promise((resolve, reject) =>
                stream
                    .pipe(fse.createWriteStream(tmpFilePath))
                    .on('finish', () => resolve())
                    .on('error', (err) => reject(err)),
            );

            await uploadPromise;

            const uploadedFilePath = path.join(tmpFileDir, upload.filename);

            await fse.move(tmpFilePath, uploadedFilePath);

            return {
                ...upload,
                path: uploadedFilePath,
            };
        } catch (e) {
            throw new FileUploadError(`Failed to upload file ${upload.filename}: ${e.message}`);
        }
    },
    parseLiteral(ast): void {
        throw new GraphQLError('Upload literal unsupported.', ast);
    },
    serialize(value: IFileUpload): IFileUpload {
        // sofa-api calls .serialize() on GraphQL scalars
        return {
            filename: value.filename,
            mimetype: value.mimetype,
            encoding: value.encoding,
            path: value.path,
        };
    },
});
