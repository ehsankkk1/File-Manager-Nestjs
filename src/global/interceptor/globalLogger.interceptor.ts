// logging.interceptor.ts

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadGatewayException,
    Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = context.getHandler().name;
        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                Logger.log(`Method ${method} completed in ${Date.now() - now}ms`);
            }),
            catchError((error) => {
                Logger.error(`Error in ${method}:`, error);

                // Log additional error tracking information here
                // For example, you can log request and response details
                //Logger.error(`The Request is ${request}:`);

                // Rethrow the error to propagate it to the next handler
                return throwError(new BadGatewayException('Something went wrong'));
            }),
        );
    }
}
