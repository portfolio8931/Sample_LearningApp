import { Link } from "react-router-dom";
import type { Chapter } from "../../types";

const getStatusBadge = (
  status: "not_started" | "in_progress" | "completed",
) => {
  switch (status) {
    case "completed":
      return (
        <span className="font-bold text-ms text-indigo-700">[✓] 完了</span>
      );
    case "in_progress":
      return (
        <span className="font-bold text-ms text-green-700">[…] 学習中</span>
      );
    case "not_started":
      return (
        <span className="font-bold text-ms text-yellow-800">[〇] 未学習</span>
      );
  }
};

type Props = {
  chapter: Chapter;
  lessonStatus?: Record<string, "not_started" | "in_progress" | "completed">;
  completedCount: number;
  totalCount: number;
};

export const ChapterCard = ({
  chapter,
  lessonStatus = {},
  completedCount,
  totalCount,
}: Props) => {
  return (
    <div className="flex flex-col w-full h-auto mt-7 p-6 gap-2 bg-gray-200/70 rounded-lg">
      <div className="flex items-center gap-5">
        <h3 className="font-bold text-gray-600">{`第${chapter.order}章: ${chapter.title}`}</h3>
        <span className="text-sm text-gray-500/70 font-bold underline">{`進捗: ${completedCount} / ${totalCount}`}</span>
      </div>
      <div>
        {chapter.lessons.map((lesson) => {
          const status = lessonStatus?.[lesson.id] ?? "not_started";

          return (
            <Link key={lesson.id} to={`/lessons/${lesson.id}`}>
              <div className="flex flex-col w-full h-auto my-4 p-6 gap-2 bg-white rounded-lg border border-gray-200 shadow-md">
                <p>{`${chapter.order}-${lesson.order} ${lesson.title}`}</p>
                <div>{getStatusBadge(status)}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
