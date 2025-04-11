import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

    @ApiProperty({
        description: 'User email',
        uniqueItems: true,
        required: true,
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password',
        required: true,
        minLength: 6,
        maxLength: 50,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: 'User full name',
        required: true,
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @MinLength(2)
    fullName: string;

}