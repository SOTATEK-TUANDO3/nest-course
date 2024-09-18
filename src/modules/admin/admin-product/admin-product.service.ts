import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class AdminProductService extends BaseService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async createProduct(createProductDto: CreateProductDto) {
    const { name, description, price, images, categoryId } = createProductDto;
    const product = await this.productRepo.findOneBy({ name });
    if (product) {
      throw new BadRequestException('Product existed');
    }

    const category = await this.categoryRepo.findOneBy({ id: categoryId });
    if (!category) {
      throw new BadRequestException('Category not found!');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const newProduct = this.productRepo.create();
    try {
      newProduct.name = name;
      newProduct.description = description;
      newProduct.price = price;
      newProduct.categories = [category];
      newProduct.images = images;

      await this.productRepo.save(newProduct);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return this.responseOk({ id: newProduct.id });
  }

  async updateProduct(productId: number, updateProductDto: UpdateProductDto) {
    const { name, description, price, images, categoryId } = updateProductDto;

    const updatingProduct = await this.productRepo.findOneBy({ id: productId });
    if (!updatingProduct) {
      throw new BadRequestException('Product is not found');
    }

    const product = await this.productRepo.findOneBy({ name });
    if (product) {
      throw new BadRequestException('Product is existed');
    }

    const category = await this.categoryRepo.findOneBy({ id: categoryId });
    if (!category) {
      throw new BadRequestException('Category is not found!');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      updatingProduct.name = name;
      updatingProduct.description = description;
      updatingProduct.price = price;
      updatingProduct.categories = [category];
      updatingProduct.images = images;

      await this.productRepo.save(updatingProduct);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return this.responseOk({ id: updatingProduct.id });
  }

  async deleteProduct(productId: number) {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) {
      throw new BadRequestException('Product is not found!');
    }

    await this.productRepo.softRemove(product);
    return this.responseOk();
  }
}
