import * as React from 'react';

/**
 * Resolves a Neos Media asset UUID to its preview URL by calling the
 * Neos service route at `/neos/service/assets/{uuid}.json`. Result is
 * cached in a module-level Map keyed by uuid, so opening the same
 * slideshow twice — or showing the same image across siblings —
 * doesn't double-fetch.
 *
 * The endpoint exposes `previewUri` (via the `Neos.Media.Browser:Thumbnail`
 * preset) plus title + asset type — enough to render a 16:9 card with
 * the image and a label.
 */

type AssetPreviewState =
    | {state: 'idle'}
    | {state: 'loading'}
    | {state: 'ready'; previewUri: string; label: string}
    | {state: 'error'};

type CacheEntry = AssetPreviewState & {subscribers: Set<() => void>};

const cache = new Map<string, CacheEntry>();

const notify = (entry: CacheEntry) => {
    entry.subscribers.forEach(cb => cb());
};

const fetchAsset = async (uuid: string): Promise<void> => {
    const entry = cache.get(uuid)!;
    try {
        const res = await fetch(`/neos/service/assets/${encodeURIComponent(uuid)}.json`, {
            credentials: 'include',
            headers: {Accept: 'application/json'}
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        // The Neos service response wraps the asset under a top-level key. Walk
        // defensively — different Neos versions / handlers shape it slightly
        // differently (sometimes `{ "asset": { previewUri, label } }`,
        // sometimes flat `{ previewUri, label }`).
        const node = (data?.asset ?? data) as Record<string, unknown> | null;
        const previewUri = typeof node?.previewUri === 'string'
            ? node.previewUri as string
            : (typeof node?.previewImageResourceUri === 'string' ? node.previewImageResourceUri as string : null);
        const label = typeof node?.label === 'string'
            ? node.label as string
            : (typeof node?.title === 'string' ? node.title as string : '');
        if (!previewUri) {
            throw new Error('No previewUri in response');
        }
        Object.assign(entry, {state: 'ready', previewUri, label});
    } catch {
        Object.assign(entry, {state: 'error'});
    }
    notify(entry);
};

const ensureFetch = (uuid: string): CacheEntry => {
    let entry = cache.get(uuid);
    if (!entry) {
        entry = {state: 'loading', subscribers: new Set()};
        cache.set(uuid, entry);
        // fire-and-forget; subscribers notified on resolution
        void fetchAsset(uuid);
    }
    return entry;
};

export const useAssetPreview = (uuid: string | null | undefined): AssetPreviewState => {
    const [tick, setTick] = React.useState(0);

    React.useEffect(() => {
        if (!uuid) {
            return;
        }
        const entry = ensureFetch(uuid);
        const cb = () => setTick(t => t + 1);
        entry.subscribers.add(cb);
        return () => {
            entry.subscribers.delete(cb);
        };
    }, [uuid]);

    if (!uuid) {
        return {state: 'idle'};
    }
    const entry = cache.get(uuid);
    if (!entry) {
        return {state: 'loading'};
    }
    // Use `tick` to satisfy the linter that the value is consumed for re-renders.
    void tick;
    const {subscribers: _ignored, ...rest} = entry;
    return rest as AssetPreviewState;
};
