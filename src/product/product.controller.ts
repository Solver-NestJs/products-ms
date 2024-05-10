import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './dto/paginationDto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'create-product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'find-all' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find-one' })
  findOne(@Payload('id') id: string) {
    return this.productService.findOne(+id);
  }

  @MessagePattern({ cmd: 'update' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);
    return this.productService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern({ cmd: 'remove' })
  remove(@Payload('id') id: string) {
    return this.productService.remove(+id);
  }

  @MessagePattern({ cmd: 'validateProducts' })
  validateProducts(@Payload() ids: number[]) {
    return this.productService.validateProducts(ids);
  }
}
