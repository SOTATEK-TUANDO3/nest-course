import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAccess } from 'src/app/decorators/allow-acess';
import { Roles } from 'src/app/enums/common.enum';
import { UserGuard } from 'src/app/guards/user.guard';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingService } from './rating.service';

@ApiBearerAuth()
@UseGuards(UserGuard)
@AllowAccess(Roles.CUSTOMER)
@ApiTags('Rating Prododuct')
@Controller('rating/product')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({ summary: 'Create a rating for product' })
  @Post()
  async createReview(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.createRating(createRatingDto);
  }

  // @ApiOperation({ summary: 'Remove review' })
  // @Delete(':id')
  // async removeReview(@Param('id') id: number) {
  //   return this.ratingService.removeReview(id);
  // }

  // @ApiOperation({ summary: 'Update a review' })
  // @Patch()
  // async updateReview(@Body() updateReviewDto: UpdateReviewDto) {
  //   return this.ratingService.updateReview(updateReviewDto);
  // }
}
