import * as React from "react";
import {
    ImageSlideItemBuilder,
    SlideBuilder,
    TextSlideItemBuilder,
    VideoSlideItemBuilder
} from "@carbon/slideshoweditor-core";
import {IconButton, Icon, Button} from '@neos-project/react-ui-components';
import {translate} from '@neos-project/neos-ui-i18n';
import mergeClassNames from 'classnames';
import style from './style.module.css';

let globalId = 0;

export const AddSlideItem: React.FC<{
    isDragging: boolean,
    isDragover: boolean,
    createdSlideItem: (slideBuilder: SlideBuilder) => void;
}> = ({isDragging, isDragover, createdSlideItem}) => {
    const id = React.useMemo(() => ++globalId, []);

    const popoverId = `carbon-SlideItemAdd-popover-${id}`;
    const anchorId = `carbon-SlideItemAdd-anchor-${id}`;

    return <div className={mergeClassNames(style.addRow, {[style.addRowHover]: isDragging})} style={{'--carbon-SlideItemAdd-anchor-name': anchorId}}>
        <div
            id={popoverId}
            popover="auto"
            className={style.addContents}
        >
            <div className={style.addContentsGrid}>
                <Button popovertarget={popoverId} onClick={() => createdSlideItem(TextSlideItemBuilder.createEmpty())}>
                    <Icon icon="paragraph" />&nbsp;{translate('Carbon.SlideshowEditor:Main:addText', 'Add text')}
                </Button>
                <Button popovertarget={popoverId} onClick={() => createdSlideItem(ImageSlideItemBuilder.createEmpty())}>
                    <Icon icon="image" />&nbsp;{translate('Carbon.SlideshowEditor:Main:addImage', 'Add image')}
                </Button>
                <Button popovertarget={popoverId} onClick={() => createdSlideItem(VideoSlideItemBuilder.createEmpty())}>
                    <Icon icon="play" />&nbsp;{translate('Carbon.SlideshowEditor:Main:addVideo', 'Add video')}
                </Button>
            </div>
        </div>
        <IconButton
            icon={isDragging ? 'paste' : "plus"}
            popovertarget={popoverId}
            style="lighter"
            hoverStyle="brand"
            className={mergeClassNames(style.addButton, {[style.addButtonHover]: isDragover})}
            title={translate('Carbon.SlideshowEditor:Main:insertItem', 'Insert item')}
        >
        </IconButton>
    </div>;
}
