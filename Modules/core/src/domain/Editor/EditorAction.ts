import {createAction} from 'typesafe-actions';

import {ISlideshow} from "../Slideshow";

export const EditorWasOpened = createAction(
    'EditorWasOpened',
    (
        initialValue: null | ISlideshow,
        editorOptions: Record<string, unknown> = {}
    ) => ({initialValue, editorOptions})
)();

export const NestedEditorWasOpened = createAction(
    'NestedEditorWasOpened',
    (
        editorKey: string,
        component: any
    ) => ({editorKey, component})
)();

export const NestedEditorWasClosed = createAction(
    'NestedEditorWasClosed'
)();

export const EditorWasDismissed = createAction(
    'EditorWasDismissed'
)();

export const ValueWasUnset = createAction(
    'ValueWasUnset'
)();

export const ValueWasApplied = createAction(
    'ValueWasApplied',
    (value: ISlideshow) => value
)();
