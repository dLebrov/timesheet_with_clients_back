import { ApiProperty } from "@nestjs/swagger";
import { Role, Gender } from "@prisma/client";
import { clientsDto } from "./clients.dto";
import { servicesDto } from "./services.dto";
import { IsDefined, IsNumber, IsString, IsEnum, IsDate, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class usersDto {
    @IsDefined()
    @IsNumber()
    @ApiProperty({ type: 'number', nullable: false })
    id: number;
    @IsDefined()
    @IsString()
    @ApiProperty({ type: 'string', nullable: false })
    surname: string;
    @IsDefined()
    @IsString()
    @ApiProperty({ type: 'string', nullable: false })
    name: string;
    @IsDefined()
    @IsString()
    @ApiProperty({ type: 'string', nullable: false })
    password: string;
    @IsDefined()
    @IsString()
    @ApiProperty({ type: 'string', nullable: false })
    email: string;
    @IsDefined()
    @IsString()
    @ApiProperty({ type: 'string', nullable: false })
    username: string;
    @IsDefined()
    @IsEnum(Role)
    @ApiProperty({ type: 'string', nullable: false, enum: Role })
    role: Role;
    @IsDefined()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: 'string', nullable: false })
    birthDate: Date;
    @IsDefined()
    @IsString()
    @ApiProperty({ type: 'string', nullable: false })
    phone: string;
    @IsDefined()
    @IsEnum(Gender)
    @ApiProperty({ type: 'string', nullable: false, enum: Gender })
    gender: Gender;
    @IsDefined()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => clientsDto)
    @ApiProperty({ type: clientsDto, isArray: true, nullable: false })
    clients: Omit<clientsDto, 'users' | 'client_subjects' | 'records'>[];
    @IsDefined()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => servicesDto)
    @ApiProperty({ type: servicesDto, isArray: true, nullable: false })
    services: Omit<servicesDto, 'users' | 'records'>[];
    @IsDefined()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: 'string', nullable: false })
    createdAt: Date;
}
