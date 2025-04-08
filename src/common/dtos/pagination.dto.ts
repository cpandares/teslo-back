import { Type } from "class-transformer";
import { IsOptional, IsInt, IsPositive, Min } from "class-validator";

export class PaginationDto {


    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    limit?: number;
    
    @IsOptional()
    @IsInt()
    
    @Min(0)
    @Type(() => Number)
    offset?: number;


}