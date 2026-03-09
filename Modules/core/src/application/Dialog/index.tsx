import * as React from 'react';
import {Button, Dialog} from '@neos-project/react-ui-components';
import {IEditor, ISlideshow} from '../../domain';
import {useLatestState} from '@neos-project/framework-observable-react';
import {useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from '@neos-project/neos-ui-i18n';

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

    const handleSubmit = React.useCallback(() => {
        unset();
    }, []);

    const isAuthenticated = useSelector(state => !state.system?.authenticationTimeout);

    if (!isAuthenticated) {
        return null;
    }

    const ImageEditor = editorRegistry.get('Neos.Neos/Inspector/Editors/ImageEditor').component;
    const [imageValue, setImageValue] = React.useState();

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
            <ImageEditor
                options={{
                    features: {
                        crop: false
                    }
                }}
                value={imageValue}
                commit={setImageValue}
                renderSecondaryInspector={editor.transactions.renderNestedEditor}
            />
        </Dialog>
    )
}
