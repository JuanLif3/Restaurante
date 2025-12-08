import { IsInt, IsString, Min, IsOptional, IsBoolean, IsNotEmpty } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(0)
    price: number;

    @IsInt()
    @Min(0)
    stock: number;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
