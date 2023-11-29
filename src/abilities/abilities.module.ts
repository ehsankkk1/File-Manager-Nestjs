import { Module, forwardRef } from '@nestjs/common';
import { FileAbilityFactory } from './file.ability.factory';
import { FolderModule } from 'src/folder/folder.module';
import { FileModule } from 'src/file/file.module';

@Module({
  providers: [FileAbilityFactory],
  exports: [FileAbilityFactory],
  imports: [FolderModule,forwardRef(() => FileModule)],
})
export class AbilitiesModule {}