import { ApiProperty } from "@nestjs/swagger";
import { clientsDto } from "./clients.dto";
import { subjectsDto } from "./subjects.dto";

export class client_subjectsDto {
    @ApiProperty({ type: 'number', nullable: false })
    id: number;
    @ApiProperty({ type: 'number', nullable: false })
    clientId: number;
    @ApiProperty({ type: clientsDto, nullable: false })
    clients: Omit<clientsDto, 'users' | 'client_subjects' | 'records'>;
    @ApiProperty({ type: 'number', nullable: false })
    subjectId: number;
    @ApiProperty({ type: subjectsDto, nullable: false })
    subjects: Omit<subjectsDto, 'client_subjects'>;
    @ApiProperty({ type: 'string', nullable: false })
    createdAt: Date;
}
