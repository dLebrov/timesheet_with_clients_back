import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
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
import { SubjectsService } from './subjects.service';
import { subjectsDto } from 'src/swagger-dto/subjects.dto';
import { createSubjectDto, updateSubjectDto } from './dto/subjects.dto';
import { validateDto } from 'src/utils';

@ApiTags('Предметы')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}
  @Get()
  @ApiOperation({ summary: 'Получить все предметы' })
  @ApiResponse({
    status: 200,
    description: 'Получить все предметы',
    type: [subjectsDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllSubjects(): Promise<subjectsDto[]> {
    return this.subjectsService.getAllSubjectsService();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить предмет по ID' })
  @ApiResponse({
    status: 200,
    description: 'Предмет найдена',
    type: subjectsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Предмет не найдена',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: String, description: 'ID предмета' })
  async getSubjectById(
    @Param('id') id: string | undefined,
  ): Promise<subjectsDto | null> {
    if (!id) {
      throw new BadRequestException('ID предмета не передан');
    }

    const result = await this.subjectsService.getSubjectByIdService(Number(id));

    if (result) {
      return result;
    } else {
      throw new NotFoundException(`Предмет не найден`);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый предмет' })
  @ApiResponse({
    status: 201,
    description: 'Предмет успешно создан',
    type: subjectsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createSubject(@Body() data: createSubjectDto): Promise<subjectsDto> {
    const result = validateDto(createSubjectDto, data);

    if (result.valid && result.data) {
      return this.subjectsService.createSubjectService(result.data);
    } else {
      throw new BadRequestException(
        result.errors.map((error) => error.message + ','),
      );
    }
  }

  @Post(':id')
  @ApiOperation({ summary: 'Обновить предмет по ID' })
  @ApiResponse({
    status: 200,
    description: 'Предмет успешно обновлена',
    type: subjectsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Предмет не найден',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'ID предмета' })
  async updateSubject(
    @Param('id') id: string | undefined,
    @Body() data: updateSubjectDto,
  ): Promise<subjectsDto | null> {
    if (!id) {
      throw new BadRequestException('ID предмета не передан');
    }

    const result = validateDto(updateSubjectDto, data);

    if (!result.valid || !result.data) {
      throw new BadRequestException(
        result.errors.map((error) => error.message + ','),
      );
    }

    const updatedSubject = await this.subjectsService.updateSubjectService(
      Number(id),
      result.data,
    );

    if (!updatedSubject) {
      throw new NotFoundException(`Предмет не найден`);
    } else {
      return updatedSubject;
    }
  }

  @Post(':id/delete')
  @ApiOperation({ summary: 'Удалить предмет по ID' })
  @ApiResponse({
    status: 200,
    description: 'Предмет успешно удален',
    type: subjectsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Предмет не найден',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'ID предмета' })
  async deleteSubject(
    @Param('id') id: string | undefined,
  ): Promise<subjectsDto | null> {
    if (!id) {
      throw new BadRequestException('ID предмета не передан');
    }

    const result = await this.subjectsService.deleteSubjectService(Number(id));

    if (result) {
      return result;
    } else {
      throw new NotFoundException('Запись не найдена');
    }
  }
}
