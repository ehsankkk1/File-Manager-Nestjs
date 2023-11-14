/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetFileByFolderDto } from './dto';

@Injectable()
export class FileService {
    constructor(private prisma: PrismaService,
        private abilityFactory: CaslAbilityFactory
    ) { }

    async getFiles(user: User, dto: GetFileByFolderDto) {

        return this.prisma.file.findMany({
            where: {
                folderId: dto.folderId,
            }
        });
    }

}
