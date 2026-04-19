export class PaginationMetadata {
  constructor(
    total: number,
    current_page: number,
    items_per_page: number,
    total_pages: number,
  ) {
    this.total = total;
    this.current_page = current_page;
    this.items_per_page = items_per_page;
    this.total_pages = total_pages;
  }

  total?: number;

  current_page?: number;

  items_per_page?: number;

  total_pages?: number;
}
