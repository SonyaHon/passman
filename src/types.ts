import { nanoid } from "nanoid";
import { DetailedFeild } from "./store";

export enum FieldKind {
  Text = "text",
  SecureText = "secure_text",
}

export class DetailedCardField {}

export class DetailedCard {
  static Empty() {
    return new DetailedCard(nanoid(), "", null, []);
  }

  static FromData() {}

  private constructor(
    private id: string,
    private title: string,
    private presentedField: string | null,
    private fields: DetailedFeild[]
  ) {}

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  updateTitle(title: string) {
    this.title = title;
  }
}
