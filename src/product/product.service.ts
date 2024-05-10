import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from './dto/paginationDto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsServices');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async create(createProductDto: CreateProductDto) {
    return await this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const [countproducts, productos] = await Promise.all([
      await this.product.count({
        where: { available: true },
      }),
      await this.product.findMany({
        where: {
          available: true,
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    // Calculando numero de paginas
    const totalPages = Math.ceil(countproducts / limit);
    return {
      data: productos,
      meta: {
        page: page,
        totalPage: totalPages,
        totalproducts: countproducts,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: {
        id,
        available: true,
      },
    });

    if (!product) {
      throw new RpcException({
        message: `Product with id ${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return await this.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.product.update({
      where: { id },
      data: { available: false },
    });
  }

  async validateProducts(ids: number[]) {
    const products = await this.product.findMany({
      where: {
        id: { in: ids },
        available: true,
      },
    });

    if (ids.length !== products.length) {
      throw new RpcException({
        message: 'Some products are not available',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return products;
  }
}
