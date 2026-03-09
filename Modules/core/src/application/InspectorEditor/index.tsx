import React from 'react';
import {Button} from '@neos-project/react-ui-components';
import {IEditor, ISlideshow} from "../../domain";

export const createInspectorEditor = (deps: {editor: IEditor}) => {

    return function InspectorEditor(props: {value: ISlideshow | null, commit: (video: ISlideshow | '') => void}) {
        return <>
            <Button onClick={() => deps.editor.transactions.editSlideshow(props.value)}>Open</Button>
        </>
    }
}
