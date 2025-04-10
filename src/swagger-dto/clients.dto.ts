import { ApiProperty } from "@nestjs/swagger";
import { usersDto } from "./users.dto";
import { client_subjectsDto } from "./client_subjects.dto";
import { recordsDto } from "./records.dto";

export class clientsDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    userId: number;
    @ApiProperty()
    users: Omit<usersDto, 'clients' | 'services'>;
    @ApiProperty()
    surname?: string | null;
    @ApiProperty()
    name: string;
    @ApiProperty()
    birthDate?: Date | null;
    @ApiProperty()
    group?: string | null;
    @ApiProperty()
    description?: string | null;
    @ApiProperty()
    client_subjects: Omit<client_subjectsDto, 'clients' | 'subjects'>[];
    @ApiProperty()
    records: Omit<recordsDto, 'clients' | 'services'>[];
    @ApiProperty()
    createdAt: Date;
}
