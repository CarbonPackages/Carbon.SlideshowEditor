import {ActionType, getType} from 'typesafe-actions';

import {ISlideshow} from '../Slideshow';

import * as actions from './EditorAction';
import {createChannel, createState, ReadonlyState} from '@neos-project/framework-observable';

export interface IEditorState {
    editorOptions: {}
    isOpen: boolean
    initialValue: null | ISlideshow,
    nestedEditor: {
        editorKey: string,
        component: any
    } | null
}

type IEditorResult =
    | {change: true, value: null | ISlideshow}
    | {change: false}
;

const initialState: IEditorState = {
    editorOptions: {},
    isOpen: false,
    initialValue: null,
    nestedEditor: null,
};

export function editorReducer(
    state: IEditorState = initialState,
    action: ActionType<typeof actions>
): IEditorState {
    switch (action.type) {
        case getType(actions.EditorWasOpened):
            return {
                ...state,
                ...action.payload,
                isOpen: true
            };
        case getType(actions.NestedEditorWasOpened):
            return {
                ...state,
                nestedEditor: {
                    editorKey: action.payload.editorKey,
                    component: action.payload.component,
                }
            };
        case getType(actions.NestedEditorWasClosed):
            return {
                ...state,
                nestedEditor: null
            };
        case getType(actions.EditorWasDismissed):
        case getType(actions.ValueWasUnset):
        case getType(actions.ValueWasApplied):
            return initialState;
        default:
            return state;
    }
}

export function createEditor() {
    const actions$ = createChannel<ActionType<typeof actions>>();

    const dispatch = actions$.next;

    const state$ = createState(initialState);

    actions$.subscribe({
        next: (action) => state$.update(
            (current) => editorReducer(
                current,
                action
            )
        )
    })

    const dismiss = () => dispatch(actions.EditorWasDismissed());
    const unset = () => dispatch(actions.ValueWasUnset());
    const apply = (value: ISlideshow) => dispatch(actions.ValueWasApplied(value));
    const editSlideshow = (
        initialValue: null | ISlideshow,
        editorOptions: Record<string, unknown> = {}
    ) => new Promise<IEditorResult>(
        resolve => {
            dispatch(
                actions.EditorWasOpened(initialValue, editorOptions)
            );

            actions$.subscribe({
                next: action => {
                    switch (action.type) {
                        case getType(actions.EditorWasDismissed):
                            return resolve({change: false});
                        case getType(actions.ValueWasUnset):
                            return resolve({change: true, value: null});
                        case getType(actions.ValueWasApplied):
                            return resolve({change: true, value: action.payload});
                        default:
                    }
                }
            });
        }
    );

    /**
     * Used to render the media dialog from the Image editor, can be used for "renderSecondaryInspector".
     *
     * @param editorKey toggle the secondary inspector if the name is the same as before.
     * @param componentFactory this function, when called without arguments, must return the React component to be rendered.
     */
    const renderNestedEditor = (editorKey: string | undefined, componentFactory?: () => any) => {
        if (state$.current.editorKey === editorKey) {
            // We toggle the secondary inspector if it is rendered a second time; so that's why we hide it here.
            dispatch(actions.NestedEditorWasClosed());
        } else {
            if (editorKey && componentFactory) {
                // Hint: we directly resolve the factory function here, to ensure the object is not re-created on every render but stays the same for its whole lifetime.
                const component = componentFactory();
                dispatch(actions.NestedEditorWasOpened(editorKey, componentFactory));
            } else {
                dispatch(actions.NestedEditorWasClosed());
            }
        }
    }
    const closeNestedEditor = () => dispatch(actions.NestedEditorWasClosed());

    return Object.freeze({
        state$: state$ as ReadonlyState<IEditorState>,
        transactions: {dismiss, unset, apply, editSlideshow, renderNestedEditor, closeNestedEditor}
    });
}

export type IEditor = ReturnType<typeof createEditor>;
