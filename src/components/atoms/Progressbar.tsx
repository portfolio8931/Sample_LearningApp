import React from "react";
import { calcProgressPercentage } from "../../utils/calcProgressPercentage";

type Props = {
  current: number;
  total: number;
};

export const Progressbar: React.FC<Props> = ({ current, total }) => {
  const percentage = calcProgressPercentage(current, total);

  return (
    <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
      <div
        className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
