export type ColorListDto = Readonly<{
  count: number;
  items: ColorDto[];
}>;

export type ColorDto = Readonly<{
  id?: string | null;
  name: string;
  createdAt?: Date;
}>;
