import React from "react";
import {IconButton} from '@neos-project/react-ui-components';
import style from "./style.module.css";
import {translate} from '@neos-project/neos-ui-i18n';

export const DragItem: React.FC<{}> = (props) => {
    return (
        <div onDragStart={console.log} draggable>
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
