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

    @IsString()
    @MinLength(5)
    title: string

    @IsPositive()
    @IsNumber()
    @IsOptional()
    price?: number

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    slug?: string

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number

    @IsString({ each: true })
    @IsArray()
    sizes: string[]

    @IsIn(['men', 'women', 'unisex', 'kid'])
    gender: string
    
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[]
}
