export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const getPaginationParams = (
  page?: string | number,
  limit?: string | number,
  maxPageSize: number = 100
): PaginationParams => {
  const pageNum = Math.max(1, parseInt(String(page || '1')));
  const limitNum = Math.min(
    maxPageSize,
    Math.max(1, parseInt(String(limit || '20')))
  );

  return {
    page: pageNum,
    limit: limitNum,
  };
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / params.limit);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  };
};
