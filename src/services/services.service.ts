import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { servicesDto } from 'src/swagger-dto/services.dto';
import { getServicesIncludes } from './utils';
import { createServiceDto, updateServiceDto } from './dto/services.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllServicesService(userId: number): Promise<servicesDto[]> {
    return this.prisma.services.findMany({
      where: { userId },
      include: getServicesIncludes(),
    });
  }

  async getServiceByIdService(
    id: number,
    userId: number,
  ): Promise<servicesDto | null> {
    return this.prisma.services.findFirst({
      where: { id, userId },
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
    userId: number,
  ): Promise<servicesDto | null> {
    const existingService = await this.prisma.services.findFirst({
      where: { id, userId },
    });

    if (!existingService) return null;

    return await this.prisma.services.update({
      where: { id },
      data,
      include: getServicesIncludes(),
    });
  }
  async deleteServiceService(
    id: number,
    userId: number,
  ): Promise<servicesDto | null> {
    const existingService = await this.prisma.services.findFirst({
      where: { id, userId },
      include: getServicesIncludes(),
    });

    if (!existingService) return null;

    return this.prisma.services.delete({
      where: { id },
      include: getServicesIncludes(),
    });
  }
}
