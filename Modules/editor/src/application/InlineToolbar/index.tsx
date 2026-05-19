import React from "react";
import {translate} from '@neos-project/neos-ui-i18n';
import {Button, Icon} from '@neos-project/react-ui-components';
import style from './style.module.css';

let globalId = 0;

export const InlineToolbar: React.FC<{label: string, icon: string, primaryToolBar: React.ReactNode[], secondaryToolbar: React.ReactNode[]}> = (props) => {
    const id = React.useMemo(() => ++globalId, []);

    const popoverId = `carbon-SlideItemToolBar-popover-${id}`;
    // CSS `anchor-name` must be a <dashed-ident> (lead with `--`), otherwise
    // both `anchor-name` and `position-anchor` are dropped and the popover
    // anchor()s fall back to a viewport-corner default.
    const anchorId = `--carbon-SlideItemToolBar-anchor-${id}`;

    return <div className={style.itemAndToolBarContainer}>
        <div className={style.contextToolBar} style={{'--carbon-SlideItemToolBar-anchor-name': anchorId}}>
            <div className={style.inlineToolBar}>
                {props.primaryToolBar}
                <div className={style.toolBar__contextMenuWrapper}>
                    <Button
                        className={style.contextToolbar__nodeLabel}
                        title={translate('Carbon.SlideshowEditor:Main:toggleContextMenu', 'Toggle context menu')}
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
        </div>
        {props.children}
    </div>;
}
