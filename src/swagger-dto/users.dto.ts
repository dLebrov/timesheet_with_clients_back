import { ApiProperty } from "@nestjs/swagger";
import { Role, Gender } from "@prisma/client";
import { clientsDto } from "./clients.dto";
import { servicesDto } from "./services.dto";

export class usersDto {
    @ApiProperty({ type: 'number', nullable: false })
    id: number;
    @ApiProperty({ type: 'string', nullable: false })
    surname: string;
    @ApiProperty({ type: 'string', nullable: false })
    name: string;
    @ApiProperty({ type: 'string', nullable: false })
    password: string;
    @ApiProperty({ type: 'string', nullable: false })
    email: string;
    @ApiProperty({ type: 'string', nullable: false })
    username: string;
    @ApiProperty({ type: 'string', nullable: false, enum: Role })
    role: Role;
    @ApiProperty({ type: 'string', nullable: false })
    birthDate: Date;
    @ApiProperty({ type: 'string', nullable: false })
    phone: string;
    @ApiProperty({ type: 'string', nullable: false, enum: Gender })
    gender: Gender;
    @ApiProperty({ type: clientsDto, isArray: true, nullable: false })
    clients: Omit<clientsDto, 'users' | 'client_subjects' | 'records'>[];
    @ApiProperty({ type: servicesDto, isArray: true, nullable: false })
    services: Omit<servicesDto, 'users' | 'records'>[];
    @ApiProperty({ type: 'string', nullable: false })
    createdAt: Date;
}
