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
import {
  createClientDto,
  createClientParamsDto,
  updateClientDto,
} from './dto/clients.dto';
import { validateDto } from 'src/utils';

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

    const result = await this.clientsService.getClientByIdService(Number(id));

    if (result) {
      return result;
    } else {
      throw new NotFoundException(`Клиент не найден`);
    }
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
    @Body() data: createClientParamsDto,
    @Req() req: any,
  ): Promise<clientsDto> {
    const userId = req.user.id; // Получаем ID пользователя из запроса

    const dataWithUserId = { ...data, userId };

    const result = validateDto(createClientDto, dataWithUserId);

    if (result.valid && result.data) {
      return this.clientsService.createClientService(
        result.data as typeof dataWithUserId,
      );
    } else {
      throw new BadRequestException(
        result.errors.map((error) => error.message + ','),
      );
    }
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

    const result = validateDto(updateClientDto, data);

    if (!result.valid || !result.data) {
      throw new BadRequestException(
        result.errors.map((error) => error.message + ','),
      );
    }

    const updatedClient = await this.clientsService.updateClientService(
      Number(id),
      result.data,
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

    const deletedClient = await this.clientsService.deleteClientService(
      Number(id),
    );

    if (!deletedClient) {
      throw new NotFoundException(`Клиент не найден`);
    } else {
      return deletedClient;
    }
  }
}
