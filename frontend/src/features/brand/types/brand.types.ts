export type BrandListDto = Readonly<{
  count: number;
  items: BrandDto[];
}>;

export type BrandDto = Readonly<{
  id?: string | null;
  name: string;
  createdAt?: Date;
}>;
