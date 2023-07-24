import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import CategoryList from './components/category/list.category';
import CategoryCreate from './components/category/create.category';
import Layout from './components/layout/layout';
import Home from './components/home/home';
import CategoryEdit from './components/category/edit.category';
import { RouteUrl } from './components/layout/url.route';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path={RouteUrl.CATEGORIES} element={<CategoryList />} />
            <Route path="categories/:id" element={<CategoryEdit />} />
            <Route
              path={`${RouteUrl.CATEGORIES}/new`}
              element={<CategoryCreate />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
