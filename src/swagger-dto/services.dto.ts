import { ApiProperty } from "@nestjs/swagger";
import { usersDto } from "./users.dto";
import { recordsDto } from "./records.dto";
import { IsDefined, IsNumber, ValidateNested, IsString, IsArray, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class servicesDto {
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
    @IsDefined()
    @IsString()
    @ApiProperty({ type: 'string', nullable: false })
    name: string;
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
