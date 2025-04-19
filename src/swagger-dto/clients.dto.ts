import { ApiProperty } from "@nestjs/swagger";
import { usersDto } from "./users.dto";
import { client_subjectsDto } from "./client_subjects.dto";
import { recordsDto } from "./records.dto";
import { IsDefined, IsNumber, ValidateNested, IsOptional, IsString, IsDate, IsArray } from "class-validator";
import { Type } from "class-transformer";

export class clientsDto {
    @IsDefined()
    @IsNumber()
    @ApiProperty({ type: 'number', nullable: false })
    id: number;
    @IsDefined()
    @IsNumber()
    @ApiProperty({ type: 'number', nullable: false })
    userId: number;
    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => usersDto)
    @ApiProperty({ type: usersDto, nullable: false })
    users: Omit<usersDto, 'clients' | 'services' | 'password'>;
    @IsOptional()
    @IsString()
    @ApiProperty({ type: 'string', nullable: true })
    surname?: string | null;
    @IsDefined()
    @IsString()
    @ApiProperty({ type: 'string', nullable: false })
    name: string;
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: 'string', nullable: true })
    birthDate?: Date | null;
    @IsOptional()
    @IsString()
    @ApiProperty({ type: 'string', nullable: true })
    group?: string | null;
    @IsOptional()
    @IsString()
    @ApiProperty({ type: 'string', nullable: true })
    description?: string | null;
    @IsDefined()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => client_subjectsDto)
    @ApiProperty({ type: client_subjectsDto, isArray: true, nullable: false })
    client_subjects: Omit<client_subjectsDto, 'clients' | 'subjects'>[];
    @IsDefined()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => recordsDto)
    @ApiProperty({ type: recordsDto, isArray: true, nullable: false })
    records: Omit<recordsDto, 'clients' | 'services'>[];
    @IsDefined()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: 'string', nullable: false })
    createdAt: Date;
}
