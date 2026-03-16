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
import style from './style.module.css';
import {InlineToolbar} from "../InlineToolbar";
import {DragItem} from "../InlineToolbar/DragItem.tsx";
import {DeleteItem} from "../InlineToolbar/DeleteItem.tsx";
import {DragAndDropSlideItem, startDraggingSlideItemFactoryFn} from "../DragAndDropSlideItem";
import {useLatestState} from '@neos-project/framework-observable-react';
import {createState} from '@neos-project/framework-observable';
import {DragContext} from "../DragAndDropSlideItem/DragContext.ts";

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

    const removeSlideItemFactoryFn = React.useCallback((slideItemId: string | null) => () => {
        slideshowBuilder$.update(
            (slideshowBuilder) => slideshowBuilder.withUpdatedSlide(
                slideshowBuilder.getById(slideBuilder.id).withRemovedItem(
                    slideItemId
                )
            )
        )
    }, [slideshowBuilder$, slideBuilder.id]);

    const moveSlideItemFactoryFn = React.useCallback((succeedingSiblingItemId: string | null) => (slideItemId: string) => {
        slideshowBuilder$.update(
            (slideshowBuilder) => slideshowBuilder.withUpdatedSlide(
                slideshowBuilder.getById(slideBuilder.id).withMovedItem(
                    slideItemId,
                    succeedingSiblingItemId
                )
            )
        )
    }, [slideshowBuilder$, slideBuilder.id]);

    const dragContext$ = React.useMemo(() => createState(DragContext.none()), []);
    const dragContext: DragContext = useLatestState(dragContext$);

    return <div>
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
                <DragAndDropSlideItem targetSlideItemId={slideItemBuilder.id} dragContext$={dragContext$} moveSlideItem={moveSlideItemFactoryFn(slideItemBuilder.id)}>
                    <AddSlideItem isDragging={dragContext.isDragging} isDragover={dragContext.dragoverId === slideItemBuilder.id} createdSlideItem={createSlideItemFactoryFn(slideItemBuilder.id)} />
                </DragAndDropSlideItem>

                <div className={style.slideItem}>
                    <InlineToolbar
                        label={slideItemBuilder.label}
                        icon={slideItemBuilder.icon}
                        primaryToolBar={[<DragItem key="drag" dragContext$={dragContext$} startDragging={startDraggingSlideItemFactoryFn(slideItemBuilder.id)} />]}
                        secondaryToolbar={[<DeleteItem key="delete" onDelete={removeSlideItemFactoryFn(slideItemBuilder.id)} />]}
                    />

                    {slideItemBuilder instanceof TextSlideItemBuilder ? (
                        <CKEditorRichTextEditor
                            options={{
                                formatting: {
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
                </div>
            </div>;
        })}

        <DragAndDropSlideItem targetSlideItemId={null} dragContext$={dragContext$} moveSlideItem={moveSlideItemFactoryFn(null)}>
            <AddSlideItem isDragging={dragContext.isDragging} isDragover={dragContext.isDragoverLast} createdSlideItem={createSlideItemFactoryFn(null)} />
        </DragAndDropSlideItem>
    </div>;
}
