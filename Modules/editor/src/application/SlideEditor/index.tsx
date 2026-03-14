import * as React from "react";
import {SlideBuilder} from "@carbon/slideshoweditor-core/src/domain/SlideshowBuilder/SlideBuilder.ts";
import {IEditor, ImageSlideItemBuilder, TextSlideItemBuilder, VideoSlideItemBuilder} from "@carbon/slideshoweditor-core";
import {Button} from '@neos-project/react-ui-components';

export type EditorComponents = {
    ImageEditor: React.ComponentType,
    VideoEditor: React.ComponentType,
    CKEditorRichTextEditor: React.ComponentType,
};

export const SlideEditor: React.FC<{
    editor: IEditor;
    slideBuilder: SlideBuilder;
    updateSlide: (slideBuilder: SlideBuilder) => void;
    editorComponents: EditorComponents;
}> = ({slideBuilder, editor, updateSlide, editorComponents: {ImageEditor, VideoEditor, CKEditorRichTextEditor}}) => {
    return <div>
        Slide {slideBuilder.id}

        {slideBuilder.items.map((slideItemBuilder) => {
            return <div key={slideItemBuilder.id}>
                {slideItemBuilder instanceof TextSlideItemBuilder ? (
                    <CKEditorRichTextEditor
                        options={{
                            formatting: {
                                img: true,
                                a: true,
                                strong: true,
                                b: true,
                            }
                        }}
                        value={slideItemBuilder.text}
                        onChange={(text) => updateSlide(slideBuilder.withUpdatedItem(slideItemBuilder.withText(text)))}
                        renderSecondaryInspector={editor.transactions.renderNestedEditor}
                    />
                ) : ''}

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

        <Button onClick={() => updateSlide(slideBuilder.withCreatedItem(TextSlideItemBuilder.createEmpty()))}>Add text</Button>
        <Button onClick={() => updateSlide(slideBuilder.withCreatedItem(ImageSlideItemBuilder.createEmpty()))}>Add image</Button>
        <Button onClick={() => updateSlide(slideBuilder.withCreatedItem(VideoSlideItemBuilder.createEmpty()))}>Add Video</Button>
    </div>;
}
