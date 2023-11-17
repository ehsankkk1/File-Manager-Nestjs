/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, ForbiddenException, Get, Param, Query, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { JwtGuard } from '../auth/guard';
import { FileAbilityFactory } from 'src/casl/file.ability.factory';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { GetFileByFolderDto } from './dto';
import { CheckAbilities } from 'src/casl/decorator';
import { FileAbilityGuard } from 'src/file/guard';
import { Action } from 'src/casl/variables';

@UseGuards(JwtGuard)
@Controller('files')
export class FileController {
    constructor(
        private fileService: FileService,
        private abilityFactory: FileAbilityFactory
    ) { }

    @Get()
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Read, subject: "File" })
    async getFilesByFolderId(@GetUser() user: User, @Query() dto: GetFileByFolderDto) {

        return this.fileService.getFiles(user, dto);
    }
}
