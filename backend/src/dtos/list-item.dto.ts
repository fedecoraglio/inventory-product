export type ListItem<T> = {
  count: number;
  items: T[];
};

export type PaginationItem = {
  pageSize?: string | null;
  page?: string | null;
};

export type SimpleSearchParam = {
  query: string;
};

export const DEFAULT_LIMIT_PAGINATION = 40;
