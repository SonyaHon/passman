import { nanoid } from "nanoid";

export enum FieldVariant {
  PlainText = "Plain Text",
  Password = "Password",
  SecureText = "Secure Note",
}

export class Field {
  public id: string;
  public label: string;
  public variant: FieldVariant;
  public order: number;
  public value: string;

  constructor(
    id: string | null,
    label: string,
    variant: FieldVariant,
    order: number,
    value: string
  ) {
    this.id = id ?? nanoid();
    this.label = label;
    this.variant = variant;
    this.order = order;
    this.value = value;
  }
}

export class Entry {
  public id: string;
  public title: string;
  public displayedField: string;
  public avatar?: string;

  public fields: Field[];

  static Empty() {
    const usernameField = new Field(
      null,
      "Username",
      FieldVariant.PlainText,
      0,
      ""
    );
    return new Entry(nanoid(), "New Entry", usernameField.id, [
      usernameField,
      new Field(null, "Password", FieldVariant.Password, 1, ""),
    ]);
  }

  constructor(
    id: string,
    title: string,
    displayedField: string,
    fields: Field[],
    avatar?: string
  ) {
    this.id = id;
    this.title = title;
    this.displayedField = displayedField;
    this.fields = fields;
    this.avatar = avatar;
  }

  getAvatar() {
    if (this.avatar) {
      return { image: this.avatar };
    }
    return {
      label: this.title
        .split(" ")
        .map((e) => e[0].toUpperCase())
        .join(""),
    };
  }

  getPlainFields(): Field[] {
    return this.fields.filter(
      (field) => field.variant === FieldVariant.PlainText
    );
  }

  getFieldsInOrder() {
    return this.fields.sort((a, b) => {
      return a.order - b.order;
    });
  }

  getField(fieldId: string): Field | undefined {
    return this.fields.find((field) => {
      return field.id === fieldId;
    });
  }
}
