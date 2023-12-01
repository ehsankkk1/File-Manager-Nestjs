import { Module, forwardRef } from '@nestjs/common';
import { FileAbilityFactory } from './file.ability.factory';
import { FolderModule } from 'src/folder/folder.module';
import { FileModule } from 'src/file/file.module';
import { FolderAbilityFactory } from './folder.ability.factory';

@Module({
  providers: [FileAbilityFactory, FolderAbilityFactory],
  exports: [FileAbilityFactory, FolderAbilityFactory],
  imports: [forwardRef(() => FolderModule), forwardRef(() => FileModule)],
})
export class AbilitiesModule { }