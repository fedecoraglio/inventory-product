import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import NProgress from 'nprogress';
import { CategoryDto, CategoryListDto } from '../types';

const BASEURL = 'http://localhost:3000/v1/categories';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASEURL }),
  tagTypes: ['Categories'],
  endpoints: builder => ({
    createCategory: builder.mutation<CategoryDto, CategoryDto>({
      query(category) {
        return {
          url: '/',
          method: 'POST',
          credentials: 'include',
          body: category,
        };
      },
      onQueryStarted(arg, api) {
        NProgress.start();
      },
    }),
    updateCategory: builder.mutation<CategoryDto, {id: string, category: CategoryDto}>({
      query({id, category}) {
        return {
          url: `/${id}`,
          method: 'PUT',
          credentials: 'include',
          body: category,
        };
      },
      transformResponse: (results: CategoryDto) => results,
      onQueryStarted(arg, api) {
        NProgress.start();
      },
    }),
    getCategory: builder.query<CategoryDto, string>({
      query(id) {
        return {
          url: `/${id}`,
          credentials: 'include',
        };
      },
      transformResponse: (results: CategoryDto) => results,
      onQueryStarted(arg, api) {
        NProgress.start();
      },
    }),
    getAllCategories: builder.query<CategoryDto[], {}>({
      query() {
        return {
          url: `/`,
          credentials: 'include',
        };
      },
      transformResponse: (results: CategoryListDto) => results.items,
      onQueryStarted(arg, api) {
        NProgress.start();
      },
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoryQuery,
  useGetAllCategoriesQuery,
} = categoryApi;
