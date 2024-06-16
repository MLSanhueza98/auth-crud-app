import { ApiProperty } from "@nestjs/swagger";
import { 
    IsIn, 
    IsInt, 
    IsArray, 
    IsString, 
    IsNumber, 
    MinLength,
    IsOptional, 
    IsPositive, 
} from "class-validator";

    


export class CreateProductDto {

    @ApiProperty({
        description: 'Product title (unique)', nullable: false, minLength:  1 
    })
    @IsString()
    @MinLength(5)
    title: string

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    @IsOptional()
    price?: number

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    sizes: string[]

    @ApiProperty()
    @IsIn(['men', 'women', 'unisex', 'kid'])
    gender: string
    
    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[]
    
    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[]
}
