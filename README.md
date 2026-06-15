# Carbon.SlideshowEditor

`Carbon.SlideshowEditor` is a Neos package that provides a slideshow value object and a custom Neos UI inspector editor for creating and editing slideshows.

The editor supports mixed slide content:

- Text items
- Image items
- Video items (via `carbon/videoplatformeditor`)

## Features

- Custom inspector editor for `Carbon\\SlideshowEditor\\Slideshow`
- Modal-based slideshow editing UI in Neos
- Reorder/move/add/remove slides and slide items
- Value-object based PHP domain model with JSON serialization
- Content Repository normalizer for consistent serialization behavior
- Asset usage extraction support for slideshow media
- Eel helper for convenient Fusion rendering

## Requirements

- Neos UI `~9.1.4`
- PHP package dependency: `carbon/videoplatformeditor` `^1.0`

## Installation

Install the package in your Neos distribution and run dependency installation:

```bash
composer require carbon/slideshoweditor
```

## JavaScript Build

This repository uses Yarn workspaces with three modules:

- `@carbon/slideshoweditor-core`
- `@carbon/slideshoweditor-editor`
- `@carbon/slideshoweditor-plugin`

Build the Neos UI plugin bundle:

```bash
yarn build
```

Watch mode during development:

```bash
yarn workspace @carbon/slideshoweditor-plugin run watch
```

The bundle output is written to:

- `Resources/Public/JavaScript/Plugin.js`
- `Resources/Public/JavaScript/Plugin.css`

## Quality Checks

TypeScript check:

```bash
yarn lint
```

Core module tests:

```bash
yarn test
```

## Neos Integration

The package registers:

- Neos UI JavaScript and stylesheet resources
- Inspector datatype mapping:
  - `Carbon\\SlideshowEditor\\Slideshow` -> `Carbon.SlideshowEditor/Inspector/Editors/SlideshowEditor`
- Content Repository property converter (`SlideshowNormalizer`)
- Eel helper namespace:
  - `Carbon.SlideShowEditor`

## Data Model

The slideshow is represented as nested immutable value objects:

- `Slideshow`
  - `Slide[]`
    - `SlideItemInterface[]`
      - `TextSlideItem`
      - `ImageSlideItem`
      - `VideoSlideItem`

Serialized slide item shapes use a `type` discriminator:

- `text`: `{ "type": "text", "text": "..." }`
- `image`: `{ "type": "image", "imageId": "..." }`
- `video`: `{ "type": "video", "video": { ... } }`

## Usage in NodeTypes

Use `Carbon\\SlideshowEditor\\Slideshow` as property datatype in your NodeType definition and configure the inspector to use datatype-based editor resolution.

Example property definition:

```yaml
properties:
  slideshow:
    type: Carbon\\SlideshowEditor\\Slideshow
    ui:
      label: Slideshow
      inspector:
        group: content
```

## Fusion / Eel Rendering Helpers

The package exposes helper methods in Fusion via `Carbon.SlideShowEditor`, including:

- `hasSlides(slideshow)`
- `imageById(imageId)`
- `itemType(item)`

These helpers simplify rendering slideshow items in Fusion/AFX.

## Repository Structure

- `Classes/`: PHP value objects, Eel helper, and infrastructure integration
- `Configuration/`: Neos, UI, and Content Repository settings
- `Modules/core`: editor domain logic and tests
- `Modules/editor`: React-based UI components for dialogs and item editing
- `Modules/plugin`: Neos UI extensibility manifest + bundling
- `Resources/`: translations and generated frontend assets
- `Tests/`: PHP unit/functional tests

## Development Notes

- The plugin bundle uses `esbuild` and Neos UI extensibility aliases.
- The project keeps TypeScript domain logic in `Modules/core` and UI composition in `Modules/editor`.
- Generated UI assets in `Resources/Public/JavaScript` should be rebuilt after frontend changes.

## License

GPL-3.0-or-later
