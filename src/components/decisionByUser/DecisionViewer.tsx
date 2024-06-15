import s from "./DecisionViewer.module.scss";

interface DecisionViewerProps {
  decision: string;
}

export const DecisionViewer = ({ decision }: DecisionViewerProps) => {
  const decisionMaker = () => {
    switch (decision) {
      case "giveup":
        return "💀";
      case "up":
        return "👍";
      case "down":
        return "👎";
      case "ok":
        return "👌";
      default:
        return decision;
    }
  };
  return (
    <div className={`${s.container} ${s[decision]}`}>{decisionMaker()}</div>
  );
};
