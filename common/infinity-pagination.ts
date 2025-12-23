import { InfinityPaginationResponseDto } from './dto/infinity-pagination-response.dto';
import { IPaginationOptions } from './types/pagination-options';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
  totalCount: number,
): InfinityPaginationResponseDto<T> => {
  const totalPages = Math.ceil(totalCount / options.limit);

  return {
    data,
    hasNextPage: data.length === options.limit,
    totalPages: totalPages,
    currentPage: options.page,
    totalCount: totalCount,
  };
};
