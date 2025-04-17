import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
