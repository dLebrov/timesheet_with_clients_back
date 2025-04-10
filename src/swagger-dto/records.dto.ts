import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { clientsDto } from "./clients.dto";
import { servicesDto } from "./services.dto";

export class recordsDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    clientId: number;
    @ApiProperty()
    clients: Omit<clientsDto, 'users' | 'client_subjects' | 'records'>;
    @ApiProperty()
    serviceId: number;
    @ApiProperty()
    services: Omit<servicesDto, 'users' | 'records'>;
    @ApiProperty({ enum: Status, enumName: 'Status' })
    status: Status;
    @ApiProperty()
    isPaid: boolean;
    @ApiProperty()
    description?: string | null;
    @ApiProperty()
    price?: number;
    @ApiProperty()
    date: Date;
    @ApiProperty()
    start_time: Date;
    @ApiProperty()
    end_time: Date;
    @ApiProperty()
    createdAt: Date;
}
