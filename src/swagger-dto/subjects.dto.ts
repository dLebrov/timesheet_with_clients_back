import { ApiProperty } from "@nestjs/swagger";
import { client_subjectsDto } from "./client_subjects.dto";
import { IsDefined, IsNumber, IsString, IsArray, ValidateNested, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class subjectsDto {
    @IsDefined()
    @IsNumber()
    @ApiProperty({ type: 'number', nullable: false })
    id: number;
    @IsDefined()
    @IsString()
    @ApiProperty({ type: 'string', nullable: false })
    name: string;
    @IsDefined()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => client_subjectsDto)
    @ApiProperty({ type: client_subjectsDto, isArray: true, nullable: false })
    client_subjects: Omit<client_subjectsDto, 'clients' | 'subjects'>[];
    @IsDefined()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: 'string', nullable: false })
    createdAt: Date;
}
