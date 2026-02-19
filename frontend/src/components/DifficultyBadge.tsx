import { Difficulty } from "@/types";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  const getBadgeClass = () => {
    switch (difficulty) {
      case Difficulty.EASY:
        return "badge-easy";
      case Difficulty.MEDIUM:
        return "badge-medium";
      case Difficulty.HARD:
        return "badge-hard";
      default:
        return "badge-medium";
    }
  };

  return <span className={`badge ${getBadgeClass()}`}>{difficulty}</span>;
};
