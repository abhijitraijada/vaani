import { useState } from 'react';
import { Link } from 'react-router-dom';
import viteLogo from '/vite.svg';
import reactLogo from '../assets/react.svg';

export default function TempHome() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="my-4">
        <Link to="/components" className="text-blue-600 underline">Open Components Showcase</Link>
      </div>
      <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-red-500 hover:scale-105 transition-transform md:text-5xl">Tailwind is working</h1>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}