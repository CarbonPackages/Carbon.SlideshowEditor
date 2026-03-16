import React from "react";
import {Button, Icon} from '@neos-project/react-ui-components';
import style from "./style.module.css";
import {translate} from '@neos-project/neos-ui-i18n';

export const DeleteItem: React.FC<{onDelete: () => void}> = (props) => {
    return (
        <Button
            id="neos-InlineToolbar-DeleteSelectedNode"
            className={style.toolBar__btnGroup__btn}
            onClick={props.onDelete}
            hoverStyle="brand"
            style="transparent"
            size="small"
            title={translate('x:x:x', 'Delete item')}
        >
            {translate('x:x:x', 'Delete item')}
            <Icon icon="trash-alt" />
        </Button>
    );
}
