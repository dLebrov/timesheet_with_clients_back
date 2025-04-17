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
import { Client_subjectsService } from './client_subjects.service';
import { client_subjectsDto } from 'src/swagger-dto/client_subjects.dto';
import {
  createClient_subjectsDto,
  updateClient_subjectsDto,
} from './dto/client_subjects.dto';

@ApiTags('Связь клиентов и предметов')
@Controller('client_subjects')
export class Client_subjectsController {
  constructor(
    private readonly client_subjectsService: Client_subjectsService,
  ) {}
  @Get()
  @ApiOperation({ summary: 'Получить все связи клиентов и предметов' })
  @ApiResponse({
    status: 200,
    description: 'Получить все связи клиентов и предметов',
    type: [client_subjectsDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllClient_subjects(): Promise<client_subjectsDto[]> {
    return this.client_subjectsService.getAllClient_subjectsService();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить связь клиента и предмета по ID' })
  @ApiResponse({
    status: 200,
    description: 'Связь клиента и предмета найдена',
    type: client_subjectsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Связь клиента и предмета не найдена',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID связи клиента и предмета',
  })
  async getClient_subjectById(
    @Param('id') id: string | undefined,
  ): Promise<client_subjectsDto | null> {
    if (!id) {
      throw new BadRequestException('ID связи клиента и предмета не передан');
    }

    return this.client_subjectsService.getClient_subjectByIdService(Number(id));
  }

  @Get(':id/client')
  @ApiOperation({
    summary: 'Получить связи клиентов и предметов по ID клиента',
  })
  @ApiResponse({
    status: 200,
    description: 'Связь клиентов и предметов найдена',
    type: client_subjectsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Связь клиентов и предметов не найдена',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID клиента',
  })
  async getClient_subjectsByClientId(
    @Param('id') id: string | undefined,
  ): Promise<client_subjectsDto[] | null> {
    if (!id) {
      throw new BadRequestException('ID клиента не передан');
    }

    return this.client_subjectsService.getClient_subjectsByClientIdService(
      Number(id),
    );
  }

  @Get(':id/subject')
  @ApiOperation({
    summary: 'Получить связи клиентов и предметов по ID предмета',
  })
  @ApiResponse({
    status: 200,
    description: 'Связь клиентов и предметов найдена',
    type: client_subjectsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Связь клиентов и предметов не найдена',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: String, description: 'ID предмета' })
  async getClient_subjectsBySubjectId(
    @Param('id') id: string | undefined,
  ): Promise<client_subjectsDto[] | null> {
    if (!id) {
      throw new BadRequestException('ID предмета не передан');
    }

    return this.client_subjectsService.getClient_subjectsBySubjectIdService(
      Number(id),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую связь клиентов и предметов' })
  @ApiResponse({
    status: 201,
    description: 'Связь клиентов и предметов успешно создана',
    type: client_subjectsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createClient_subject(
    @Body() data: createClient_subjectsDto,
  ): Promise<client_subjectsDto> {
    return this.client_subjectsService.createClient_subjectService(data);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Обновить связь клиентов и предметов по ID' })
  @ApiResponse({
    status: 200,
    description: 'Связь клиентов и предметов успешно обновлена',
    type: client_subjectsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Связь клиентов и предметов не найдена',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID связи клиентов и предметов',
  })
  async updateClient_subject(
    @Param('id') id: string | undefined,
    @Body() data: updateClient_subjectsDto,
  ): Promise<client_subjectsDto | null> {
    if (!id) {
      throw new BadRequestException('ID связи клиентов и предметов не передан');
    }

    const updatedSubject =
      await this.client_subjectsService.updateClient_subjectService(
        Number(id),
        data,
      );

    if (!updatedSubject) {
      throw new NotFoundException(`Связь клиентов и предметов не найдена`);
    } else {
      return updatedSubject;
    }
  }

  @Post(':id/delete')
  @ApiOperation({ summary: 'Удалить связь клиентов и предметов по ID' })
  @ApiResponse({
    status: 200,
    description: 'Связь клиентов и предметов успешно удалена',
    type: client_subjectsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Связь клиентов и предметов не найдена',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID связи клиентов и предметов',
  })
  async deleteClient_subject(
    @Param('id') id: string | undefined,
  ): Promise<client_subjectsDto | null> {
    if (!id) {
      throw new BadRequestException('ID связи клиентов и предметов не передан');
    }

    return this.client_subjectsService.deleteClient_subjectService(Number(id));
  }
}
