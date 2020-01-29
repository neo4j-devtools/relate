import {Injectable} from '@nestjs/common';

@Injectable()
export class HelloService {
    getHello(): string {
        return 'Hello World!';
    }

    getGoodbye(): string {
        return 'Goodbye World!';
    }
}
