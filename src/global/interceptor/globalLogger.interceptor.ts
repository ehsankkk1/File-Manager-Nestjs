// logging.interceptor.ts

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
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
                Logger.debug(`Method ${method} completed in ${Date.now() - now}ms`);
            }),
            catchError((error) => {
                Logger.error(`Error in ${method}`, error);
                return throwError(() => error);                // Log additional error tracking information here
            }),
        );
    }
}
