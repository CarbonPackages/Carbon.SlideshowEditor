import * as React from "react";
import {
    ImageSlideItemBuilder,
    SlideBuilder,
    TextSlideItemBuilder,
    VideoSlideItemBuilder
} from "@carbon/slideshoweditor-core";
import {IconButton, Icon, Button} from '@neos-project/react-ui-components';
import {translate} from '@neos-project/neos-ui-i18n';
import style from './style.module.css';

let globalId = 0;

export const AddSlideItem: React.FC<{
    createdSlideItem: (slideBuilder: SlideBuilder) => void;
}> = ({createdSlideItem}) => {
    const id = React.useMemo(() => ++globalId, []);

    const popoverId = `carbon-SlideItemAdd-popover-${id}`;
    const anchorId = `carbon-SlideItemAdd-anchor-${id}`;

    return <div className={style.addRow} style={{'--carbon-SlideItemAdd-anchor-name': anchorId}}>
        <div
            id={popoverId}
            popover="auto"
            className={style.addContents}
        >
            <div className={style.addContentsGrid}>
                <Button popovertarget={popoverId} onClick={() => createdSlideItem(TextSlideItemBuilder.createEmpty())}><Icon icon="paragraph" />&nbsp; Text</Button>
                <Button popovertarget={popoverId} onClick={() => createdSlideItem(ImageSlideItemBuilder.createEmpty())}><Icon icon="image" />&nbsp; Image</Button>
                <Button popovertarget={popoverId} onClick={() => createdSlideItem(VideoSlideItemBuilder.createEmpty())}><Icon icon="play" />&nbsp; Video</Button>
            </div>
        </div>
        <IconButton
            icon="plus"
            popovertarget={popoverId}
            style="lighter"
            hoverStyle="brand"
            className={style.addButton}
            title={translate('x:x:x', 'Insert item')}
        >
        </IconButton>
    </div>;
}
