import { useNavigate } from "react-router-dom";
import { Button } from "../atoms/Button";

export const ResetButton = () => {
  const navigate = useNavigate();

  const handleReset = () => {
    if (!window.confirm("学習データをリセットしてよろしいですか？")) {
      return;
    }

    try {
      localStorage.removeItem("lma:progress");
      alert("学習データをリセットしました");
      window.location.reload();
      navigate("/");
    } catch (err) {
      console.error("リセットに失敗しました", err);
    }
  };

  return (
    <Button label="学習データリセット" variant="alert" onClick={handleReset} />
  );
};
