import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getSubjectsIncludes } from './utils';
import { subjectsDto } from 'src/swagger-dto/subjects.dto';
import { createSubjectDto, updateSubjectDto } from './dto/subjects.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSubjectsService(): Promise<subjectsDto[]> {
    return this.prisma.subjects.findMany({
      include: getSubjectsIncludes(),
    });
  }

  async getSubjectByIdService(id: number): Promise<subjectsDto | null> {
    return this.prisma.subjects.findUnique({
      where: { id },
      include: getSubjectsIncludes(),
    });
  }

  async createSubjectService(data: createSubjectDto): Promise<subjectsDto> {
    return this.prisma.subjects.create({
      data,
      include: getSubjectsIncludes(),
    });
  }

  async updateSubjectService(
    id: number,
    data: updateSubjectDto,
  ): Promise<subjectsDto | null> {
    const existingSubject = await this.prisma.subjects.findUnique({
      where: { id },
    });

    if (!existingSubject) {
      return null;
    }

    return await this.prisma.subjects.update({
      where: { id },
      data,
      include: getSubjectsIncludes(),
    });
  }
  async deleteSubjectService(id: number): Promise<subjectsDto | null> {
    return this.prisma.subjects.delete({
      where: { id },
      include: getSubjectsIncludes(),
    });
  }

  // async deleteManySubjectsService(ids: number[]): Promise<number> {
  //   const result = await this.prisma.subjects.deleteMany({
  //     where: {
  //       id: {
  //         in: ids,
  //       },
  //     },
  //   });

  //   return result.count;
  // }
}
