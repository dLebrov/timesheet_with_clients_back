import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { clientsDto } from "./clients.dto";
import { servicesDto } from "./services.dto";
import { IsDefined, IsNumber, ValidateNested, IsEnum, IsBoolean, IsOptional, IsString, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class recordsDto {
    @IsDefined()
    @IsNumber()
    @ApiProperty({ type: 'number', nullable: false })
    id: number;
    @IsDefined()
    @IsNumber()
    @ApiProperty({ type: 'number', nullable: false })
    clientId: number;
    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => clientsDto)
    @ApiProperty({ type: clientsDto, nullable: false })
    clients: Omit<clientsDto, 'users' | 'client_subjects' | 'records'>;
    @IsDefined()
    @IsNumber()
    @ApiProperty({ type: 'number', nullable: false })
    serviceId: number;
    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => servicesDto)
    @ApiProperty({ type: servicesDto, nullable: false })
    services: Omit<servicesDto, 'users' | 'records'>;
    @IsDefined()
    @IsEnum(Status)
    @ApiProperty({ type: 'string', nullable: false, enum: Status })
    status: Status;
    @IsDefined()
    @IsBoolean()
    @ApiProperty({ type: 'boolean', nullable: false })
    isPaid: boolean;
    @IsOptional()
    @IsString()
    @ApiProperty({ type: 'string', nullable: true })
    description?: string | null;
    @IsOptional()
    @IsNumber()
    @ApiProperty({ type: 'number', nullable: true })
    price?: number | null;
    @IsDefined()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: 'string', nullable: false })
    date: Date;
    @IsDefined()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: 'string', nullable: false })
    start_time: Date;
    @IsDefined()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: 'string', nullable: false })
    end_time: Date;
    @IsDefined()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: 'string', nullable: false })
    createdAt: Date;
}
