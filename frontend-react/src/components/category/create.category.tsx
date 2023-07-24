import { FC } from 'react';

import { useCreateCategoryMutation } from '../../redux/api/category.api';
import CategoryForm from './form.category';
import { CategoryDto } from '../../redux/types';

const CategoryCreate: FC<{}> = () => {
  const [createCategory, { isLoading, isSuccess, isError, error }] =
    useCreateCategoryMutation();

  return (
    <CategoryForm
      category={null}
      submitFn={(data: CategoryDto) => createCategory(data)}
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      error={error}
    />
  );
};

export default CategoryCreate;
