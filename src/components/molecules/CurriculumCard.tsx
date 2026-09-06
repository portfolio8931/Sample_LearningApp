import { Link } from "react-router-dom";
import type { Curriculum } from "../../types";
import { Progressbar } from "../atoms/Progressbar";

type Props = {
  curriculum: Curriculum;
  onClick?: () => void;
  current: number;
  total: number;
  percentage: number;
};

export const CurriculumCard = ({
  curriculum,
  onClick,
  current,
  total,
  percentage,
}: Props) => {
  return (
    <Link to={`/curriculums/${curriculum.id}`} onClick={onClick} className="">
      <div className="flex flex-col w-full h-auto mt-6 p-6 gap-2 bg-white rounded-lg border border-gray-200 shadow-md">
        <h3 className="font-bold text-gray-600">{curriculum.title}</h3>
        <p>{curriculum.description}</p>
        <div>
          <p className="mb-1">{`進捗: ${current} / ${total} (${percentage}％)`}</p>
          <Progressbar current={current} total={total} />
        </div>
      </div>
    </Link>
  );
};
