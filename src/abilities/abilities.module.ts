import { Module } from '@nestjs/common';
import { FileAbilityFactory } from './file.ability.factory';
import { FolderModule } from 'src/folder/folder.module';

@Module({
  providers: [FileAbilityFactory],
  exports: [FileAbilityFactory],
  imports: [FolderModule]
})
export class AbilitiesModule {}