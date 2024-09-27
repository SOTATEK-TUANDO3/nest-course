import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { constants } from 'src/app/constants/common.constant';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';

@Injectable()
export class ProductService extends BaseService {
  constructor(
    @Inject(constants.INJECT_TOKEN.AUTH_USER_ID) private readonly currentUserId,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) {
    super();
  }

  async listRecommendProducts() {
    // list 5 categories product that user bought the most currently
    const categories = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoin('order.products', 'product')
      .leftJoin('product.categories', 'category')
      .where('order.customerId = :currentUserId', { currentUserId: this.currentUserId })
      .select('DISTINCT category.name')
      .limit(5)
      .getRawMany();

    const recommendedProducts = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.categories', 'category')
      .leftJoin('product.ratings', 'rating')
      .where('category.name in :categories', { categories })
      .select([
        'product.id as id',
        'product.description as description',
        'product.images as images',
        'product.price as price',
        'AVG(rating.rating) as avgRating',
      ])
      .orderBy('avgRating', 'DESC')
      .groupBy('product.id')
      .limit(10)
      .getRawMany();

    console.log(recommendedProducts);
    return this.responseOk(recommendedProducts);
  }
}
