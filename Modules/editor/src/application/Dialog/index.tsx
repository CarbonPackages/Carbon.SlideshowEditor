import * as React from 'react';
import {Button, Dialog} from '@neos-project/react-ui-components';
import {IEditor, ISlideshow, SlideshowBuilder, ImageSlideItemBuilder} from '@carbon/slideshoweditor-core';
import {useLatestState} from '@neos-project/framework-observable-react';
import {useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from '@neos-project/neos-ui-i18n';
import {createState} from '@neos-project/framework-observable';

export const createDialog = (deps: {editor: IEditor, editorRegistry: any}) => () => {
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

    const isAuthenticated = useSelector(state => !state.system?.authenticationTimeout);

    if (!isAuthenticated) {
        return null;
    }

    const ImageEditor = editorRegistry.get('Neos.Neos/Inspector/Editors/ImageEditor').component;

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
            {slideshowBuilder.slides.map((slideBuilder) => {
                return <div key={slideBuilder.id}>
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
                                    commit={(flowImageObject) => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withUpdatedSlide(slideBuilder.withUpdatedItem(slideItemBuilder.withFlowImageObject(flowImageObject))))}
                                    renderSecondaryInspector={editor.transactions.renderNestedEditor}
                                />
                            ) : ''}
                        </div>;
                    })}

                    <Button onClick={() => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withUpdatedSlide(slideBuilder.withNewItem(ImageSlideItemBuilder.createEmpty())))}>Add image</Button>
                </div>
            })}

            <Button onClick={() => slideshowBuilder$.update(slideshowBuilder => slideshowBuilder.withNewSlide())}>Add Slide</Button>
        </Dialog>
    )
}
