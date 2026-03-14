import * as React from 'react';
import {Button, Dialog} from '@neos-project/react-ui-components';
import {IEditor, ISlideshow, SlideshowBuilder} from '@carbon/slideshoweditor-core';
import {useLatestState} from '@neos-project/framework-observable-react';
import {useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from '@neos-project/neos-ui-i18n';
import {createState} from '@neos-project/framework-observable';
import {SlideEditor} from "../SlideEditor";
import {SlideBuilder} from "@carbon/slideshoweditor-core/src/domain/SlideshowBuilder/SlideBuilder.ts";

export const createSlideshowEditorDialog = (deps: {editor: IEditor, editorRegistry: any}) => () => {
    const {isOpen, initialValue} = useLatestState(deps.editor.state$);

    if (isOpen) {
        return <SlideshowEditorDialog editor={deps.editor} editorRegistry={deps.editorRegistry} initialValue={initialValue}/>;
    }

    return null;
};

const SlideshowEditorDialog: React.FC<{
    editor: IEditor
    initialValue: ISlideshow | null
    editorRegistry: any
}> = ({editor, initialValue, editorRegistry}) => {
    const {dismiss, unset, apply} = editor.transactions;

    const slideshowBuilder$ = React.useMemo(() => createState(SlideshowBuilder.createFromValue(initialValue)), [initialValue]);

    const slideshowBuilder: SlideshowBuilder = useLatestState(slideshowBuilder$);

    const handleSubmit = React.useCallback(() => {
        const slideshow = slideshowBuilder$.current.build();
        if (slideshow.length) {
            apply(slideshow)
        } else {
            unset()
        }
    }, []);

    const [openedSlideId, setOpenedSlideId] = React.useState(null);
    const back = React.useCallback(() => setOpenedSlideId(null), [setOpenedSlideId]);

    const nextSlideId = React.useMemo(() => {
        if (openedSlideId) {
            return slideshowBuilder.nextSlideId(openedSlideId);
        }
        return null;
    }, [slideshowBuilder, openedSlideId]);

    const previousSlideId = React.useMemo(() => {
        if (openedSlideId) {
            return slideshowBuilder.previousSlideId(openedSlideId);
        }
        return null;
    }, [slideshowBuilder, openedSlideId]);

    const updateSlide = React.useCallback((slideBuilder: SlideBuilder) => {
        slideshowBuilder$.update((slideshowBuilder: SlideshowBuilder) => slideshowBuilder.withUpdatedSlide(slideBuilder));
    }, [slideshowBuilder$]);

    const isAuthenticated = useSelector(state => !state.system?.authenticationTimeout);

    if (!isAuthenticated) {
        return null;
    }

    if (openedSlideId) {
        const slideBuilder = slideshowBuilder.getById(openedSlideId);

        return (
            <Dialog
                id="carbon-SlideshowEditor-Slide"
                isOpen={true}
                preventClosing={false}
                onRequestClose={dismiss}
                title={translate('Todo:todo:todo', 'Edit slide')}
                style="auto"
                autoFocus={true}
                actions={[
                    <Button onClick={() => setOpenedSlideId(previousSlideId)} disabled={!previousSlideId}>
                        {translate('Todo:todo:todo', 'Previous')}
                    </Button>,
                    <Button onClick={() => setOpenedSlideId(nextSlideId)} disabled={!nextSlideId}>
                        {translate('Todo:todo:todo', 'Next')}
                    </Button>,
                    <Button onClick={back}>
                        {translate('Todo:todo:todo', 'Back')}
                    </Button>
                ]}
            >
                <SlideEditor editor={editor} slideBuilder={slideBuilder} updateSlide={updateSlide} editorRegistry={editorRegistry} />
            </Dialog>
        );
    }

    return (
        <Dialog
            id="carbon-SlideshowEditor"
            isOpen={true}
            preventClosing={false}
            onRequestClose={dismiss}
            title={translate('Todo:todo:todo', 'Edit slideshow')}
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
                >
                    {translate('Todo:todo:todo', 'Create')}
                </Button>
            ]}
        >
            {slideshowBuilder.slides.map((slideBuilder, index) => {
                return <div key={slideBuilder.id}>
                    <Button onClick={() => setOpenedSlideId(slideBuilder.id)}>Open Slide {index + 1}</Button>
                </div>
            })}

            <Button onClick={() => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withCreatedSlide())}>Add Slide</Button>
        </Dialog>
    )
}
