import { Module } from '@nestjs/common';
import { ScientistService } from './scientist.service';
import { ScientistController } from './scientist.controller';

@Module({
  controllers: [ScientistController],
  providers: [ScientistService],
  exports: [ScientistService],
})
export class ScientistModule {}
