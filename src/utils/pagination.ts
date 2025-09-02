export function paginate(
  data: unknown,
  count: number,
  limit: number,
  offset: number,
) {
  return {
    data,
    pageInfo: {
      pages: Math.ceil(count / limit) || 1,
      currentPage: Math.floor(offset / limit + 1),
    },
  }
}
