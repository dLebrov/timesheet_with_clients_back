import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createRecordDto, updateRecordDto } from './dto/records.dto';
import { recordsDto } from 'src/swagger-dto/records.dto';
import { getRecordsIncludes } from './utils';

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRecordsService(): Promise<recordsDto[]> {
    return this.prisma.records.findMany({
      include: getRecordsIncludes(),
    });
  }

  async getRecordByIdService(id: number): Promise<recordsDto | null> {
    return this.prisma.records.findUnique({
      where: { id },
      include: getRecordsIncludes(),
    });
  }

  async createRecordService(data: createRecordDto): Promise<recordsDto> {
    return this.prisma.records.create({
      data,
      include: getRecordsIncludes(),
    });
  }

  async updateRecordService(
    id: number,
    data: updateRecordDto,
  ): Promise<recordsDto | null> {
    const existingRecord = await this.prisma.records.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return null;
    }

    return await this.prisma.records.update({
      where: { id },
      data,
      include: getRecordsIncludes(),
    });
  }
  async deleteRecordService(id: number): Promise<recordsDto | null> {
    return this.prisma.records.delete({
      where: { id },
      include: getRecordsIncludes(),
    });
  }

  // async deleteManyRecordServiceЬ(ids: number[]): Promise<number> {
  //   const result = await this.prisma.records.deleteMany({
  //     where: {
  //       id: {
  //         in: ids,
  //       },
  //     },
  //   });

  //   return result.count;
  // }
}
