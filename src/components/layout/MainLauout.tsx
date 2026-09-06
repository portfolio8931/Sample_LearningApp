import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Toast } from "../molecules/Toast";

export const MainLayout: React.FC = () => {
  return (
    <div>
      <header>
        <div className="flex w-full h-16 px-8 justify-between items-center text-white font-bold bg-blue-600">
          <div>
            <Link to="/" className="p-2 bg-blue-700/50 rounded">
              学習管理アプリ
            </Link>
          </div>
          <nav className="flex gap-4">
            <Link to="/">ダッシュボード</Link>
            <Link to="/curriculums">カリキュラム</Link>
            <Link to="/review">復習</Link>
            <Link to="/history">履歴</Link>
          </nav>
        </div>
      </header>
      <main className="w-full min-h-screen px-8 py-7 bg-gray-100">
        <Toast />
        <Outlet />
      </main>
    </div>
  );
};
