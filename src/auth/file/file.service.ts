/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileService {
    constructor(private prisma: PrismaService) { }

    getFiles() {
        return this.prisma.file.findMany();
    }

}
