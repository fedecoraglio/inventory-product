import { FC, useEffect } from 'react';
import { TypeOf, object, string } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import NProgress from 'nprogress';
import { twMerge } from 'tailwind-merge';

import { LoadingButton } from '../common/LoadingButton';
import { CategoryDto } from '../../redux/types';
import { RouteUrl } from '../layout/url.route';

type CategoryFormType = {
  category?: CategoryDto | null;
  submitFn: Function;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: any;
};

const categoryFormSchema = object({
  name: string().min(1, 'Name is required'),
  content: string(),
  summary: string(),
});

type CategoryFormInput = TypeOf<typeof categoryFormSchema>;

const CategoryForm: FC<CategoryFormType> = ({
  submitFn,
  category,
  isLoading,
  isSuccess,
  isError,
  error,
}) => {
  const navigate = useNavigate();
  const title = category ? 'Update Category' : 'Create Category';
  const methods = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (category) {
      methods.reset(category);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Category created successfully');
      NProgress.done();
      navigate(`/${RouteUrl.CATEGORIES}`, {});
    }

    if (isError) {
      NProgress.done();
      const err = error as any;
      if (Array.isArray(err.data.error)) {
        err.data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: 'top-right',
          }),
        );
      } else {
        const resMessage =
          err.data.message || err.data.detail || err.message || err.toString();
        toast.error(resMessage, {
          position: 'top-right',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onSubmitHandler: SubmitHandler<CategoryFormInput> = async data => {
    submitFn(data);
  };

  return (
    <section>
      <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">{title}</h2>
        <div className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex cursor-pointer">
          <i className="bx bx-x"></i>
        </div>
      </div>
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="name">
            Name
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors['name'] && 'border-red-500'}`,
            )}
            {...methods.register('name')}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2 invisible`,
              `${errors['name'] && 'visible'}`,
            )}
          >
            {errors['name']?.message as string}
          </p>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors.content && 'border-red-500'}`,
            )}
            rows={6}
            {...register('content')}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2`,
              `${errors.content ? 'visible' : 'invisible'}`,
            )}
          ></p>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="summary">
            Summary
          </label>
          <textarea
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors.content && 'border-red-500'}`,
            )}
            rows={6}
            {...register('summary')}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2`,
              `${errors.content ? 'visible' : 'invisible'}`,
            )}
          ></p>
        </div>
        <LoadingButton loading={false}>{title}</LoadingButton>
      </form>
    </section>
  );
};

export default CategoryForm;
