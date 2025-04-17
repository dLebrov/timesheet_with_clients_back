import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { clientsDto } from 'src/swagger-dto/clients.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { createClientDto, updateClientDto } from './dto/clients.dto';

@ApiTags('Клиенты')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}
  @Get()
  @ApiOperation({ summary: 'Получить всех клиентов' })
  @ApiResponse({
    status: 200,
    description: 'Список всех клиентов',
    type: [clientsDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllClients(): Promise<clientsDto[]> {
    return this.clientsService.getAllClientsService();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить клиента по ID' })
  @ApiResponse({
    status: 200,
    description: 'Клиент найден',
    type: clientsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Клиент не найден',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: String, description: 'ID клиента' })
  async getClientById(
    @Param('id') id: string | undefined,
  ): Promise<clientsDto | null> {
    if (!id) {
      throw new BadRequestException('ID клиента не передан');
    }

    return this.clientsService.getClientByIdService(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Создать нового клиента' })
  @ApiResponse({
    status: 201,
    description: 'Клиент успешно создан',
    type: clientsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createClient(
    @Body() data: createClientDto,
    @Req() req: any,
  ): Promise<clientsDto> {
    const userId = req.user.id; // Получаем ID пользователя из запроса

    return this.clientsService.createClientService({ ...data, userId });
  }

  @Post(':id')
  @ApiOperation({ summary: 'Обновить клиента по ID' })
  @ApiResponse({
    status: 200,
    description: 'Клиент успешно обновлен',
    type: clientsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Клиент не найден',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'ID клиента' })
  async updateClient(
    @Param('id') id: string | undefined,
    @Body() data: updateClientDto,
  ): Promise<clientsDto | null> {
    if (!id) {
      throw new BadRequestException('ID клиента не передан');
    }

    const updatedClient = await this.clientsService.updateClientService(
      Number(id),
      data,
    );

    if (!updatedClient) {
      throw new NotFoundException(`Клиент не найден`);
    } else {
      return updatedClient;
    }
  }

  @Post(':id/delete')
  @ApiOperation({ summary: 'Удалить клиента по ID' })
  @ApiResponse({
    status: 200,
    description: 'Клиент успешно удален',
    type: clientsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Клиент не найден',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'ID клиента' })
  async deleteClient(
    @Param('id') id: string | undefined,
  ): Promise<clientsDto | null> {
    if (!id) {
      throw new BadRequestException('ID клиента не передан');
    }

    return this.clientsService.deleteClientService(Number(id));
  }
}
