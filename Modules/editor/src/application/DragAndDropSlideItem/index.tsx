import React from "react";
import {DragContext} from "./DragContext.ts";
import style from './style.module.css';

export const DRAG_APPLICATION_ID = 'application/carbon-slide-item';

export const startDraggingSlideItemFactoryFn = (slideItemId: string) => (event: React.DragEvent<HTMLElement>) => {
    if (!event.dataTransfer) {
        return;
    }
    // hack https://github.com/react-dnd/react-dnd/issues/3344
    event.stopPropagation();
    event.dataTransfer.setData(DRAG_APPLICATION_ID, slideItemId);
    // hack https://github.com/ckeditor/ckeditor5/issues/16898
    event.dataTransfer.setData('application/neos-ui', '{}');
}

export const DragAndDropSlideItem: React.FC<{
    targetSlideItemId: string | null
    dragContext$: {
        update: (dragContext: DragContext) => void
    }
    moveSlideItem: (slideItemId: string) => void
}> = (props) => {
    const handleDragOver = React.useCallback((ev: React.DragEvent<HTMLElement>) => {
        // Only handle the events which match our intent
        if (!ev.dataTransfer || !ev.dataTransfer.types.includes(DRAG_APPLICATION_ID)) {
            return;
        }

        // hack https://github.com/react-dnd/react-dnd/issues/3344
        ev.stopPropagation();
        // prevent default to allow drop
        ev.preventDefault();
    }, []);

    const handleDragEnter = React.useCallback((ev: React.DragEvent<HTMLElement>) => {
        if (!ev.dataTransfer || !ev.dataTransfer.types.includes(DRAG_APPLICATION_ID)) {
            return;
        }

        props.dragContext$.update(dragContext => dragContext.withDragover(props.targetSlideItemId));

        ev.stopPropagation();
    }, [props.targetSlideItemId, props.dragContext$]);

    const handleDragLeave = React.useCallback((ev: React.DragEvent<HTMLElement>) => {
        if (!ev.dataTransfer || !ev.dataTransfer.types.includes(DRAG_APPLICATION_ID)) {
            return;
        }

        props.dragContext$.update(dragContext => dragContext.withoutDragover());

        // hack https://github.com/react-dnd/react-dnd/issues/3344
        ev.stopPropagation();
    }, [props.targetSlideItemId, props.dragContext$]);

    const handleDrop = React.useCallback((ev: React.DragEvent<HTMLElement>) => {
        // Only handle the events which match our intent
        if (!ev.dataTransfer || !ev.dataTransfer.types.includes(DRAG_APPLICATION_ID)) {
            return;
        }
        const draggedSlideItemId = ev.dataTransfer.getData(DRAG_APPLICATION_ID);
        if (!draggedSlideItemId) {
            return;
        }

        // hack https://github.com/react-dnd/react-dnd/issues/3344
        ev.stopPropagation();

        ev.preventDefault();

        props.moveSlideItem(draggedSlideItemId);
    }, [props.moveSlideItem]);

    return (
        <div
            className={style.displayContents}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            {props.children}
        </div>
    );
};
