import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsInt, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @ApiProperty({
        description: 'Number of items to return',
        default: 10,
        required: false,
        minimum: 1,
        maximum: 100,
        type: Number,
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    limit?: number;


    @ApiProperty({
        description: 'Number of items to skip',
        default: 0,
        required: false,
        minimum: 0,
        type: Number,
    })
    @IsOptional()
    @IsInt()    
    @Min(0)
    @Type(() => Number)
    offset?: number;


}