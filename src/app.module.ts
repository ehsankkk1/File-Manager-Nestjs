import { FolderModule } from './folder/folder.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { AbilitiesModule } from './abilities/abilities.module';
import { FileEventModule } from './file-event/file-event.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    FolderModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
    }),    
    UserModule,
    FileModule,
    AbilitiesModule,
    FileEventModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule { }
