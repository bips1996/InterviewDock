import { Difficulty } from "@/types";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  const getBadgeClasses = () => {
    switch (difficulty) {
      case Difficulty.EASY:
        return "bg-green-50 text-green-700 border-green-200";
      case Difficulty.MEDIUM:
        return "bg-orange-50 text-orange-700 border-orange-200";
      case Difficulty.HARD:
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getDisplayText = () => {
    switch (difficulty) {
      case Difficulty.EASY:
        return "Easy";
      case Difficulty.MEDIUM:
        return "Medium";
      case Difficulty.HARD:
        return "Hard";
      default:
        return difficulty;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getBadgeClasses()}`}
    >
      {getDisplayText()}
    </span>
  );
};
