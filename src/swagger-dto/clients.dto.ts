import { ApiProperty } from "@nestjs/swagger";
import { usersDto } from "./users.dto";
import { client_subjectsDto } from "./client_subjects.dto";
import { recordsDto } from "./records.dto";

export class clientsDto {
    @ApiProperty({ type: 'number', nullable: false })
    id: number;
    @ApiProperty({ type: 'number', nullable: false })
    userId: number;
    @ApiProperty({ type: usersDto, nullable: false })
    users: Omit<usersDto, 'password' | 'clients' | 'services'>;
    @ApiProperty({ type: 'string', nullable: true })
    surname?: string | null;
    @ApiProperty({ type: 'string', nullable: false })
    name: string;
    @ApiProperty({ type: 'string', nullable: true })
    birthDate?: Date | null;
    @ApiProperty({ type: 'string', nullable: true })
    group?: string | null;
    @ApiProperty({ type: 'string', nullable: true })
    description?: string | null;
    @ApiProperty({ type: client_subjectsDto, isArray: true, nullable: false })
    client_subjects: Omit<client_subjectsDto, 'clients' | 'subjects'>[];
    @ApiProperty({ type: recordsDto, isArray: true, nullable: false })
    records: Omit<recordsDto, 'clients' | 'services'>[];
    @ApiProperty({ type: 'string', nullable: false })
    createdAt: Date;
}
