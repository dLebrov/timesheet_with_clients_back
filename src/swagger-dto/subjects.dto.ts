import { ApiProperty } from "@nestjs/swagger";
import { client_subjectsDto } from "./client_subjects.dto";

export class subjectsDto {
    @ApiProperty({ type: 'number', nullable: false })
    id: number;
    @ApiProperty({ type: 'string', nullable: false })
    name: string;
    @ApiProperty({ type: client_subjectsDto, isArray: true, nullable: false })
    client_subjects: Omit<client_subjectsDto, 'clients' | 'subjects'>[];
    @ApiProperty({ type: 'string', nullable: false })
    createdAt: Date;
}
