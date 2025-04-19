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
import { RecordsService } from './records.service';
import { recordsDto } from 'src/swagger-dto/records.dto';
import { createRecordDto, updateRecordDto } from './dto/records.dto';
import { validateDto } from 'src/utils';

@ApiTags('Записи')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}
  @Get()
  @ApiOperation({ summary: 'Получить все записи' })
  @ApiResponse({
    status: 200,
    description: 'Получить все записи',
    type: [recordsDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllRecords(): Promise<recordsDto[]> {
    return this.recordsService.getAllRecordsService();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить запись по ID' })
  @ApiResponse({
    status: 200,
    description: 'Запись найдена',
    type: recordsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Запись не найдена',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: String, description: 'ID записи' })
  async getRecordById(
    @Param('id') id: string | undefined,
  ): Promise<recordsDto | null> {
    if (!id) {
      throw new BadRequestException('ID записи не передан');
    }

    const result = await this.recordsService.getRecordByIdService(Number(id));

    if (result) {
      return result;
    } else {
      throw new NotFoundException(`Запись не найдена`);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую запись' })
  @ApiResponse({
    status: 201,
    description: 'Запись успешно создан',
    type: recordsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createRecord(@Body() data: createRecordDto): Promise<recordsDto> {
    const result = validateDto(createRecordDto, data);

    if (result.valid && result.data) {
      return this.recordsService.createRecordService(result.data);
    } else {
      throw new BadRequestException(
        result.errors.map((error) => error.message + ','),
      );
    }
  }

  @Post(':id')
  @ApiOperation({ summary: 'Обновить запись по ID' })
  @ApiResponse({
    status: 200,
    description: 'Запись успешно обновлена',
    type: recordsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Запись не найдена',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'ID записи' })
  async updateRecord(
    @Param('id') id: string | undefined,
    @Body() data: updateRecordDto,
  ): Promise<recordsDto | null> {
    if (!id) {
      throw new BadRequestException('ID записи не передан');
    }

    const result = validateDto(updateRecordDto, data);

    if (!result.valid || !result.data) {
      throw new BadRequestException(
        result.errors.map((error) => error.message + ','),
      );
    }

    const updatedRecord = await this.recordsService.updateRecordService(
      Number(id),
      result.data,
    );

    if (!updatedRecord) {
      throw new NotFoundException(`Запись не найдена`);
    } else {
      return updatedRecord;
    }
  }

  @Post(':id/delete')
  @ApiOperation({ summary: 'Удалить запись по ID' })
  @ApiResponse({
    status: 200,
    description: 'Запись успешно удалена',
    type: recordsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Запись не найдена',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'ID записи' })
  async deleteRecords(
    @Param('id') id: string | undefined,
  ): Promise<recordsDto | null> {
    if (!id) {
      throw new BadRequestException('ID записи не передан');
    }

    const result = await this.recordsService.deleteRecordService(Number(id));

    if (result) {
      return result;
    } else {
      throw new NotFoundException('Запись не найдена');
    }
  }
}
