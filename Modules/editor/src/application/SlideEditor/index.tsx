import * as React from "react";
import {SlideBuilder} from "@carbon/slideshoweditor-core/src/domain/SlideshowBuilder/SlideBuilder.ts";
import {IEditor, ImageSlideItemBuilder, VideoSlideItemBuilder} from "@carbon/slideshoweditor-core";
import {Button} from '@neos-project/react-ui-components';

export const SlideEditor: React.FC<{
    editor: IEditor;
    slideBuilder: SlideBuilder;
    updateSlide: (slideBuilder: SlideBuilder) => void;
    editorRegistry: any;
}> = ({slideBuilder, editor, updateSlide, editorRegistry}) => {
    const ImageEditor = editorRegistry.get('Neos.Neos/Inspector/Editors/ImageEditor').component;
    const VideoEditor = editorRegistry.get('Carbon.VideoPlatformEditor/Inspector/Editors/VideoPlatformEditor').component;

    return <div>
        Slide {slideBuilder.id}

        {slideBuilder.items.map((slideItemBuilder) => {
            return <div key={slideItemBuilder.id}>
                {slideItemBuilder instanceof ImageSlideItemBuilder ? (
                    <ImageEditor
                        options={{
                            features: {
                                crop: false
                            }
                        }}
                        value={slideItemBuilder.flowImageObject}
                        commit={(flowImageObject) => updateSlide(slideBuilder.withUpdatedItem(slideItemBuilder.withFlowImageObject(flowImageObject)))}
                        renderSecondaryInspector={editor.transactions.renderNestedEditor}
                    />
                ) : ''}

                {slideItemBuilder instanceof VideoSlideItemBuilder ? (
                    <VideoEditor
                        value={slideItemBuilder.video}
                        commit={(video) => updateSlide(slideBuilder.withUpdatedItem(slideItemBuilder.withVideo(video)))}
                        renderSecondaryInspector={editor.transactions.renderNestedEditor}
                    />
                ) : ''}
            </div>;
        })}

        <Button onClick={() => updateSlide(slideBuilder.withCreatedItem(ImageSlideItemBuilder.createEmpty()))}>Add image</Button>
        <Button onClick={() => updateSlide(slideBuilder.withCreatedItem(VideoSlideItemBuilder.createEmpty()))}>Add Video</Button>
    </div>;
}
