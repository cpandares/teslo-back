import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'Product title',
        uniqueItems: true,
        example: 'Product title',
        minLength: 1,
        maxLength: 100,
        required: true,
    })
    @IsString()
    @MinLength(1)
    title: string;


    @ApiProperty({
        description: 'Product price',
        example: 100,
        required: false,
        minimum: 0,
        maximum: 10000,
        type: Number,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;


    @ApiProperty({
        description: 'Product description',
        example: 'Product description',
        minLength: 1,
        maxLength: 500,
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;


    @ApiProperty({
        description: 'Product slug',
        uniqueItems: true,
        example: 'product-slug',
        minLength: 1,
        maxLength: 100,
        required: false,
    })
    @IsString()
    @IsOptional()
    slug?: string;


    @ApiProperty({
        description: 'Product stock',
        example: 100,
        required: false,
        minimum: 0,
        maximum: 10000,
        type: Number,
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;


    @ApiProperty({
        description: 'Product sizes',
        example: ['S', 'M', 'L'],
        required: true,
        type: [String],
    })
    @IsString({ each: true })
    @IsArray()    
    sizes: string[];

    @ApiProperty({
        description: 'Test product gender field',

    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        description: 'Product tags',
        example: ['tag1', 'tag2'],
        required: false,
        type: [String],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty({
        description: 'Product images',
        example: ['image1.jpg', 'image2.jpg'],
        required: false,
        type: [String],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];






}
