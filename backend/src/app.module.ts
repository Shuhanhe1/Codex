import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
//import { PrismaModule } from './common/prisma/prisma.module';
import { ScientistModule } from './modules/scientist/scientist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    // PrismaModule,
    ScientistModule,
  ],
})
export class AppModule {}
