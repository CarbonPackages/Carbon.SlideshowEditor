import React from "react";
import {translate} from '@neos-project/neos-ui-i18n';
import {Button, Icon, IconButton} from '@neos-project/react-ui-components';
import style from './style.module.css';

export const InlineToolbar: React.FC<{}> = ({}) => {
    return <div className={style.contextToolBar} id="neos-ContextToolbar">
        <div data-carbon-inline-toolbar>
            <div onDragStart={console.log} draggable>
                <IconButton
                    id="neos-InlineToolbar-DragSelectedNode"
                    className={style.toolBar__btnGroup__btn}
                    icon="grip-vertical"
                    hoverStyle="brand"
                    title={translate('x:x:x', 'Move item')}
                    size="small"
                />
            </div>
            <div className={style.toolBar__contextMenuWrapper}>
                <Button
                    className={style.contextToolbar__nodeLabel}
                    title={translate('x:x:x', 'Toggle context menu')}
                    hoverStyle="brand"
                    style="transparent"
                    size="small"
                >
                    <Icon icon={'image'}/>
                    <span>{'SomeText'}</span>
                    <Icon icon="ellipsis-vertical"/>
                </Button>
            </div>
        </div>
    </div>;
}
