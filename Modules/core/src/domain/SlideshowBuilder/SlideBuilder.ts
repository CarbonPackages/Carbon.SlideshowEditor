import type {ISlide} from "../Slideshow/Slideshow";
import {ImageSlideItemBuilder} from "./ImageSlideItemBuilder.ts";
import {VideoSlideItemBuilder} from "./VideoSlideItemBuilder.ts";

type SlideItemBuilder = ImageSlideItemBuilder;

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

    public static createFromValue(value: ISlide | null): SlideBuilder
    {
        const orderedItemIds = [];
        const itemBuilderMap = {};

        for (const slideItem of value ?? []) {
            let slideItemBuilder = null;

            switch (slideItem.__type__) {
                case "Carbon\\SlideshowEditor\\ImageSlideItem":
                    slideItemBuilder = ImageSlideItemBuilder.createFromValue(slideItem);
                    break;
                case "Carbon\\SlideshowEditor\\VideoSlideItem":
                    slideItemBuilder = VideoSlideItemBuilder.createFromValue(slideItem);
                    break;
                default:
                    throw new Error(`Unhandled slide item "${JSON.stringify(slideItem)}"`);
            }

            orderedItemIds.push(slideItemBuilder.id);
            itemBuilderMap[slideItemBuilder.id] = slideItemBuilder;
        }

        return new SlideBuilder({
            id: crypto.randomUUID(),
            orderedItemIds,
            itemBuilderMap,
            isDirty: false,
        });
    }

    public get id(): string
    {
        return this.data.id;
    }

    public get isDirty(): boolean
    {
        return this.data.isDirty || Object.values(this.data.itemBuilderMap).some((slideItemBuilder: SlideItemBuilder) => slideItemBuilder.isDirty);
    }

    public get items(): SlideItemBuilder[]
    {
        return this.itemBuilders;
    }

    public withUpdatedItem(slideItemBuilder: SlideItemBuilder): SlideBuilder
    {
        this.assertItemExists(slideItemBuilder.id);

        const {itemBuilderMap} = this.data;

        itemBuilderMap[slideItemBuilder.id] = slideItemBuilder;

        return new SlideBuilder({
            ...this.data,
            isDirty: true,
            itemBuilderMap,
        });
    }

    public withNewItem(slideItemBuilder: SlideItemBuilder): SlideBuilder
    {
        if (this.data.orderedItemIds.includes(slideItemBuilder.id)) {
            throw new Error(`Item does exist on slide but was not supposed to: "${slideItemBuilder.id}"`);
        }

        const {orderedItemIds, itemBuilderMap} = this.data;

        orderedItemIds.push(slideItemBuilder.id);
        itemBuilderMap[slideItemBuilder.id] = slideItemBuilder;

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
