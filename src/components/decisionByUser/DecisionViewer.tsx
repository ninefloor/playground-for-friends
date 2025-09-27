import { transition } from "@ssgoi/react";
import { fly } from "@ssgoi/react/transitions";
import s from "./DecisionViewer.module.scss";

interface DecisionViewerProps {
  decision: string;
}

export const DecisionViewer = ({ decision }: DecisionViewerProps) => {
  const cardTransition = transition({
    key: "user-card",
    ...fly({
      opacity: 0,
      x: 0,
      y: 10,
      spring: {
        stiffness: 500,
        damping: 30,
      },
    }),
  });
  const decisionMaker = () => {
    switch (decision) {
      case "GIVE_UP":
        return "🏳️";
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
    <div className={`${s.container} ${s[decision]}`}>
      <span ref={cardTransition}>{decisionMaker()}</span>
    </div>
  );
};
