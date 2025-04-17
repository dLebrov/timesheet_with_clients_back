import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ServicesModule } from './services/services.module';
import { RecordsModule } from './records/records.module';
import { SubjectsModule } from './subjects/subjects.module';
import { Client_subjectsModule } from './client_subjects/client_subjects.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ClientsModule,
    ServicesModule,
    RecordsModule,
    SubjectsModule,
    Client_subjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
