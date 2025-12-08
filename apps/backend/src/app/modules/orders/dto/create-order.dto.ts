import { IsNotEmpty, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Clase auxiliar para validar cada item de la lista
class OrderItemDto {
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @IsNumber()
    @IsNotEmpty()
    tableNumber: number;

    @IsArray()
    @ValidateNested({ each: true }) // Valida cada objeto dentro del array
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
