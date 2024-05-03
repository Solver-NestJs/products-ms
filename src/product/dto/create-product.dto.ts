import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Nombre es requerido' })
  public name: string;
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive({ message: 'El precio debe ser mayor a cero' })
  @Min(0, { message: 'El precio debe ser un numero positivo' })
  @Type(() => Number)
  public price: number;
}
