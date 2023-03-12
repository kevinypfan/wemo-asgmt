export class PageRequest {
  constructor(page = 0, size = 20, sorts) {
    this.page = +page;
    this.size = +size === 0 ? Number.MAX_SAFE_INTEGER : +size;
    this.sorts = sorts;
  }

  page?: number = 0;

  size?: number = 20;

  sorts?: string;

  public get take() {
    return this.size;
  }

  public get skip() {
    return this.page * this.size;
  }

  public get order() {
    const order = {};

    if (this.sorts) {
      this.sorts.split(';').forEach((sort) => {
        const [key, direction] = sort.split(',');
        order[key] = direction.toUpperCase();
      });
    }
    return order;
  }
}
