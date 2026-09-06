import { useNavigate } from "react-router-dom";

export type FormattedAttemptItem = {
  id: string;
  lessonId: string;
  lessonTitle: string;
  formattedDate: string;
  correctCount: number;
  totalQuestions: number;
};

type Props = {
  items: FormattedAttemptItem[];
};

export const AttemptHistoryList = ({ items }: Props) => {
  const navigate = useNavigate();

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">学習履歴がありません</p>;
  }

  return (
    <div className="max-h-100 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(`/lessons/${item.lessonId}`)}
          className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{item.formattedDate}</span>
            <span className="font-bold text-gray-900">
              「{item.lessonTitle}」
            </span>
          </div>
          <div>
            <span className="font-bold text-blue-600">
              {item.correctCount} / {item.totalQuestions}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
