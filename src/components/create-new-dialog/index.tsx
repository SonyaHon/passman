/**
 * BUGS:
 */

import {useAtomValue} from "jotai";
import {Dialog} from "primereact/dialog";
import {$appState, $editingEntry, AppState, useStopEdit} from "../../store";
import {Avatar} from "primereact/avatar";

import {Dropdown, DropdownChangeEvent} from "primereact/dropdown";

import "./index.css";
import {Field, FieldVariant} from "../../entry";
import {Button} from "primereact/button";
import {InplaceInput} from "./inplace-input";
import {DragEventHandler, useEffect, useRef, useState} from "react";
import {FieldInput} from "./field-input";
import {invoke} from "@tauri-apps/api";

export const CreateNewDialog = () => {
    const appState = useAtomValue($appState);
    const entry = useAtomValue($editingEntry)!;
    const stopEditing = useStopEdit();

    const [data, setData] = useState({
        id: entry.id,
        avatar: entry.avatar,
        title: entry.title,
        fields: entry.getFieldsInOrder(),
        displayedField: entry.displayedField,
    });

    const avatarData = data.avatar
        ? {image: data.avatar}
        : {
            label: data.title
                .split(" ")
                .map((e) => (e[0] ? e[0].toUpperCase() : ""))
                .join("")
                .slice(0, 2),
        };

    const displayFieldOptions = data.fields.filter(
        (field) => field.variant === FieldVariant.PlainText
    );

    const [titleEdit, setTitleEdit] = useState(false);
    const onTitleChange = (newTitle: string) => {
        setData({...data, title: newTitle});
    };

    const onDisplayedFieldChange = (e: DropdownChangeEvent) => {
        setData({...data, displayedField: e.value});
    };
    useEffect(() => {
        if (
            displayFieldOptions.findIndex(
                (field) => field.id === data.displayedField
            ) === -1
        ) {
            setData({...data, displayedField: (displayFieldOptions[0] || {}).id});
        }
    }, [displayFieldOptions.length]);

    const addNewField = () => {
        const newData = {...data, fields: [...data.fields]};
        newData.fields.push(
            new Field(
                null,
                "Empty field",
                FieldVariant.PlainText,
                data.fields[data.fields.length - 1].order + 1,
                ""
            )
        );
        setData(newData);
    };

    const Header = () => {
        return (
            <div className="header">
                <Avatar {...avatarData} />
                <InplaceInput
                    className="title"
                    edit={titleEdit}
                    onToggle={() => setTitleEdit(!titleEdit)}
                    value={data.title}
                    onChange={onTitleChange}
                />
                <Dropdown
                    disabled={displayFieldOptions.length === 0}
                    value={data.displayedField}
                    options={displayFieldOptions}
                    optionLabel="label"
                    optionValue="id"
                    style={{width: 200}}
                    onChange={onDisplayedFieldChange}
                />
            </div>
        );
    };

    const onSave = () => {
        console.debug("Data:", data);
        invoke("create_new_entry", {
            entry: {
                ...data,
                displayedField: data.fields.find(field => field.id === data.displayedField),
            }
        });
    };

    const Footer = () => {
        return (
            <div>
                <Button label="+ Add Field" onClick={addNewField}/>
                <Button label="Save" onClick={onSave}/>
            </div>
        );
    };

    const [dragging, setDragging] = useState(false);
    const [draggedField, setDraggedField] = useState("");
    const [draggedOverField, setDraggedOverField] = useState(data.fields[0].id);
    const [draggedOverTop, setDraggedOverTop] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const onDragOver: DragEventHandler<HTMLDivElement> = (e) => {
        if (containerRef.current) {
            const containerElements = [...containerRef.current.children].filter(
                (el) => el.tagName === "DIV"
            );
            const draggedFieldY =
                containerElements
                    .find((element) => element.getAttribute("field-id") === draggedField)
                    ?.getBoundingClientRect().y || 0;
            const dragY = e.clientY;
            const draggedOverField = containerElements.find((element) => {
                const {top, bottom} = element.getBoundingClientRect();
                return top <= dragY && dragY <= bottom;
            });
            if (draggedOverField) {
                setDraggedOverField(
                    draggedOverField.getAttribute("field-id") as string
                );
                setDraggedOverTop(dragY <= draggedFieldY);
                return;
            }
            const first = containerElements[0];
            const last = containerElements[containerElements.length - 1];
            if (dragY <= first.getBoundingClientRect().top) {
                setDraggedOverField(first.getAttribute("field-id") as string);
                setDraggedOverTop(true);
            } else {
                setDraggedOverField(last.getAttribute("field-id") as string);
                setDraggedOverTop(false);
            }
        }
    };

    const onDragEnd = (draggedField: Field) => {
        setDragging(false);
        let newFields: any[] = [];
        const startPos = draggedField.order;
        const endPos = data.fields.findIndex((f) => f.id === draggedOverField);

        console.debug(containerRef.current, draggedOverField, startPos, endPos);

        if (startPos === endPos) {
            return;
        }

        if (startPos < endPos) {
            const affectedFields = data.fields.slice(startPos + 1, endPos + 1);

            draggedField.order = endPos;
            newFields = [
                ...data.fields.slice(0, startPos),
                ...affectedFields.map((field) => {
                    field.order -= 1;
                    return field;
                }),
                draggedField,
                ...data.fields.slice(endPos + 1, data.fields.length),
            ];
        } else {
            const affectedFields = data.fields.slice(endPos, startPos);
            draggedField.order = endPos;
            newFields = [
                ...data.fields.slice(0, endPos),
                draggedField,
                ...affectedFields.map((f) => {
                    f.order += 1;
                    return f;
                }),
                ...data.fields.slice(startPos + 1, data.fields.length),
            ];
        }

        setData({...data, fields: newFields});
    };

    const onDragStart = (id: string) => {
        setDraggedField(id);
        setDragging(true);
    };

    return (
        <Dialog
            draggable={false}
            style={{minWidth: "50vw"}}
            header={<Header/>}
            footer={<Footer/>}
            onHide={stopEditing}
            visible={appState === AppState.Editing}
            className="edit-dialog"
        >
            <div className="container" onDragOver={onDragOver} ref={containerRef}>
                {data.fields.map((field, index) => {
                    return (
                        <>
                            {dragging &&
                                field.id === draggedOverField &&
                                draggedOverTop &&
                                draggedField !== field.id && (
                                    <hr
                                        key={`divider-${index}-top`}
                                        style={{color: "var(--primary-color)"}}
                                    />
                                )}
                            <FieldInput
                                onDragStart={() => onDragStart(field.id)}
                                onDragEnd={() => onDragEnd(field)}
                                key={index}
                                field={field}
                                onRemove={() => {
                                    const newData = {...data, fields: [...data.fields]};
                                    newData.fields.splice(index, 1);
                                    newData.fields.forEach((field, index) => {
                                        field.order = index;
                                    });
                                    setData(newData);
                                }}
                                onChange={(f) => {
                                    const newData = {...data, fields: [...data.fields]};
                                    newData.fields[index] = f;
                                    setData(newData);
                                }}
                            />
                            {dragging &&
                                field.id === draggedOverField &&
                                !draggedOverTop &&
                                draggedField !== field.id && (
                                    <hr
                                        key={`divider-${index}-bottom`}
                                        style={{color: "var(--primary-color)"}}
                                    />
                                )}
                        </>
                    );
                })}
            </div>
        </Dialog>
    );
};
