import { ApiProperty } from "@nestjs/swagger";
import { clientsDto } from "./clients.dto";
import { subjectsDto } from "./subjects.dto";
import { usersDto } from "./users.dto";
import { IsDefined, IsNumber, ValidateNested, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class client_subjectsDto {
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
    subjectId: number;
    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => subjectsDto)
    @ApiProperty({ type: subjectsDto, nullable: false })
    subjects: Omit<subjectsDto, 'users' | 'client_subjects' | 'records'>;
    @IsDefined()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: 'string', nullable: false })
    createdAt: Date;
    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => usersDto)
    @ApiProperty({ type: usersDto, nullable: false })
    users: Omit<usersDto, 'clients' | 'services' | 'subjects' | 'records' | 'client_subjects' | 'password'>;
    @IsDefined()
    @IsNumber()
    @ApiProperty({ type: 'number', nullable: false })
    userId: number;
}
