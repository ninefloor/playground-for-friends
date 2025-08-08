import { CircleButton } from "@components/atoms/Buttons";
import { useState } from "react";
import { Wheel } from "react-custom-roulette-r19";
import s from "./RouletteForDraw.module.scss";

export const RouletteForDraw = ({
  setResultValue,
}: {
  setResultValue: (prev: { L: number; R: number }) => void;
}) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prize, setPrize] = useState<number | null>(null);
  const data = [
    {
      option: "L",
      style: { backgroundColor: "#EC4758", textColor: "#ffffff" },
    },
    {
      option: "R",
      style: { backgroundColor: "#1a7bb9", textColor: "#ffffff" },
    },
    {
      option: "L",
      style: { backgroundColor: "#EC4758", textColor: "#ffffff" },
    },
    {
      option: "R",
      style: { backgroundColor: "#1a7bb9", textColor: "#ffffff" },
    },
    {
      option: "L",
      style: { backgroundColor: "#EC4758", textColor: "#ffffff" },
    },
    {
      option: "R",
      style: { backgroundColor: "#1a7bb9", textColor: "#ffffff" },
    },
  ];

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrize(newPrizeNumber);
    setMustSpin(true);
  };

  return (
    <div className={s.container}>
      <div className={s.rouletteContainer}>
        <Wheel
          mustStartSpinning={mustSpin}
          spinDuration={0.5}
          data={data}
          prizeNumber={prize ?? 0}
          fontFamily={"chaney"}
          fontSize={64}
          outerBorderWidth={0}
          radiusLineWidth={1}
          radiusLineColor="#fff"
          onStopSpinning={() => {
            setMustSpin(false);
            // setResult(() => (prize % 2 === 0 ? 'left' : 'right'));
            setResultValue((prev) => {
              const newObj = { ...prev };
              if (prize && prize % 2 === 0) newObj.L += 1;
              else newObj.R += 1;
              return newObj;
            });
          }}
        />
        <CircleButton className="spinBtn" onClick={handleSpinClick}>
          GO
        </CircleButton>
      </div>
    </div>
  );
};
