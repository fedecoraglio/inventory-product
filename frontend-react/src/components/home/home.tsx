import { FC } from 'react';
const Home: FC<{}> = () => {
  return (
    <div className="flex">
      <main className="flex-1 ml-44">
        <div className="h-96 bg-white p-10">
          <h1 className="text-4xl">
            This is the home
          </h1>
        </div>
      </main>
    </div>
  );
};

export default Home;
