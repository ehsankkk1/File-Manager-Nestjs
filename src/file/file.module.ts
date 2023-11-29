/*
https://docs.nestjs.com/modules
*/

import { Module, forwardRef } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { AbilitiesModule } from 'src/abilities/abilities.module';
import { MulterModule } from '@nestjs/platform-express';
import { FileEventModule } from 'src/file-event/file-event.module';


@Module({
    imports: [
        forwardRef(() => AbilitiesModule) ,
        MulterModule.register({ dest: './uploads' }),
        FileEventModule,
        
    ],
    controllers: [FileController],
    providers: [FileService],
    exports: [FileService]
})
export class FileModule { }
