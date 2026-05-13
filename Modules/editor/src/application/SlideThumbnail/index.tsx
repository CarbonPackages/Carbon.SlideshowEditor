import * as React from 'react';
import {Icon} from '@neos-project/react-ui-components';
import {translate} from '@neos-project/neos-ui-i18n';
import {
    ImageSlideItemBuilder,
    SlideBuilder,
    TextSlideItemBuilder,
    VideoSlideItemBuilder
} from '@carbon/slideshoweditor-core';
import {useAssetPreview} from './useAssetPreview';
import style from './style.module.css';

/**
 * Thumbnail card for the slideshow overview grid. Picks the first
 * media item on the slide (image first, video second) and renders its
 * preview in a 16:9 frame that mirrors the public-frontend
 * `aspect-video` carousel. Falls through to the first text snippet, or
 * to a numbered placeholder when the slide is empty.
 *
 * Designed to be wrapped by the existing `InlineToolbar` and to act as
 * the clickable surface that opens the per-slide editor.
 */

type MediaPick =
    | {kind: 'image'; uuid: string | null; captionText: string | null}
    | {kind: 'video'; captionText: string | null}
    | {kind: 'text'; text: string}
    | {kind: 'empty'};

const pickMedia = (slideBuilder: SlideBuilder): MediaPick => {
    const items = slideBuilder.items;
    const firstImage = items.find(i => i instanceof ImageSlideItemBuilder) as ImageSlideItemBuilder | undefined;
    const firstVideo = items.find(i => i instanceof VideoSlideItemBuilder) as VideoSlideItemBuilder | undefined;
    const firstText = items.find(i => i instanceof TextSlideItemBuilder) as TextSlideItemBuilder | undefined;
    const captionText = firstText?.text ? excerptFromHtml(firstText.text) : null;

    if (firstImage) {
        return {kind: 'image', uuid: firstImage.flowImageObject?.__identity ?? null, captionText};
    }
    if (firstVideo) {
        return {kind: 'video', captionText};
    }
    if (firstText) {
        return {kind: 'text', text: excerptFromHtml(firstText.text) ?? ''};
    }
    return {kind: 'empty'};
};

const excerptFromHtml = (html: string): string => {
    if (!html) return '';
    const stripped = html
        .replace(/<\/(p|div|li|h[1-6]|br\s*\/?)>/gi, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const max = 60;
    if (stripped.length <= max) return stripped;
    return stripped.substring(0, max).trimEnd() + '…';
};

const Frame: React.FC<{children: React.ReactNode; onClick: () => void; tone?: 'image' | 'video' | 'text' | 'empty'}> = ({children, onClick, tone = 'empty'}) => (
    <button type="button" className={style.frame} data-tone={tone} onClick={onClick}>
        {children}
    </button>
);

const ImageFrame: React.FC<{uuid: string | null; onClick: () => void}> = ({uuid, onClick}) => {
    const preview = useAssetPreview(uuid ?? null);
    if (preview.state === 'ready') {
        return (
            <Frame onClick={onClick} tone="image">
                <img className={style.previewImg} src={preview.previewUri} alt={preview.label} />
            </Frame>
        );
    }
    if (preview.state === 'loading') {
        return (
            <Frame onClick={onClick} tone="image">
                <Icon icon="image" className={style.iconMuted} />
            </Frame>
        );
    }
    return (
        <Frame onClick={onClick} tone="image">
            <span className={style.fallbackLabel}>
                <Icon icon="image" className={style.iconMuted} />{' '}
                {translate('Carbon.SlideshowEditor:Main:thumbnailMissing', 'No preview')}
            </span>
        </Frame>
    );
};

export const SlideThumbnail: React.FC<{
    slideBuilder: SlideBuilder;
    index: number;
    onSelect: () => void;
}> = ({slideBuilder, index, onSelect}) => {
    const pick = pickMedia(slideBuilder);
    const slideNumber = index + 1;
    const slideLabel = translate('Carbon.SlideshowEditor:Main:slide', `Slide ${slideNumber}`, {number: slideNumber});

    let body: React.ReactNode;
    let typeChip: React.ReactNode;
    let captionLine: string | null = null;

    if (pick.kind === 'image') {
        body = <ImageFrame uuid={pick.uuid} onClick={onSelect} />;
        typeChip = (
            <span className={style.typeChip} data-tone="image">
                <Icon icon="image" />{' '}
                {translate('Carbon.SlideshowEditor:Main:itemImage', 'Image')}
            </span>
        );
        captionLine = pick.captionText;
    } else if (pick.kind === 'video') {
        body = (
            <Frame onClick={onSelect} tone="video">
                <Icon icon="video" className={style.iconLarge} />
            </Frame>
        );
        typeChip = (
            <span className={style.typeChip} data-tone="video">
                <Icon icon="video" />{' '}
                {translate('Carbon.SlideshowEditor:Main:itemVideo', 'Video')}
            </span>
        );
        captionLine = pick.captionText;
    } else if (pick.kind === 'text') {
        body = (
            <Frame onClick={onSelect} tone="text">
                <span className={style.textPreview}>{pick.text}</span>
            </Frame>
        );
        typeChip = (
            <span className={style.typeChip} data-tone="text">
                <Icon icon="paragraph" />{' '}
                {translate('Carbon.SlideshowEditor:Main:itemText', 'Text')}
            </span>
        );
    } else {
        body = (
            <Frame onClick={onSelect} tone="empty">
                <Icon icon="sticky-note" className={style.iconLarge} />
            </Frame>
        );
        typeChip = null;
    }

    return (
        <div className={style.card}>
            {body}
            <div className={style.meta}>
                <span className={style.slideNumber}>{slideLabel}</span>
                {typeChip}
                {captionLine ? <span className={style.captionPreview} title={captionLine}>{captionLine}</span> : null}
            </div>
        </div>
    );
};
