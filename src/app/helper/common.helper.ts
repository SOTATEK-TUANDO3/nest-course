import slugify from 'slugify';
import { AppDataSource } from '../../../ormconfig';

export class CommonHelper {
  async generateSlug(
    string: string,
    entity: any,
    checkColumn: string = 'slug',
    exceptId: number = null,
    options: {
      replacement?: string; // replace spaces with replacement character, defaults to `-`
      remove?: RegExp; // remove characters that match regex, defaults to `undefined`
      lower?: boolean; // convert to lower case, defaults to `false`
      strict?: boolean; // strip special characters except replacement, defaults to `false`
      locale?: string; // language code of the locale to use
      trim?: boolean; // trim leading and trailing replacement chars, defaults to `true`
    } = {
      replacement: '-',
      remove: undefined,
      lower: true,
      strict: true,
      locale: 'vi',
      trim: true,
    },
  ): Promise<string> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    let tmpSlug = slugify(string, options);
    const queryBuilder = AppDataSource.getRepository(entity)
      .createQueryBuilder('t')
      .where(`t.${checkColumn} = :slug`, { slug: tmpSlug });
    if (exceptId) {
      queryBuilder.andWhere('t.id <> :exceptId', { exceptId });
    }
    const exist = await queryBuilder.getOne();
    if (exist) {
      tmpSlug += `${options?.replacement || '-'}${Date.now()}`;
    }

    return tmpSlug;
  }
}
