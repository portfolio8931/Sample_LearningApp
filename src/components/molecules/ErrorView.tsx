import { Button } from "../atoms/Button";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export const ErrorView = ({
  message = "データの読み込みに失敗しました",
  onRetry = () => window.location.reload(),
}: Props) => {
  return (
    <div className="flex flex-col mt-3 items-center gap-4">
      <p className="text-red-600">{message}</p>
      {onRetry && <Button label="再試行" variant="mono" onClick={onRetry} />}
    </div>
  );
};
