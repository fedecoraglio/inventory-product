export type SupplierListDto = Readonly<{
  count: number;
  items: SupplierDto[];
}>;

export type SupplierDto = Readonly<{
  id?: string | null;
  name: string;
  description: string;
  email: string;
  phoneNumber: string;
  createdAt?: Date;
}>;
