import * as React from 'react';

import {Button, Dialog} from '@neos-project/react-ui-components';

import type {IEditor} from '@carbon/slideshoweditor-core';
import {useLatestState} from '@neos-project/framework-observable-react';
import {translate} from '@neos-project/neos-ui-i18n';
import style from './style.module.css';

export const createNestedEditorDialog = (editor: IEditor) => function NestedEditorDialog() {
    const {nestedEditor} = useLatestState(editor.state$);

    if (nestedEditor) {
        return <Dialog
            id="carbon-NestedEditor"
            isOpen={true}
            preventClosing={true}
            title={translate('Carbon.SlideshowEditor:Main:selectImage', 'Select image')}
            style="auto"
            autoFocus={true}
            actions={[
                <Button onClick={() => editor.transactions.closeNestedEditor()}>
                    {translate('Carbon.SlideshowEditor:Main:close', 'Close')}
                </Button>,
            ]}
        >
            <div className={style.container}>
                {React.createElement(nestedEditor.component)}
            </div>
        </Dialog>
    }

    return null;
};
