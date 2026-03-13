import React from 'react';
import {Button} from '@neos-project/react-ui-components';
import type {IEditor, ISlideshow} from '@carbon/slideshoweditor-core';

export const createInspectorEditor = (deps: {editor: IEditor}) => {

    return function InspectorEditor(props: {value: ISlideshow | null, commit: (video: ISlideshow | '') => void}) {
        const onClick = React.useCallback(async () => {
            const result = await deps.editor.transactions.editSlideshow(props.value);
            if (result.change) {
                if (result.value) {
                    props.commit(result.value);
                } else {
                    props.commit("");
                }
            }
        }, [props.value, props.commit]);

        return <>
            <Button onClick={onClick}>Open</Button>
        </>
    }
}
