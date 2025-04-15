import { ApiProperty } from "@nestjs/swagger";
import { usersDto } from "./users.dto";
import { recordsDto } from "./records.dto";

export class servicesDto {
    @ApiProperty({ type: 'number', nullable: false })
    id: number;
    @ApiProperty({ type: 'number', nullable: false })
    userId: number;
    @ApiProperty({ type: usersDto, nullable: false })
    users: Omit<usersDto, 'password' | 'clients' | 'services'>;
    @ApiProperty({ type: 'string', nullable: false })
    name: string;
    @ApiProperty({ type: recordsDto, isArray: true, nullable: false })
    records: Omit<recordsDto, 'clients' | 'services'>[];
    @ApiProperty({ type: 'string', nullable: false })
    createdAt: Date;
}
