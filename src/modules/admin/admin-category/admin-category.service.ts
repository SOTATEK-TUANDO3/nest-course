import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { BaseService } from 'src/modules/base/base.service';
import { Brackets, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CommonHelper } from 'src/app/helper/common.helper';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoryDto } from './dto/list-category.dto';

@Injectable()
export class AdminCategoryService extends BaseService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    private readonly commonHelper: CommonHelper,
  ) {
    super();
  }

  async listCategories(params: ListCategoryDto) {
    const { limit, page, q } = params;
    const queryBuilder = this.categoryRepo.createQueryBuilder('CAT');

    if (q) {
      queryBuilder.andWhere(
        new Brackets((subQ) => {
          subQ
            .where(this.searchCaseInsensitive('CAT.name'), { keyword: `%${q}%` })
            .orWhere(this.searchCaseInsensitive('CAT.slug'), { keyword: `%${q}%` });
        }),
      );
    }

    const res = await this.customPaginate<Category>(queryBuilder, page, limit);
    return this.responseOk(res);
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name, description } = createCategoryDto;

    const category = await this.categoryRepo.findOneBy({ name });
    if (category) {
      throw new BadRequestException('Category existed');
    }
    const slug = await this.commonHelper.generateSlug(name, Category);
    const newCategory = await this.categoryRepo.save({ name, slug, description });
    return this.responseOk(newCategory);
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    const { name, description } = updateCategoryDto;

    const category = await this.categoryRepo.findOneBy({ name });
    if (category) {
      throw new BadRequestException('Category existed');
    }

    if (name !== category.name) {
      category.name = name;
      category.slug = await this.commonHelper.generateSlug(name, Category);
      category.description = description;
    }

    await this.categoryRepo.save(category);
    return this.responseOk(category);
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) {
      throw new BadRequestException('Category is not found!');
    }

    await this.categoryRepo.softRemove(category);
  }
}
