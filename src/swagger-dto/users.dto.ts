import { ApiProperty } from "@nestjs/swagger";
import { Role, Gender } from "@prisma/client";
import { clientsDto } from "./clients.dto";
import { servicesDto } from "./services.dto";

export class usersDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    surname: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    username: string;
    @ApiProperty({ enum: Role, enumName: 'Role' })
    role: Role;
    @ApiProperty()
    birthDate: Date;
    @ApiProperty()
    phone: string;
    @ApiProperty({ enum: Gender, enumName: 'Gender' })
    gender: Gender;
    @ApiProperty()
    clients: Omit<clientsDto, 'users' | 'client_subjects' | 'records'>[];
    @ApiProperty()
    services: Omit<servicesDto, 'users' | 'records'>[];
    @ApiProperty()
    createdAt: Date;
}
