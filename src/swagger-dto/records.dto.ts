import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { clientsDto } from "./clients.dto";
import { servicesDto } from "./services.dto";

export class recordsDto {
    @ApiProperty({ type: 'number', nullable: false })
    id: number;
    @ApiProperty({ type: 'number', nullable: false })
    clientId: number;
    @ApiProperty({ type: clientsDto, nullable: false })
    clients: Omit<clientsDto, 'users' | 'client_subjects' | 'records'>;
    @ApiProperty({ type: 'number', nullable: false })
    serviceId: number;
    @ApiProperty({ type: servicesDto, nullable: false })
    services: Omit<servicesDto, 'users' | 'records'>;
    @ApiProperty({ type: 'string', nullable: false, enum: Status })
    status: Status;
    @ApiProperty({ type: 'boolean', nullable: false })
    isPaid: boolean;
    @ApiProperty({ type: 'string', nullable: true })
    description?: string | null;
    @ApiProperty({ type: 'number', nullable: true })
    price?: number | null;
    @ApiProperty({ type: 'string', nullable: false })
    date: Date;
    @ApiProperty({ type: 'string', nullable: false })
    start_time: Date;
    @ApiProperty({ type: 'string', nullable: false })
    end_time: Date;
    @ApiProperty({ type: 'string', nullable: false })
    createdAt: Date;
}
