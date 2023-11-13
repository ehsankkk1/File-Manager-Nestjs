/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, ForbiddenException, Get, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { JwtGuard } from '../guard';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { GetUser } from '../decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('files')
export class FileController {
    constructor(
        private fileService: FileService,
        private abilityFactory: CaslAbilityFactory
    ) { }

    @Get()
    async getFiles(@GetUser() user: User) {
        const ability = this.abilityFactory.defineAbility(user);

        const isAllowed = (await ability).can(Action.Read, "User");

        if (!isAllowed) {
            throw new ForbiddenException();
        }

        return this.fileService.getFiles();
    }
}
