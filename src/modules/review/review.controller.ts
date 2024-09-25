import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAccess } from 'src/app/decorators/allow-acess';
import { Roles } from 'src/app/enums/common.enum';
import { UserGuard } from 'src/app/guards/user.guard';
import { ReviewService } from './review.service';
import { CreateReviewwDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiBearerAuth()
@UseGuards(UserGuard)
@AllowAccess(Roles.CUSTOMER)
@ApiTags('Review Prododuct')
@Controller('review/product')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Create a review for product' })
  @Post()
  async createReview(@Body() createReviewDto: CreateReviewwDto) {
    return this.reviewService.createReview(createReviewDto);
  }

  @ApiOperation({ summary: 'Remove review' })
  @Delete(':id')
  async removeReview(@Param('id') id: number) {
    return this.reviewService.removeReview(id);
  }

  @ApiOperation({ summary: 'Update a review' })
  @Patch()
  async updateReview(@Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.updateReview(updateReviewDto);
  }
}
