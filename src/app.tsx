import { useAtomValue } from "jotai";
import "./app.css";
import { Bar } from "./components/bar";
import { MainSearch } from "./components/main-search";
import { $abcCardList } from "./store";
import { EntryCard } from "./components/entry-card";
import { CSSProperties, useMemo, useState } from "react";
import { ABCLine } from "./components/abc-line";
import { CardDetails } from "./components/card-details";

export const App = () => {
  const abcCards = useAtomValue($abcCardList);
  const [scrollGuardVisible, setScrollGuardVisible] = useState(0);

  function onScrollHandler(event: React.UIEvent<HTMLDivElement>) {
    if (event.target.scrollTop <= 0) {
      setScrollGuardVisible(0);
    } else {
      setScrollGuardVisible(1);
    }
  }

  const showData = useMemo(() => {
    const data: any[] = [];

    for (let i = 0; i < abcCards.length; ++i) {
      const cards = abcCards[i];
      const letter = cards[0].title[0].toUpperCase();
      data.push(<ABCLine letter={letter} key={letter} />);
      data.push(
        ...cards.map((card) => {
          return <EntryCard card={card} key={card.id} />;
        })
      );
    }

    return data;
  }, [abcCards]);

  return (
    <div className="app">
      <MainSearch />
      <div className="app-content">
        <Bar />
        <div
          className="entries"
          style={
            { "--scroll-gurad-visible": scrollGuardVisible } as CSSProperties
          }
          onScroll={onScrollHandler}
        >
          {showData}
        </div>
        <CardDetails />
      </div>
    </div>
  );
};
