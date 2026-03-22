import * as React from 'react';
import {Button, Dialog} from '@neos-project/react-ui-components';
import {IEditor, ISlideshow, SlideshowBuilder} from '@carbon/slideshoweditor-core';
import {useLatestState} from '@neos-project/framework-observable-react';
import {useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from '@neos-project/neos-ui-i18n';
import {createState} from '@neos-project/framework-observable';
import {EditorComponents, SlideEditor} from "../SlideEditor";
import style from './style.module.css';
import {DragAndDropSlideItem, startDraggingSlideItemFactoryFn} from "../DragAndDropSlideItem";
import {DragItem} from "../InlineToolbar/DragItem.tsx";
import {DeleteItem} from "../InlineToolbar/DeleteItem.tsx";
import {InlineToolbar} from "../InlineToolbar";
import {DragContext} from "../DragAndDropSlideItem/DragContext.ts";
import mergeClassNames from 'classnames';

export const createSlideshowEditorDialog = (deps: {editor: IEditor, editorComponents: EditorComponents}) => () => {
    const {isOpen, initialValue} = useLatestState(deps.editor.state$);

    if (isOpen) {
        return <SlideshowEditorDialog editor={deps.editor} editorComponents={deps.editorComponents} initialValue={initialValue}/>;
    }

    return null;
};

const SlideshowEditorDialog: React.FC<{
    editor: IEditor
    initialValue: ISlideshow | null
    editorComponents: EditorComponents
}> = ({editor, initialValue, editorComponents}) => {
    const {dismiss, unset, apply} = editor.transactions;

    const slideshowBuilder$ = React.useMemo(() => createState(SlideshowBuilder.createFromValue(initialValue)), [initialValue]);

    const handleSubmit = React.useCallback(() => {
        const slideshow = slideshowBuilder$.current.build();
        if (slideshow.length) {
            apply(slideshow)
        } else {
            unset()
        }
    }, [slideshowBuilder$]);

    const slideshowBuilder: SlideshowBuilder = useLatestState(slideshowBuilder$);

    const [openedSlideId, setOpenedSlideId] = React.useState(null);
    const backToOverview = React.useCallback(() => setOpenedSlideId(null), [setOpenedSlideId]);

    const nextSlideId = React.useMemo(() => openedSlideId ? slideshowBuilder.nextSlideId(openedSlideId) : null, [slideshowBuilder, openedSlideId]);
    const previousSlideId = React.useMemo(() => openedSlideId ? slideshowBuilder.previousSlideId(openedSlideId) : null, [slideshowBuilder, openedSlideId]);

    const isAuthenticated = useSelector(state => !state.system?.authenticationTimeout);

    const dragContext$ = React.useMemo(() => createState(DragContext.none()), []);
    const dragContext: DragContext = useLatestState(dragContext$);

    if (!isAuthenticated) {
        return null;
    }

    if (openedSlideId) {
        const slideBuilder = slideshowBuilder.getById(openedSlideId);
        const slideNumber = slideshowBuilder.getNumber(openedSlideId);

        return (
            <Dialog
                id="carbon-SlideshowEditor-Slide"
                isOpen={true}
                preventClosing={slideBuilder.isDirty}
                onRequestClose={backToOverview}
                title={translate('Todo:todo:todo', 'Edit slide {number}', {number: slideNumber})}
                style="auto"
                autoFocus={true}
                actions={[
                    <Button onClick={backToOverview}>
                        {translate('Todo:todo:todo', 'Back')}
                    </Button>,
                    <Button
                        id="carbon-SlideshowEditor-submit"
                        style="success"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!slideshowBuilder.isDirty}
                    >
                        {initialValue ? translate('Todo:todo:todo', 'Update') : translate('Todo:todo:todo', 'Create')}
                    </Button>
                ]}
            >
                <div className={style.dialogBody}>
                    <SlideEditor editor={editor} slideBuilder={slideBuilder} slideshowBuilder$={slideshowBuilder$} editorComponents={editorComponents} />
                </div>
                <div className={style.navigationCorner}>
                    <Button onClick={() => setOpenedSlideId(previousSlideId)} disabled={!previousSlideId}>
                        {translate('Todo:todo:todo', 'Previous')}
                    </Button>
                    <Button onClick={() => setOpenedSlideId(nextSlideId)} disabled={!nextSlideId}>
                        {translate('Todo:todo:todo', 'Next')}
                    </Button>
                </div>
            </Dialog>
        );
    }

    return (
        <Dialog
            id="carbon-SlideshowEditor"
            isOpen={true}
            preventClosing={slideshowBuilder.isDirty}
            onRequestClose={dismiss}
            title={initialValue ? translate('Todo:todo:todo', 'Edit slideshow') : translate('Todo:todo:todo', 'Create slideshow')}
            style="auto"
            autoFocus={true}
            actions={[
                <Button onClick={dismiss}>
                    {translate('Todo:todo:todo', 'Cancel')}
                </Button>,
                <Button
                    id="carbon-SlideshowEditor-submit"
                    style="success"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!slideshowBuilder.isDirty}
                >
                    {initialValue ? translate('Todo:todo:todo', 'Update') : translate('Todo:todo:todo', 'Create')}
                </Button>
            ]}
        >
            <div className={style.dialogBody}>
                <div className={style.slideGrid}>
                    {slideshowBuilder.slides.map((slideBuilder, index) => {
                        return <div className={style.slideAndSeparator} key={slideBuilder.id}>
                            <DragAndDropSlideItem targetSlideItemId={slideBuilder.id} dragContext$={dragContext$} moveSlideItem={(slideId: string) => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withMovedSlide(slideId, slideBuilder.id))}>
                                <SlideSeparator isDragging={dragContext.isDragging} isDragover={dragContext.dragoverId === slideBuilder.id} />
                            </DragAndDropSlideItem>

                            <InlineToolbar
                                label={`Slide ${index + 1}`}
                                icon={'sticky-note'}
                                primaryToolBar={[<DragItem key="drag" dragContext$={dragContext$} startDragging={startDraggingSlideItemFactoryFn(slideBuilder.id)} />]}
                                secondaryToolbar={[<DeleteItem key="delete" onDelete={() => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withRemovedSlide(slideBuilder.id))} />]}
                            >
                                <Button className={style.slide} onClick={() => setOpenedSlideId(slideBuilder.id)}>Slide {slideBuilder.id.substring(0, 5)}</Button>
                            </InlineToolbar>
                        </div>
                    })}

                    <DragAndDropSlideItem targetSlideItemId={null} dragContext$={dragContext$} moveSlideItem={(slideId: string) => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withMovedSlide(slideId, null))}>
                        <SlideSeparator isDragging={dragContext.isDragging} isDragover={dragContext.isDragoverLast} />
                    </DragAndDropSlideItem>
                </div>

                <Button onClick={() => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withCreatedSlide())}>Add Slide</Button>
            </div>
        </Dialog>
    )
}

const SlideSeparator = (props: {isDragging: boolean, isDragover: boolean}) => {
    return <div className={mergeClassNames(style.slideSeparator, {[style.slideSeparatorDragging]: props.isDragging, [style.slideSeparatorDragover]: props.isDragover})}></div>
};
