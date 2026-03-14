
import {createEditor} from '@carbon/slideshoweditor-core';
import {createSlideshowEditorDialog, createNestedEditorDialog, createInspectorEditor} from '@carbon/slideshoweditor-editor';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('@carbon/slideshoweditor-plugin', {}, (globalRegistry) => {
	const editor = createEditor();

	const containersRegistry = globalRegistry.get('containers');
	const inspectorRegistry = globalRegistry.get('inspector');
	const editorRegistry = inspectorRegistry.get('editors');
	const secondaryEditorRegistry = inspectorRegistry.get('secondaryEditors');

	const ImageEditor = editorRegistry.get('Neos.Neos/Inspector/Editors/ImageEditor').component;
	const VideoEditor = editorRegistry.get('Carbon.VideoPlatformEditor/Inspector/Editors/VideoPlatformEditor').component;
	const CKEditorRichTextEditor = secondaryEditorRegistry.get('Neos.Neos/Inspector/Secondary/Editors/CKEditorWrap').component;

	containersRegistry.set(
		'Modals/CarbonSlideshowEditor',
		createSlideshowEditorDialog({
			editor,
			editorComponents: {
				ImageEditor,
				VideoEditor,
				CKEditorRichTextEditor,
			}
		})
	);

	containersRegistry.set(
		'Modals/CarbonSlideshowEditorNestedEditor',
		createNestedEditorDialog(editor),
	);

	editorRegistry.set('Carbon.SlideshowEditor/Inspector/Editors/SlideshowEditor', {
		component: createInspectorEditor({editor})
	});
});
