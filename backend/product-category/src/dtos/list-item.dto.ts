export type ListItem<T> = {
  count: number;
  items: T[];
};

export type PaginationItem = {
  limit?: number | null;
};

export type SimpleSearchParam = {
  query: string;
};

export const DEFAULT_LIMIT_PAGINATION = 10;
