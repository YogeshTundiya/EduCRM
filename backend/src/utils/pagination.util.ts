export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export function getPagination(params: PaginationParams, defaultPageSize = 20) {
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.max(1, Math.min(100, Number(params.pageSize) || defaultPageSize));
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { page, pageSize, skip, take };
}
