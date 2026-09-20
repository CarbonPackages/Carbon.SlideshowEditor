import React from 'react';
import {Button} from '@neos-project/react-ui-components';
import type {IEditor, ISlideshow} from '@carbon/slideshoweditor-core';
import {translate} from '@neos-project/neos-ui-i18n';

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
            <Button onClick={onClick}>
                {props.value?.length
                    ? translate('Carbon.SlideshowEditor:Main:editSlideshowWithSlides', ['Edit slideshow ({0}) slide', 'Edit slideshow ({0}) slides'], [props.value.length], props.value.length)
                    : translate('Carbon.SlideshowEditor:Main:createSlideshow', 'Create slideshow')}
            </Button>
        </>
    }
}
