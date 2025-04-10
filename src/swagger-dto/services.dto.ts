import { ApiProperty } from "@nestjs/swagger";
import { usersDto } from "./users.dto";
import { recordsDto } from "./records.dto";

export class servicesDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    userId: number;
    @ApiProperty()
    users: Omit<usersDto, 'clients' | 'services'>;
    @ApiProperty()
    name: string;
    @ApiProperty()
    records: Omit<recordsDto, 'clients' | 'services'>[];
    @ApiProperty()
    createdAt: Date;
}
