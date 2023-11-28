/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { AbilitiesModule } from 'src/abilities/abilities.module';
import { MulterModule } from '@nestjs/platform-express';


@Module({
    imports: [AbilitiesModule,
        MulterModule.register({ dest: './uploads' }),],
    controllers: [FileController],
    providers: [FileService],
})
export class FileModule { }
