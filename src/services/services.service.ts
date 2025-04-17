import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { servicesDto } from 'src/swagger-dto/services.dto';
import { getServicesIncludes } from './utils';
import { createServiceDto, updateServiceDto } from './dto/services.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllServicesService(): Promise<servicesDto[]> {
    return this.prisma.services.findMany({
      include: getServicesIncludes(),
    });
  }

  async getServiceByIdService(id: number): Promise<servicesDto | null> {
    return this.prisma.services.findUnique({
      where: { id },
      include: getServicesIncludes(),
    });
  }

  async createServiceService(
    data: Omit<createServiceDto, 'userId'> & { userId: number },
  ): Promise<servicesDto> {
    return this.prisma.services.create({
      data,
      include: getServicesIncludes(),
    });
  }

  async updateServiceService(
    id: number,
    data: updateServiceDto,
  ): Promise<servicesDto | null> {
    const existingService = await this.prisma.services.findUnique({
      where: { id },
    });

    if (!existingService) {
      return null;
    }

    return await this.prisma.services.update({
      where: { id },
      data,
      include: getServicesIncludes(),
    });
  }
  async deleteServiceService(id: number): Promise<servicesDto | null> {
    return this.prisma.services.delete({
      where: { id },
      include: getServicesIncludes(),
    });
  }
}
