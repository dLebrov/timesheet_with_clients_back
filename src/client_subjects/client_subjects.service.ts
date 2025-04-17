import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { client_subjectsDto } from 'src/swagger-dto/client_subjects.dto';
import {
  createClient_subjectsDto,
  updateClient_subjectsDto,
} from './dto/client_subjects.dto';
import { getClient_subjectsIncludes } from './utils';

@Injectable()
export class Client_subjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllClient_subjectsService(): Promise<client_subjectsDto[]> {
    return this.prisma.client_subjects.findMany({
      include: getClient_subjectsIncludes(),
    });
  }

  async getClient_subjectByIdService(
    id: number,
  ): Promise<client_subjectsDto | null> {
    return this.prisma.client_subjects.findUnique({
      where: { id },
      include: getClient_subjectsIncludes(),
    });
  }

  async getClient_subjectsByClientIdService(
    id: number,
  ): Promise<client_subjectsDto[] | null> {
    return this.prisma.client_subjects.findMany({
      where: { clientId: id },
      include: getClient_subjectsIncludes(),
    });
  }

  async getClient_subjectsBySubjectIdService(
    id: number,
  ): Promise<client_subjectsDto[] | null> {
    return this.prisma.client_subjects.findMany({
      where: { subjectId: id },
      include: getClient_subjectsIncludes(),
    });
  }

  async createClient_subjectService(
    data: createClient_subjectsDto,
  ): Promise<client_subjectsDto> {
    return this.prisma.client_subjects.create({
      data,
      include: getClient_subjectsIncludes(),
    });
  }

  async updateClient_subjectService(
    id: number,
    data: updateClient_subjectsDto,
  ): Promise<client_subjectsDto | null> {
    const existingSubject = await this.prisma.client_subjects.findUnique({
      where: { id },
    });

    if (!existingSubject) {
      return null;
    }

    return await this.prisma.client_subjects.update({
      where: { id },
      data,
      include: getClient_subjectsIncludes(),
    });
  }
  async deleteClient_subjectService(
    id: number,
  ): Promise<client_subjectsDto | null> {
    return this.prisma.client_subjects.delete({
      where: { id },
      include: getClient_subjectsIncludes(),
    });
  }

  // async deleteManyClient_subjectsService(ids: number[]): Promise<number> {
  //   const result = await this.prisma.client_subjects.deleteMany({
  //     where: {
  //       id: {
  //         in: ids,
  //       },
  //     },
  //   });

  //   return result.count;
  // }
}
