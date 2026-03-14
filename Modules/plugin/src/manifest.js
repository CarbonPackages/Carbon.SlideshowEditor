
import {createEditor} from '@carbon/slideshoweditor-core';
import {createSlideshowEditorDialog, createNestedEditorDialog, createInspectorEditor} from '@carbon/slideshoweditor-editor';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('@carbon/slideshoweditor-plugin', {}, (globalRegistry) => {
	const editor = createEditor();

	const containersRegistry = globalRegistry.get('containers');
	const inspectorRegistry = globalRegistry.get('inspector');
	const editorRegistry = inspectorRegistry.get('editors');

	containersRegistry.set(
		'Modals/CarbonSlideshowEditor',
		createSlideshowEditorDialog({editor, editorRegistry})
	);

	containersRegistry.set(
		'Modals/CarbonSlideshowEditorNestedEditor',
		createNestedEditorDialog(editor),
	);

	editorRegistry.set('Carbon.SlideshowEditor/Inspector/Editors/SlideshowEditor', {
		component: createInspectorEditor({editor})
	});
});
