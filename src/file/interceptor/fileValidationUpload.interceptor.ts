// validation.interceptor.ts

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { validate } from 'class-validator';
import { CheckFileNotEmptyDto } from '../dto';

@Injectable()
export class FileValidationUploadInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {

        // get the request using context
        const request = context.switchToHttp().getRequest();

        // check if the request have file
        const dtow = new CheckFileNotEmptyDto();
        dtow.file = request.file;
        const errors = await validate(dtow);

        // throw all dto errors
        if (errors.length > 0) {
            const validationErrors = errors.map((error) => ({
                property: error.property,
                constraints: error.constraints,
            }));
            throw new BadRequestException({ message: 'Validation failed', errors: validationErrors });
        }

        // check file size 
        if (request.file.size > 300000000) {
            throw new BadRequestException('File size exceeds maximum limit');
        }

        return next.handle();
    }
}
