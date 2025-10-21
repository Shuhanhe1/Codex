import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScientistService } from './scientist.service';
import { ScientistController } from './scientist.controller';

@Module({
  imports: [HttpModule],
  controllers: [ScientistController],
  providers: [ScientistService],
  exports: [ScientistService],
})
export class ScientistModule {}
