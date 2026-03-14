import * as React from "react";
import {
    ImageSlideItemBuilder,
    SlideBuilder,
    TextSlideItemBuilder,
    VideoSlideItemBuilder
} from "@carbon/slideshoweditor-core";
import {IconButton, Icon, Button} from '@neos-project/react-ui-components';
import style from './style.module.css';

export const AddSlideItem: React.FC<{
    createdSlideItem: (slideBuilder: SlideBuilder) => void;
}> = ({createdSlideItem}) => {
    return <div className={style.addRow}>
        <div
            id="carbon-SlideshowEditor-popover"
            popover="auto"
            className={style.addContents}
        >
            <div className={style.addContentsGrid}>
                <Button popovertarget="carbon-SlideshowEditor-popover" onClick={() => createdSlideItem(TextSlideItemBuilder.createEmpty())}><Icon icon="paragraph" />&nbsp; Text</Button>
                <Button popovertarget="carbon-SlideshowEditor-popover" onClick={() => createdSlideItem(ImageSlideItemBuilder.createEmpty())}><Icon icon="image" />&nbsp; Image</Button>
                <Button popovertarget="carbon-SlideshowEditor-popover" onClick={() => createdSlideItem(VideoSlideItemBuilder.createEmpty())}><Icon icon="play" />&nbsp; Video</Button>
            </div>
        </div>
        <IconButton
            icon="plus"
            popovertarget="carbon-SlideshowEditor-popover"
            style="lighter"
            hoverStyle="brand"
            className={style.addButton}
        >
        </IconButton>
    </div>;
}
