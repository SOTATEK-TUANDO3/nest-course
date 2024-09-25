import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { constants } from 'src/app/constants/common.constant';
import { PaginationDtoConstants } from 'src/app/constants/pagination-dto.constants';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { WishProduct } from 'src/entities/wish-product.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { CreateWishProductDto } from './dto/create-wish-product.dto';

@Injectable()
export class WishProductService extends BaseService {
  constructor(
    @Inject(constants.INJECT_TOKEN.AUTH_USER_ID) private readonly currentUserId,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(WishProduct) private readonly wishProductRepo: Repository<WishProduct>,
  ) {
    super();
  }

  async listWishProduct(paginationDtoConstants: PaginationDtoConstants) {
    const { limit, page } = paginationDtoConstants;
    const queryBuilder = this.wishProductRepo.createQueryBuilder('WP');
    const res = await this.customPaginate(queryBuilder, page, limit);
    return this.responseOk(res);
  }

  async createWishProduct(createWishProductDto: CreateWishProductDto) {
    const { productId } = createWishProductDto;

    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) {
      throw new BadRequestException('Product was not found');
    }

    const user = await this.userRepo.findOneBy({ id: this.currentUserId });
    if (!user) {
      throw new BadRequestException('User was not found');
    }

    const wishProduct = this.wishProductRepo.create();
    wishProduct.productId = product.id;
    wishProduct.customerId = user.id;
    await this.wishProductRepo.save(wishProduct);
    return this.responseOk();
  }

  async removeWishProduct(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new BadRequestException('Product was not found');
    }

    const user = await this.userRepo.findOneBy({ id: this.currentUserId });
    if (!user) {
      throw new BadRequestException('User was not found');
    }

    const wishProduct = await this.wishProductRepo.findOneBy({ customerId: user.id, productId: product.id });
    await this.wishProductRepo.remove(wishProduct);
    return this.responseOk();
  }
}
