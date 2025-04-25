import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { clientsDto } from 'src/swagger-dto/clients.dto';
import { getClientIncludes } from './utils';
import { createClientDto, updateClientDto } from './dto/clients.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllClientsService(): Promise<clientsDto[]> {
    return this.prisma.clients.findMany({
      include: getClientIncludes(),
    });
  }

  async getClientByIdService(id: number): Promise<clientsDto | null> {
    return this.prisma.clients.findUnique({
      where: { id },
      include: getClientIncludes(),
    });
  }

  async createClientService(data: createClientDto): Promise<clientsDto> {
    return this.prisma.clients.create({
      data,
      include: getClientIncludes(),
    });
  }

  async updateClientService(
    id: number,
    data: updateClientDto,
  ): Promise<clientsDto | null> {
    const existingClient = await this.prisma.clients.findUnique({
      where: { id },
    });

    if (!existingClient) {
      return null;
    }

    return this.prisma.clients.update({
      where: { id },
      data,
      include: getClientIncludes(),
    });
  }
  async deleteClientService(id: number): Promise<clientsDto | null> {
    return this.prisma.clients.delete({
      where: { id },
      include: getClientIncludes(),
    });
  }
}
