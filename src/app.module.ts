import { FolderModule } from './folder/folder.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { AbilitiesModule } from './abilities/abilities.module';
@Module({
  imports: [
    FolderModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    FileModule,
    AbilitiesModule,
  ],
})
export class AppModule { }
