import NProgress from 'nprogress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {RouteUrl} from '../layout/url.route';
import { useGetAllCategoriesQuery } from '../../redux/api/category.api';

const CategoryList = () => {
  const { isLoading, isFetching, data, isSuccess, isError } =
    useGetAllCategoriesQuery(
      {},
      { refetchOnFocus: true, refetchOnReconnect: true },
    );
  const loading = isLoading || isFetching;
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      NProgress.done();
    }

    if (isError) {
      NProgress.done();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const renderItems = () => {
    if (data) {
      return data?.map(category => {
        return (
          <tr
            key={category.categoryId}
            className="border-b dark:border-neutral-500 text-justify "
          >
            <td className="whitespace-normal px-4 py-4 w-2/12">
              {category.name}
            </td>
            <td className="whitespace-normal px-4 py-4w-12 w-4/12">
              {category.content}
            </td>
            <td className="whitespace-normal px-4 py-4 w-12 w-4/12">
              {category.summary}
            </td>
            <td className="whitespace-normal px-4 py-4 w-12 w-2/12">
              <a href="#" onClick={() => navigate(`/categories/${category.categoryId}`)}>
                <FontAwesomeIcon className="p-5" icon={faPencil} />
              </a>
            </td>
          </tr>
        );
      });
    }
  };

  const renderHeader = () => {
    return (
      <tr>
        <th scope="col" className="px-4 py-4 w-2/12">
          Name
        </th>
        <th scope="col" className="px-4 py-4 w-5/12">
          Content
        </th>
        <th scope="col" className="px-4 py-4 w-5/12">
          Summary
        </th>
        <th scope="col" className="px-4 py-4 w-5/12">
          Actions
        </th>
      </tr>
    );
  };

  return (
    <>
      <div className="flex flex-1 justify-between">
        <h1 className="text-lg">Categories</h1>
        <button
          type="button"
          className="bg-blue-700 text-white w-40 rounded-lg py-3 font-semibold justify-center"
          onClick={() => navigate(`/${RouteUrl.CATEGORIES_NEW}`)}
        >
          New
        </button>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  {renderHeader()}
                </thead>
                <tbody>{renderItems()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryList;
