import React from "react";
import {Button, Icon} from '@neos-project/react-ui-components';
import style from "./style.module.css";
import {translate} from '@neos-project/neos-ui-i18n';

export const DeleteItem: React.FC<{onDelete: () => void; label?: string}> = (props) => {
    const label = props.label ?? translate('Carbon.SlideshowEditor:Main:deleteItem', 'Delete item');
    return (
        <Button
            className={style.toolBar__btnGroup__btn}
            onClick={props.onDelete}
            hoverStyle="brand"
            style="transparent"
            size="small"
        >
            {label}
            <Icon icon="trash-alt" />
        </Button>
    );
}
