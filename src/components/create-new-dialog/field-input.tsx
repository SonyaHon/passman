import React, { useEffect, useRef, useState } from "react";
import { Field, FieldVariant } from "../../entry";
import { InplaceInput } from "./inplace-input";
import { InputText } from "primereact/inputtext";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";

import "./field-input.css";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

export interface FieldInputProps {
  field: Field;
  onChange: (newField: Field) => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const FieldInput: React.FC<FieldInputProps> = ({
  field,
  onChange,
  onRemove,
  onDragEnd,
  onDragStart,
}) => {
  const [editingLabel, setEditingLabel] = useState(false);

  const [fieldType, setFieldType] = useState(
    field.variant === FieldVariant.PlainText ? "text" : "password"
  );

  useEffect(() => {
    setFieldType(
      field.variant === FieldVariant.PlainText ? "text" : "password"
    );
  }, [field.variant]);

  const toggleEye = () => {
    setFieldType(fieldType === "text" ? "password" : "text");
  };

  const onLabelChange = (value: string) => {
    onChange(
      new Field(field.id, value, field.variant, field.order, field.value)
    );
  };

  const onValueChange = (e: any) => {
    onChange(
      new Field(
        field.id,
        field.label,
        field.variant,
        field.order,
        e.target.value
      )
    );
  };

  const onVariantChange = (e: any) => {
    onChange(
      new Field(field.id, field.label, e.value, field.order, field.value)
    );
  };

  const onDeleteConfirm = (event: any) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to delete this field?",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 danger-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      ),
      accept: () => {
        onRemove();
      },
    });
  };

  const mainInputClasses = [
    {
      [FieldVariant.Password]: "password-field",
      [FieldVariant.SecureText]: "secure-field",
      [FieldVariant.PlainText]: "plain-field",
    }[field.variant],
  ].join(" ");

  const [dragTarget, setDragTarget] = useState(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [fieldClassList, setFieldClassList] = useState(["field"]);

  const onFieldMouseDown = (e: any) => {
    setDragTarget(e.target);
  };

  const onFieldDragStart = (e: any) => {
    if (handleRef.current && handleRef.current.contains(dragTarget)) {
      onDragStart();
    } else {
      e.preventDefault();
    }
  };

  const onFieldDragEnd = (e: any) => {
    onDragEnd();
  };

  return (
    <div
      className={fieldClassList.join(" ")}
      field-id={field.id}
      draggable
      onDragStart={onFieldDragStart}
      onDragEnd={onFieldDragEnd}
      onMouseDown={onFieldMouseDown}
    >
      <div className="field-title">
        <InplaceInput
          value={field.label}
          onChange={onLabelChange}
          edit={editingLabel}
          onToggle={() => setEditingLabel(!editingLabel)}
        />
        <div className="controls">
          <Dropdown
            value={field.variant}
            options={Object.values(FieldVariant)}
            onChange={onVariantChange}
          />
          <ConfirmPopup />
          <Button label="Delete" severity="danger" onClick={onDeleteConfirm} />
        </div>
      </div>
      <div className="field-content">
        <div className="drag-handle" ref={handleRef}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
          </svg>
        </div>
        <InputText
          className={mainInputClasses}
          onChange={onValueChange}
          type={fieldType}
        />
        {field.variant !== FieldVariant.PlainText && (
          <div className="eyeButton" onClick={toggleEye}>
            {fieldType === "password" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
