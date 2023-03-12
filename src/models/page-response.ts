import { PageRequest } from './page-request';

export class PageResponse<T> {
  constructor(content: T[], totalElements: number, pagination: PageRequest) {
    const page = pagination.page || 0;
    const size = pagination.size || 20;

    this.content = content;
    this.totalElements = totalElements;
    this.size = size;
    this.number = page;
    this.last = size * (page + 1) > totalElements;
    this.numberOfElements = content.length;
    this.totalPages = Math.ceil(totalElements / size);
  }

  content: T[];

  totalElements: number;

  totalPages: number;

  last: boolean;

  number: number;

  size: number;

  numberOfElements: number;
}
