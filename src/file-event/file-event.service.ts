import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileEventEnum } from './enum';
import { LoggingInterceptor } from 'src/global/interceptor/globalLogger.interceptor';

@Injectable()
export class FileEventService {

    constructor(private prisma: PrismaService) { }

    @UseInterceptors(LoggingInterceptor)
    createFileEvent(fileEvent: FileEventEnum, user: User, id: number) {
        return this.prisma.fileEvent.create({
            data: {
                eventName: fileEvent,
                user: {
                    connect: {
                        id: user.id,
                    }
                },
                file: {
                    connect: {
                        id: id,
                    }
                }
            }
        });
    }

}
