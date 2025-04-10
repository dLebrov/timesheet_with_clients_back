import { ApiProperty } from "@nestjs/swagger";
import { client_subjectsDto } from "./client_subjects.dto";

export class subjectsDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    client_subjects: Omit<client_subjectsDto, 'clients' | 'subjects'>[];
    @ApiProperty()
    createdAt: Date;
}
