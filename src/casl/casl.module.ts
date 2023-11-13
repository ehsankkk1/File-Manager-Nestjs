import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { FolderModule } from 'src/folder/folder.module';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
  imports: [FolderModule]
})
export class CaslModule {}