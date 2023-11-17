/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { FileAbilityFactory } from 'src/casl/file.ability.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetFileByFolderDto } from './dto';

@Injectable()
export class FileService {
    constructor(private prisma: PrismaService,
        private abilityFactory: FileAbilityFactory
    ) { }

    async getFiles(user: User, dto: GetFileByFolderDto) {

        return this.prisma.file.findMany({
            where: {
                folderId: dto.folderId,
            }
        });
    }

}
