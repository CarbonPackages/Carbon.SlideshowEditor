
import {createDialog, createNestedDialog, createEditor, createInspectorEditor} from '@carbon/slideshoweditor-core';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('@carbon/slideshoweditor-plugin', {}, (globalRegistry) => {
	const editor = createEditor();

	const containersRegistry = globalRegistry.get('containers');
	const inspectorRegistry = globalRegistry.get('inspector');
	const editorRegistry = inspectorRegistry.get('editors');

	containersRegistry.set(
		'Modals/CarbonSlideshowEditor',
		createDialog({editor, editorRegistry})
	);

	containersRegistry.set(
		'Modals/CarbonSlideshowEditorNestedEditor',
		createNestedDialog(editor),
	);

	editorRegistry.set('Carbon.SlideshowEditor/Inspector/Editors/SlideshowEditor', {
		component: createInspectorEditor({editor})
	});
});
