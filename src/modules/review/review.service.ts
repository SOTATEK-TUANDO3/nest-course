import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Review } from 'src/entities/review.entity';
import { constants } from 'src/app/constants/common.constant';
import { CreateReviewwDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService extends BaseService {
  constructor(
    @Inject(constants.INJECT_TOKEN.AUTH_USER_ID) private readonly currentUserId,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
  ) {
    super();
  }

  async createReview(createReviewDto: CreateReviewwDto) {
    const { productId, text, rating } = createReviewDto;

    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) {
      throw new BadRequestException('Product was not found');
    }

    const user = await this.userRepo.findOneBy({ id: this.currentUserId });
    if (!user) {
      throw new BadRequestException('User was not found');
    }

    const review = this.reviewRepo.create();
    review.productId = product.id;
    review.customerId = user.id;
    review.text = text;
    review.rating = rating;
    await this.reviewRepo.save(review);
    return this.responseOk();
  }

  async removeReview(id: number) {
    const review = await this.reviewRepo.findOneBy({ id });
    if (!review) {
      throw new BadRequestException('Review was not found');
    }

    await this.reviewRepo.remove(review);
    return this.responseOk();
  }

  async updateReview(updateReviewDto: UpdateReviewDto) {
    const { id, text, rating } = updateReviewDto;

    const review = await this.reviewRepo.findOneBy({ id });
    if (!review) {
      throw new BadRequestException('Review was not found');
    }

    review.text = text;
    review.rating = rating;
    await this.reviewRepo.save(review);
    return this.responseOk();
  }
}
