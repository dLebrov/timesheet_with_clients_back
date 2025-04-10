import { ApiProperty } from "@nestjs/swagger";
import { clientsDto } from "./clients.dto";
import { subjectsDto } from "./subjects.dto";

export class client_subjectsDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    clientId: number;
    @ApiProperty()
    clients?: Omit<clientsDto, 'users' | 'client_subjects' | 'records'>;
    @ApiProperty()
    subjectId: number;
    @ApiProperty()
    subjects?: Omit<subjectsDto, 'client_subjects'>;
    @ApiProperty()
    createdAt: Date;
}
