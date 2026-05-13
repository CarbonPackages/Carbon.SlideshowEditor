import React from "react";
import {IconButton} from '@neos-project/react-ui-components';
import style from "./style.module.css";
import {translate} from '@neos-project/neos-ui-i18n';
import {DragContext} from "../DragAndDropSlideItem/DragContext.ts";

export const DragItem: React.FC<{
    dragContext$: {
        update: (dragContext: DragContext) => void
    }
    startDragging: () => void
}> = ({dragContext$, startDragging}) => {

    const handleDragStart = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
        // Promote the slide-card (if present) to the browser-rendered drag preview,
        // so editors see the actual thumbnail floating with the cursor instead of
        // just the tiny grip-vertical handle.
        const targetEl = e.currentTarget as HTMLElement | null;
        const card = targetEl?.closest('[data-slide-card]') as HTMLElement | null;
        if (card && e.dataTransfer) {
            e.dataTransfer.setDragImage(card, card.offsetWidth / 2, card.offsetHeight / 2);
        }
        startDragging(e);
        dragContext$.update(() => DragContext.dragging());
    }, [startDragging, dragContext$]);

    const handleDragEnd = React.useCallback(() => {
        dragContext$.update(() => DragContext.none());
    }, [dragContext$]);

    return (
        <div
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggable={true}
        >
            <IconButton
                className={style.toolBar__btnGroup__btn}
                icon="grip-vertical"
                hoverStyle="brand"
                title={translate('Carbon.SlideshowEditor:Main:moveItem', 'Move item')}
                size="small"
            />
        </div>
    );
}
