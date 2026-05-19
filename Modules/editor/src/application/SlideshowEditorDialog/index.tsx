import * as React from 'react';
import {Button, Dialog, Icon} from '@neos-project/react-ui-components';
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
import {SlideThumbnail} from "../SlideThumbnail";
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
                title={translate('Carbon.SlideshowEditor:Main:editSlide', `Edit slide ${slideNumber}`, {number: slideNumber})}
                style="auto"
                autoFocus={true}
                actions={[
                    <Button onClick={backToOverview}>
                        {translate('Carbon.SlideshowEditor:Main:back', 'Back')}
                    </Button>,
                    <Button
                        id="carbon-SlideshowEditor-submit"
                        style="success"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!slideshowBuilder.isDirty}
                    >
                        {initialValue ? translate('Carbon.SlideshowEditor:Main:update', 'Update') : translate('Carbon.SlideshowEditor:Main:create', 'Create')}
                    </Button>
                ]}
            >
                <div className={style.dialogBody}>
                    <SlideEditor editor={editor} slideBuilder={slideBuilder} slideshowBuilder$={slideshowBuilder$} editorComponents={editorComponents} />
                </div>
                <div className={style.navigationCorner}>
                    <Button onClick={() => setOpenedSlideId(previousSlideId)} disabled={!previousSlideId}>
                        {translate('Carbon.SlideshowEditor:Main:previous', 'Previous')}
                    </Button>
                    <Button onClick={() => setOpenedSlideId(nextSlideId)} disabled={!nextSlideId}>
                        {translate('Carbon.SlideshowEditor:Main:next', 'Next')}
                    </Button>
                </div>
            </Dialog>
        );
    }

    const hasSlides = slideshowBuilder.slides.length > 0;

    return (
        <Dialog
            id="carbon-SlideshowEditor"
            isOpen={true}
            preventClosing={slideshowBuilder.isDirty}
            onRequestClose={dismiss}
            title={initialValue ? translate('Carbon.SlideshowEditor:Main:editSlideshow', 'Edit slideshow') : translate('Carbon.SlideshowEditor:Main:createSlideshow', 'Create slideshow')}
            style="auto"
            autoFocus={true}
            actions={[
                <Button onClick={dismiss}>
                    {translate('Carbon.SlideshowEditor:Main:cancel', 'Cancel')}
                </Button>,
                <Button
                    id="carbon-SlideshowEditor-submit"
                    style="success"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!slideshowBuilder.isDirty}
                >
                    {initialValue ? translate('Carbon.SlideshowEditor:Main:update', 'Update') : translate('Carbon.SlideshowEditor:Main:create', 'Create')}
                </Button>
            ]}
        >
            <div className={style.dialogBody}>
                {hasSlides ? (
                    <div className={mergeClassNames(style.slideGrid, {[style.slideGridDragging]: dragContext.isDragging})}>
                        {slideshowBuilder.slides.map((slideBuilder, index) => {
                            const slideNumber = index + 1;
                            return <DragAndDropSlideItem
                                key={slideBuilder.id}
                                targetSlideItemId={slideBuilder.id}
                                dragContext$={dragContext$}
                                moveSlideItem={(slideId: string) => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withMovedSlide(slideId, slideBuilder.id))}
                            >
                                <div
                                    className={style.slideCell}
                                    data-slide-card={slideBuilder.id}
                                >
                                    <SlideDropIndicator isDragging={dragContext.isDragging} isDragover={dragContext.dragoverId === slideBuilder.id} />
                                    <InlineToolbar
                                        label={translate('Carbon.SlideshowEditor:Main:slide', `Slide ${slideNumber}`, {number: slideNumber})}
                                        icon={'sticky-note'}
                                        primaryToolBar={[<DragItem key="drag" dragContext$={dragContext$} startDragging={startDraggingSlideItemFactoryFn(slideBuilder.id)} />]}
                                        secondaryToolbar={[<DeleteItem
                                            key="delete"
                                            label={translate('Carbon.SlideshowEditor:Main:deleteSlide', `Delete slide ${slideNumber}`, {number: slideNumber})}
                                            onDelete={() => {
                                                if (window.confirm(`Delete slide ${slideNumber}? Its contents will be removed; undo by cancelling the slideshow editor.`)) {
                                                    slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withRemovedSlide(slideBuilder.id));
                                                }
                                            }}
                                        />]}
                                    >
                                        <SlideThumbnail
                                            slideBuilder={slideBuilder}
                                            index={index}
                                            onSelect={() => setOpenedSlideId(slideBuilder.id)}
                                        />
                                    </InlineToolbar>
                                </div>
                            </DragAndDropSlideItem>
                        })}
                        <DragAndDropSlideItem
                            targetSlideItemId={null}
                            dragContext$={dragContext$}
                            moveSlideItem={(slideId: string) => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withMovedSlide(slideId, null))}
                        >
                            <SlideDropIndicator isDragging={dragContext.isDragging} isDragover={dragContext.isDragoverLast} isTrailing />
                        </DragAndDropSlideItem>
                    </div>
                ) : (
                    <button
                        type="button"
                        className={style.emptyCta}
                        onClick={() => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withCreatedSlide())}
                    >
                        <Icon icon="plus" className={style.emptyCtaIcon} />
                        <span className={style.emptyCtaPrimary}>{translate('Carbon.SlideshowEditor:Main:addFirstSlide', 'Add first slide')}</span>
                        <span className={style.emptyCtaSecondary}>{translate('Carbon.SlideshowEditor:Main:emptySlideshow', 'No slides yet')}</span>
                    </button>
                )}

                {hasSlides ? (
                    <Button
                        className={style.addSlideButton}
                        onClick={() => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withCreatedSlide())}
                    >
                        <Icon icon="plus" />&nbsp;
                        {translate('Carbon.SlideshowEditor:Main:addSlide', 'Add slide')}
                    </Button>
                ) : null}
            </div>
        </Dialog>
    )
}

const SlideDropIndicator: React.FC<{isDragging: boolean; isDragover: boolean; isTrailing?: boolean}> = (props) => (
    <div
        className={mergeClassNames(
            style.dropIndicator,
            {
                [style.dropIndicatorDragging]: props.isDragging,
                [style.dropIndicatorDragover]: props.isDragover,
                [style.dropIndicatorTrailing]: props.isTrailing
            }
        )}
    />
);
