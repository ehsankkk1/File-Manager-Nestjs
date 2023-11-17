/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileAbilityFactory } from 'src/casl/file.ability.factory';
import { CaslModule } from 'src/casl/casl.module';

@Module({
    imports: [CaslModule],
    controllers: [FileController],
    providers: [FileService],
})
export class FileModule { }
