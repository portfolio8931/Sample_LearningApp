import { useNavigate } from "react-router-dom";
import { Button } from "../atoms/Button";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full items-center gap-4">
      <p className="text-[100px] font-black text-gray-300">404</p>
      <h2 className="text-2xl font-extrabold">ページが見つかりません</h2>
      <p>お探しのページは存在しません。URLをご確認ください。</p>
      <div>
        <Button
          label="ダッシュボードへ戻る"
          isActive={true}
          variant="normal"
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
}

export default NotFoundPage;
