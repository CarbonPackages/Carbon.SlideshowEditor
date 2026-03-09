import * as React from 'react';

import {Button, Dialog} from '@neos-project/react-ui-components';

import {IEditor} from '../../domain';
import {useLatestState} from '@neos-project/framework-observable-react';
import {translate} from '@neos-project/neos-ui-i18n';
import style from './style.module.css';

export const createNestedDialog = (editor: IEditor) => () => {
    const {nestedEditor} = useLatestState(editor.state$);

    if (nestedEditor) {
        return <Dialog
            id="carbon-NestedEditor"
            isOpen={true}
            preventClosing={true}
            title={translate('Todo:todo:todo', 'Select Image')}
            style="auto"
            autoFocus={true}
            actions={[
                <Button onClick={() => editor.transactions.closeNestedEditor()}>
                    {translate('Todo:todo:todo', 'Schließen')}
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
