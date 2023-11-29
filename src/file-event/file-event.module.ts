import { Module } from '@nestjs/common';
import { FileEventController } from './file-event.controller';
import { FileEventService } from './file-event.service';

@Module({
  controllers: [FileEventController],
  providers: [FileEventService],
  exports: [FileEventService]
})
export class FileEventModule {}
