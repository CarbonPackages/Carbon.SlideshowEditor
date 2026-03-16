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

    const handleDragStart = React.useCallback((e) => {
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
                title={translate('x:x:x', 'Move item')}
                size="small"
            />
        </div>
    );
}
