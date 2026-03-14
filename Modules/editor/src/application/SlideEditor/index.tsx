import * as React from "react";
import {SlideBuilder, SlideItemBuilder} from "@carbon/slideshoweditor-core/src/domain/SlideshowBuilder/SlideBuilder.ts";
import {
    IEditor,
    ImageSlideItemBuilder,
    SlideshowBuilder,
    TextSlideItemBuilder,
    VideoSlideItemBuilder
} from "@carbon/slideshoweditor-core";
import {AddSlideItem} from "../AddSlideItem";

export type EditorComponents = {
    ImageEditor: React.ComponentType,
    VideoEditor: React.ComponentType,
    CKEditorRichTextEditor: React.ComponentType,
};

export const SlideEditor: React.FC<{
    editor: IEditor;
    slideBuilder: SlideBuilder;
    slideshowBuilder$: {
        update(slideshowBuilder: SlideshowBuilder): SlideshowBuilder
    },
    updateSlide: (slideBuilder: SlideBuilder) => void;
    editorComponents: EditorComponents;
}> = ({slideBuilder, editor, slideshowBuilder$, editorComponents: {ImageEditor, VideoEditor, CKEditorRichTextEditor}}) => {

    const createSlideItemFactoryFn = React.useCallback((succeedingSiblingItemId: string | null) => (slideItemBuilder: SlideItemBuilder) => {
        slideshowBuilder$.update(
            (slideshowBuilder) => slideshowBuilder.withUpdatedSlide(
                slideshowBuilder.getById(slideBuilder.id).withCreatedItem(
                    slideItemBuilder,
                    succeedingSiblingItemId
                )
            )
        )
    }, [slideshowBuilder$, slideBuilder.id]);

    return <div>
        Slide {slideBuilder.id}

        {slideBuilder.items.map((slideItemBuilder) => {
            // ToDo use React.useCallback
            const updatedItem = (updateFn: (slideItemBuilder: SlideItemBuilder) => SlideItemBuilder) => {
                slideshowBuilder$.update(
                    (slideshowBuilder) => slideshowBuilder.withUpdatedSlide(
                        slideshowBuilder.getById(slideBuilder.id).withUpdatedItem(
                            updateFn(
                                slideshowBuilder.getById(slideBuilder.id).getById(slideItemBuilder.id)
                            )
                        )
                    )
                )
            };

            return <div key={slideItemBuilder.id}>
                {/*<AddSlideItem createdSlideItem={createSlideItemFactoryFn(slideItemBuilder.id)} />*/}

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
                        onChange={(text) => updatedItem(slideItemBuilder => slideItemBuilder.withText(text))}
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
                        commit={(flowImageObject) => updatedItem(slideItemBuilder => slideItemBuilder.withFlowImageObject(flowImageObject))}
                        renderSecondaryInspector={editor.transactions.renderNestedEditor}
                    />
                ) : ''}

                {slideItemBuilder instanceof VideoSlideItemBuilder ? (
                    <VideoEditor
                        value={slideItemBuilder.video}
                        commit={(video) => updatedItem(slideItemBuilder => slideItemBuilder.withVideo(video))}
                        renderSecondaryInspector={editor.transactions.renderNestedEditor}
                    />
                ) : ''}
            </div>;
        })}

        <AddSlideItem createdSlideItem={createSlideItemFactoryFn(null)} />
    </div>;
}
