import { FC } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout: FC<{}> = () => {
  const navigate = useNavigate();

  return (
    <div className="flex">
      <aside className="w-44 fixed left-0 top-0 h-screen bg-blue-700 p-10">
        <h1 className="text-white text-4xl"></h1>
        <ul className="text-white">
          <li className="pb-4">
            <a href="#" onClick={() => navigate('/home')}>
              Home
            </a>
          </li>
          <li className="pb-4">
            <a href="#" onClick={() => navigate('/categories')}>
              Categories
            </a>
          </li>
        </ul>
      </aside>
      <main className="flex-1 ml-10">
        <div className="h-full bg-white p-10 mb-10">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
