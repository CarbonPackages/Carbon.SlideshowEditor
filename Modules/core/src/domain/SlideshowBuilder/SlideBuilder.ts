import type {ISlide} from "../Slideshow/Slideshow";
import {ImageSlideItemBuilder} from "./ImageSlideItemBuilder.ts";
import {VideoSlideItemBuilder} from "./VideoSlideItemBuilder.ts";
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";
import {TextSlideItemBuilder} from "./TextSlideItemBuilder.ts";

export type SlideItemBuilder = TextSlideItemBuilder | ImageSlideItemBuilder | VideoSlideItemBuilder;

export class SlideBuilder
{
    private itemBuilders: SlideItemBuilder[];

    private constructor(
        private readonly data: {
            readonly id: string;
            readonly orderedItemIds: string[],
            readonly itemBuilderMap: {
                [id: string]: SlideItemBuilder
            }
            readonly isDirty: boolean;
        }
    ) {
        const itemBuilders = [];
        for (const slideId of this.data.orderedItemIds) {
            const slideItemBuilder = this.data.itemBuilderMap[slideId];
            itemBuilders.push(
                slideItemBuilder
            );
        }
        this.itemBuilders = itemBuilders;
    }

    public static createFromValue(value: ISlide, deterministicIds: SlidePathToIdMapping | null): SlideBuilder
    {
        const orderedItemIds = [];
        const itemBuilderMap = {};

        let index = 0;
        for (const slideItem of value) {
            let slideItemBuilder = null;

            switch (slideItem.type) {
                case "text":
                    slideItemBuilder = TextSlideItemBuilder.createFromValue(slideItem, deterministicIds?.getForSlideItemIndex(index));
                    break;
                case "image":
                    slideItemBuilder = ImageSlideItemBuilder.createFromValue(slideItem, deterministicIds?.getForSlideItemIndex(index));
                    break;
                case "video":
                    slideItemBuilder = VideoSlideItemBuilder.createFromValue(slideItem, deterministicIds?.getForSlideItemIndex(index));
                    break;
                default:
                    throw new Error(`Unhandled slide item "${JSON.stringify(slideItem)}"`);
            }

            orderedItemIds.push(slideItemBuilder.id);
            itemBuilderMap[slideItemBuilder.id] = slideItemBuilder;
            ++index;
        }

        return new SlideBuilder({
            id: deterministicIds?.getForSlide() ?? crypto.randomUUID(),
            orderedItemIds,
            itemBuilderMap,
            isDirty: false,
        });
    }

    public static createEmpty(id: string | null): SlideBuilder
    {
        return new SlideBuilder({
            id: id ?? crypto.randomUUID(),
            orderedItemIds: [],
            itemBuilderMap: {},
            isDirty: false,
        });
    }

    public get id(): string
    {
        return this.data.id;
    }

    public get isDirty(): boolean
    {
        return this.data.isDirty;
    }

    public get items(): SlideItemBuilder[]
    {
        return this.itemBuilders;
    }

    public getById(id: string): SlideItemBuilder
    {
        this.assertItemExists(id);
        return this.data.itemBuilderMap[id];
    }

    public withUpdatedItem(slideItemBuilder: SlideItemBuilder): SlideBuilder
    {
        this.assertItemExists(slideItemBuilder.id);

        const itemBuilderMap = {...this.data.itemBuilderMap, [slideItemBuilder.id]: slideItemBuilder};

        return new SlideBuilder({
            ...this.data,
            isDirty: true,
            itemBuilderMap,
        });
    }

    public withMovedItem(slideItemId: string, newSucceedingSiblingItemId: string | null): SlideBuilder
    {
        this.assertItemExists(slideItemId);
        if (newSucceedingSiblingItemId !== null) {
            this.assertItemExists(newSucceedingSiblingItemId);
        }

        if (slideItemId === newSucceedingSiblingItemId) {
            return this;
        }

        const succeedingSlideIndex = newSucceedingSiblingItemId ? this.data.orderedItemIds.indexOf(newSucceedingSiblingItemId) : this.data.orderedItemIds.length;

        const precedingPart = this.data.orderedItemIds.slice(0, succeedingSlideIndex).filter(id => id !== slideItemId);
        const succeedingPart = this.data.orderedItemIds.slice(succeedingSlideIndex).filter(id => id !== slideItemId);

        const orderedItemIds = [...precedingPart, slideItemId, ...succeedingPart];

        return new SlideBuilder({
            ...this.data,
            isDirty: true,
            orderedItemIds,
        })
    }

    public withRemovedItem(slideItemId: string): SlideBuilder
    {
        this.assertItemExists(slideItemId);

        const {[slideItemId]: _, ...itemBuilderMap} = this.data.itemBuilderMap;
        const orderedItemIds = this.data.orderedItemIds.filter(id => id !== slideItemId);

        return new SlideBuilder({
            ...this.data,
            isDirty: true,
            itemBuilderMap,
            orderedItemIds,
        });
    }

    public withCreatedItem(slideItemBuilder: SlideItemBuilder, succeedingSiblingItemId: string | null = null): SlideBuilder
    {
        if (this.data.orderedItemIds.includes(slideItemBuilder.id)) {
            throw new Error(`Item does exist on slide but was not supposed to: "${slideItemBuilder.id}"`);
        }

        if (succeedingSiblingItemId !== null) {
            this.assertItemExists(succeedingSiblingItemId);

            const succeedingSlideIndex = this.data.orderedItemIds.indexOf(succeedingSiblingItemId);

            const precedingPart = this.data.orderedItemIds.slice(0, succeedingSlideIndex);
            const succeedingPart = this.data.orderedItemIds.slice(succeedingSlideIndex);

            const orderedItemIds = [...precedingPart, slideItemBuilder.id, ...succeedingPart];
            const itemBuilderMap = {...this.data.itemBuilderMap, [slideItemBuilder.id]: slideItemBuilder};

            return new SlideBuilder({
                ...this.data,
                isDirty: true,
                orderedItemIds,
                itemBuilderMap,
            });
        }

        const orderedItemIds = [...this.data.orderedItemIds, slideItemBuilder.id];
        const itemBuilderMap = {...this.data.itemBuilderMap, [slideItemBuilder.id]: slideItemBuilder};

        return new SlideBuilder({
            ...this.data,
            isDirty: true,
            orderedItemIds,
            itemBuilderMap,
        });
    }

    private assertItemExists(itemId: string): void
    {
        if (!this.data.orderedItemIds.includes(itemId)) {
            throw new Error(`Item does not exist on slide but was supposed to: "${itemId}"`);
        }
    }

    public build(): ISlide
    {
        const slideItems = [];

        for (const orderedItemId of this.data.orderedItemIds) {
            const slideItemBuilder = this.data.itemBuilderMap[orderedItemId];

            const slideItem = slideItemBuilder.build();

            if (slideItem !== null) {
                slideItems.push(
                    slideItem
                );
            }
        }

        return slideItems;
    }
}
