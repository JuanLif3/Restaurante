import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create (createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product)
  }

  findAll() {
    return this.productRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id, 
      ...updateProductDto,
    });
    if(!product) throw new NotFoundException('Producto no encontrado');
    return this.productRepository.save(product);
  }

  async remove (id: string) {
    //Soft delete: No borramos de la BD, solo lo desactivamos
    const product = await this.findOne(id);
    product.isActive = false;
    return this.productRepository.save(product);
  }
  
}