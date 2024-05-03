import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './dto/paginationDto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //@Post()
  @MessagePattern({ cmd: 'create-product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  //@Get()
  @MessagePattern({ cmd: 'find-all' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  //@Get(':id')
  @MessagePattern({ cmd: 'find-one' })
  findOne(@Payload('id') id: string) {
    return this.productService.findOne(+id);
  }

  //@Patch(':id')
  @MessagePattern({ cmd: 'update' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);
    return this.productService.update(updateProductDto.id, updateProductDto);
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'remove' })
  remove(@Payload('id') id: string) {
    return this.productService.remove(+id);
  }
}
