import { FC, useEffect } from 'react';
import NProgress from 'nprogress';
import {
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from '../../redux/api/category.api';
import CategoryForm from './form.category';
import { CategoryDto } from '../../redux/types';
import { useParams } from 'react-router-dom';

const CategoryEdit: FC<{}> = () => {
  const param: any = useParams();
  const [
    updateCategory,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error,
    },
  ] = useUpdateCategoryMutation();

  const {
    data,
    isSuccess: isSuccessGet,
    isFetching: isFetchingGet,
    isLoading: isLoadingGet,
    isError: isErrorGet,
  } = useGetCategoryQuery(param.id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const loading = isLoadingGet || isFetchingGet;

  useEffect(() => {
    if (isSuccessGet || isErrorGet) {
      NProgress.done();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <>
      {data && (
        <CategoryForm
          category={data}
          submitFn={(data: CategoryDto) =>
            updateCategory({ id: param.id, category: data })
          }
          isLoading={isLoadingUpdate}
          isSuccess={isSuccessUpdate}
          isError={isErrorUpdate}
          error={error}
        />
      )}
    </>
  );
};

export default CategoryEdit;
