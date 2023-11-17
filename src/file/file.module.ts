/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileAbilityFactory } from 'src/abilities/file.ability.factory';
import { AbilitiesModule } from 'src/abilities/abilities.module';

@Module({
    imports: [AbilitiesModule],
    controllers: [FileController],
    providers: [FileService],
})
export class FileModule { }
