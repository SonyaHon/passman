import { atom } from "jotai";
import { faker } from "@faker-js/faker";
import { EntryCardData } from "./components/entry-card";
import { DetailedCard } from "./types";

function genRandomCard(): EntryCardData {
  return {
    id: faker.string.nanoid(),
    title: faker.company.name(),
    createdAt: faker.date.past(),
    presentedField: faker.internet.email(),
    icon: faker.internet.avatar(),
  };
}

export const $showCards = atom<EntryCardData[]>(
  new Array(100)
    .fill(0)
    .map(genRandomCard)
    .sort(function (a, b) {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    })
);

export const $abcCardList = atom((get) => {
  const result: EntryCardData[][] = [[]];
  const value = get($showCards);

  let currentLetter = value[0].title[0].toUpperCase();
  for (let i = 0; i < value.length; ++i) {
    const letter = value[i].title[0].toUpperCase();
    if (currentLetter === letter) {
      result[result.length - 1].push(value[i]);
    } else {
      result.push([]);
      result[result.length - 1].push(value[i]);
      currentLetter = value[i].title[0].toUpperCase();
    }
  }

  return result;
});

export const $selectedEntry = atom<DetailedCard | null>(null);
