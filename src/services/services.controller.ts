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
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ServicesService } from './services.service';
import { servicesDto } from 'src/swagger-dto/services.dto';
import { createServiceDto, updateServiceDto } from './dto/services.dto';
import { validateDto } from 'src/utils';

@ApiTags('Услуги')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @Get()
  @ApiOperation({ summary: 'Получить все услуги' })
  @ApiResponse({
    status: 200,
    description: 'Получить все услуги',
    type: [servicesDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllServices(): Promise<servicesDto[]> {
    return this.servicesService.getAllServicesService();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить услугу по ID' })
  @ApiResponse({
    status: 200,
    description: 'Услуга найдена',
    type: servicesDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Услуга не найдена',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: String, description: 'ID услуги' })
  async getServiceById(
    @Param('id') id: string | undefined,
  ): Promise<servicesDto | null> {
    if (!id) {
      throw new BadRequestException('ID услуги не передан');
    }

    const result = await this.servicesService.getServiceByIdService(Number(id));

    if (result) {
      return result;
    } else {
      throw new NotFoundException(`Услуга не найдена`);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую услугу' })
  @ApiResponse({
    status: 201,
    description: 'Услуга успешно создан',
    type: servicesDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createService(
    @Body() data: createServiceDto,
    @Req() req: any,
  ): Promise<servicesDto> {
    const userId = req.user.id; // Получаем ID пользователя из запроса

    const dataWithId = { ...data, userId };

    const result = validateDto(createServiceDto, dataWithId);

    if (result.valid && result.data) {
      return this.servicesService.createServiceService(dataWithId);
    } else {
      throw new BadRequestException(
        result.errors.map((error) => error.message + ','),
      );
    }
  }

  @Post(':id')
  @ApiOperation({ summary: 'Обновить услугу по ID' })
  @ApiResponse({
    status: 200,
    description: 'Услуга успешно обновлена',
    type: servicesDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Услуга не найдена',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'ID услуги' })
  async updateService(
    @Param('id') id: string | undefined,
    @Body() data: updateServiceDto,
  ): Promise<servicesDto | null> {
    if (!id) {
      throw new BadRequestException('ID услуги не передан');
    }

    const result = validateDto(updateServiceDto, data);

    if (!result.valid || !result.data) {
      throw new BadRequestException(
        result.errors.map((error) => error.message + ','),
      );
    }

    const updatedService = await this.servicesService.updateServiceService(
      Number(id),
      result.data,
    );

    if (!updatedService) {
      throw new NotFoundException(`Услуга не найдена`);
    } else {
      return updatedService;
    }
  }

  @Post(':id/delete')
  @ApiOperation({ summary: 'Удалить услугу по ID' })
  @ApiResponse({
    status: 200,
    description: 'Услуга успешно удалена',
    type: servicesDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Услуга не найдена',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'ID услуги' })
  async deleteService(
    @Param('id') id: string | undefined,
  ): Promise<servicesDto | null> {
    if (!id) {
      throw new BadRequestException('ID услуги не передан');
    }

    const result = await this.servicesService.deleteServiceService(Number(id));

    if (result) {
      return result;
    } else {
      throw new NotFoundException(`Услуга не найдена`);
    }
  }
}
