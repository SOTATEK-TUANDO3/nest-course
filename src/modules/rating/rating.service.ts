import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { constants } from 'src/app/constants/common.constant';
import { Product } from 'src/entities/product.entity';
import { Rating } from 'src/entities/rating.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService extends BaseService {
  constructor(
    @Inject(constants.INJECT_TOKEN.AUTH_USER_ID) private readonly currentUserId,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Rating) private readonly ratingRepo: Repository<Rating>,
  ) {
    super();
  }

  async createRating(createRatingDto: CreateRatingDto) {
    const { productId, ratingNumber } = createRatingDto;

    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) {
      throw new BadRequestException('Product was not found');
    }

    const user = await this.userRepo.findOneBy({ id: this.currentUserId });
    if (!user) {
      throw new BadRequestException('User was not found');
    }

    const rating = this.ratingRepo.create();
    rating.productId = product.id;
    rating.customerId = user.id;
    rating.rating = ratingNumber;
    await this.ratingRepo.save(rating);
    return this.responseOk();
  }

  // async removeReview(id: number) {
  //   const review = await this.reviewRepo.findOneBy({ id });
  //   if (!review) {
  //     throw new BadRequestException('Review was not found');
  //   }

  //   await this.reviewRepo.remove(review);
  //   return this.responseOk();
  // }

  // async updateReview(updateReviewDto: UpdateReviewDto) {
  //   const { id, text } = updateReviewDto;

  //   const review = await this.reviewRepo.findOneBy({ id });
  //   if (!review) {
  //     throw new BadRequestException('Review was not found');
  //   }

  //   review.text = text;
  //   await this.reviewRepo.save(review);
  //   return this.responseOk();
  // }
}
