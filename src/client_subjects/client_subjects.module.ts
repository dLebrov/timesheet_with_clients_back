import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Client_subjectsService } from './client_subjects.service';
import { Client_subjectsController } from './client_subjects.controller';

@Module({
  imports: [PrismaModule],
  controllers: [Client_subjectsController],
  providers: [Client_subjectsService],
})
export class Client_subjectsModule {}
