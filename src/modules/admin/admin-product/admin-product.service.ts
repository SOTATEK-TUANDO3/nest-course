import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Inventory } from 'src/entities/inventory.entity';
import { Product } from 'src/entities/product.entity';
import { BaseService } from 'src/modules/base/base.service';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StripeService } from 'src/modules/stripe/stripe.service';

@Injectable()
export class AdminProductService extends BaseService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Inventory) private readonly inventoryRepo: Repository<Inventory>,
    private readonly stripeService: StripeService,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async createProduct(createProductDto: CreateProductDto) {
    const { name, description, price, images, categoryId, quantity, currency } = createProductDto;
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
    newProduct.name = name;
    newProduct.description = description;
    newProduct.price = price;
    newProduct.categories = [category];
    newProduct.images = images;
    newProduct.currency = currency;

    const newInventory = this.inventoryRepo.create();
    newInventory.quantity = quantity;

    try {
      // create product on stripe
      const productOnStripe = await this.stripeService.createProduct({
        name: newProduct.name,
        images: newProduct.images,
        description: newProduct.description,
      });

      // create price for product
      await this.stripeService.createPrice({
        unit_amount: newProduct.price,
        currency: newProduct.currency,
        product: productOnStripe.id,
      });

      const updatedProduct = await this.stripeService.findProduct(productOnStripe.id);

      newProduct.defaultPrice = updatedProduct.default_price as string;
      newProduct.prodId = productOnStripe.id;

      await this.productRepo.save(newProduct);
      newInventory.productId = newProduct.id;
      await this.inventoryRepo.save(newInventory);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

    return this.responseOk({ id: newProduct.id });
  }

  async updateProduct(productId: number, updateProductDto: UpdateProductDto) {
    const { name, description, price, images, categoryId } = updateProductDto;

    if (!name && !description && !price && !images?.length && !categoryId) {
      throw new BadRequestException('There is nothing to update');
    }

    const updatingProduct = await this.productRepo.findOneBy({ id: productId });
    if (!updatingProduct) {
      throw new BadRequestException('Product is not found');
    }

    const productOnStripe = await this.stripeService.findProduct(updatingProduct.prodId);
    if (!productOnStripe) {
      throw new BadRequestException('Product was not found on Stripe');
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
      if (name) updatingProduct.name = name;
      if (description) updatingProduct.description = description;
      if (price) updatingProduct.price = price;
      if (categoryId) updatingProduct.categories = [category];
      if (images.length) updatingProduct.images = images;

      await this.stripeService.updateProduct(updatingProduct.prodId, updateProductDto);
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

    await this.stripeService.deleteProduct(product.prodId);
    await this.productRepo.softRemove(product);
    return this.responseOk();
  }
}
