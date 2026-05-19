import * as React from 'react';
import backend from '@neos-project/neos-ui-backend-connector';

/**
 * Resolves a Neos Media image UUID to its thumbnail URL via the Neos UI
 * backend connector's `loadImageMetadata` endpoint — the same primitive
 * the built-in `Neos.Neos/Inspector/Editors/ImageEditor` uses to render
 * its own preview. Result is cached in a module-level Map keyed by uuid
 * so siblings sharing an image don't double-fetch.
 *
 * Using the connector instead of a hand-rolled fetch keeps us aligned
 * with Neos's route configuration, CSRF wrapping, and credentials
 * handling automatically.
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
        const data = await (backend as {get: () => {endpoints: {loadImageMetadata: (uuid: string) => Promise<unknown>}}})
            .get().endpoints.loadImageMetadata(uuid) as Record<string, unknown> | null;
        const previewUri = typeof data?.previewImageResourceUri === 'string'
            ? data.previewImageResourceUri as string
            : (typeof data?.originalImageResourceUri === 'string' ? data.originalImageResourceUri as string : null);
        const objectNode = data?.object as Record<string, unknown> | undefined;
        const label = typeof objectNode?.title === 'string' ? objectNode.title as string : '';
        if (!previewUri) {
            throw new Error('No previewImageResourceUri in response');
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
