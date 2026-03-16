import React from "react";
import {translate} from '@neos-project/neos-ui-i18n';
import {Button, Icon} from '@neos-project/react-ui-components';
import style from './style.module.css';

let globalId = 0;

export const InlineToolbar: React.FC<{label: string, icon: string, primaryToolBar: React.ReactNode[], secondaryToolbar: React.ReactNode[]}> = (props) => {
    const id = React.useMemo(() => ++globalId, []);

    const popoverId = `carbon-SlideItemToolBar-popover-${id}`;
    const anchorId = `carbon-SlideItemToolBar-anchor-${id}`;

    return <div className={style.contextToolBar} style={{'--carbon-SlideItemToolBar-anchor-name': anchorId}}>
        <div data-carbon-inline-toolbar>
            {props.primaryToolBar}
            <div className={style.toolBar__contextMenuWrapper}>
                <Button
                    className={style.contextToolbar__nodeLabel}
                    title={translate('x:x:x', 'Toggle context menu')}
                    hoverStyle="brand"
                    popovertarget={popoverId}
                    style="transparent"
                    size="small"
                >
                    <Icon icon={props.icon}/>
                    <span>{props.label}</span>
                    <Icon icon="ellipsis-vertical"/>
                </Button>
            </div>
            <div
                id={popoverId}
                className={style.toolBar__contextMenu}
                popover="auto"
            >
                <div className={style.toolBar__btnGroupVertical}>
                    {props.secondaryToolbar}
                </div>
            </div>
        </div>
    </div>;
}
