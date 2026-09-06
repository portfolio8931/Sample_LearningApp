export const LoadingView = ({
  message = "読み込み中…",
}: {
  message?: string;
}) => {
  return (
    <div className="flex flex-col p-8 items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-gray-500 border-t-transparent animate-spin" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};
