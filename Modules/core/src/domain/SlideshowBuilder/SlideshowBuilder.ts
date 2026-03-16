import type {ISlideshow} from "../Slideshow";
import {SlideBuilder} from "./SlideBuilder.ts";
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";

export class SlideshowBuilder
{
    private slideBuilders: SlideBuilder[];

    private constructor(
        private readonly data: {
            readonly orderedSlideIds: string[],
            readonly slideBuilderMap: {
                [id: string]: SlideBuilder
            }
            readonly isDirty: boolean;
        }
    ) {
        const slideBuilders = [];
        for (const slideId of this.data.orderedSlideIds) {
            const slideBuilder = this.data.slideBuilderMap[slideId];
            slideBuilders.push(
                slideBuilder
            );
        }
        this.slideBuilders = slideBuilders;
    }

    public static createFromValue(value: ISlideshow | null, deterministicIds: SlidePathToIdMapping | null): SlideshowBuilder
    {
        const orderedSlideIds = [];
        const slideBuilderMap = {};

        let index = 0;
        for (const slide of value ?? []) {
            const slideBuilder = SlideBuilder.createFromValue(slide, deterministicIds?.withSlideIndex(index));
            orderedSlideIds.push(slideBuilder.id);
            slideBuilderMap[slideBuilder.id] = slideBuilder;
            ++index;
        }

        return new SlideshowBuilder({
            orderedSlideIds,
            slideBuilderMap,
            isDirty: false,
        });
    }

    public get isDirty(): boolean
    {
        return this.data.isDirty;
    }

    public get slides(): SlideBuilder[]
    {
        return this.slideBuilders;
    }

    public getById(id: string): SlideBuilder
    {
        this.assertSlideExists(id);
        return this.data.slideBuilderMap[id];
    }

    public previousSlideId(id: string): string | null
    {
        this.assertSlideExists(id);
        const index = this.data.orderedSlideIds.indexOf(id);
        return this.data.orderedSlideIds[index - 1] ?? null;
    }

    public nextSlideId(id: string): string | null
    {
        this.assertSlideExists(id);
        const index = this.data.orderedSlideIds.indexOf(id);
        return this.data.orderedSlideIds[index + 1] ?? null;
    }

    public withMovedSlide(slideId: string, newSucceedingSiblingSlideId: string | null): SlideshowBuilder
    {
        this.assertSlideExists(slideId);
        if (newSucceedingSiblingSlideId !== null) {
            this.assertSlideExists(newSucceedingSiblingSlideId);
        }

        if (slideId === newSucceedingSiblingSlideId) {
            return this;
        }

        const succeedingSlideIndex = newSucceedingSiblingSlideId ? this.data.orderedSlideIds.indexOf(newSucceedingSiblingSlideId) : this.data.orderedSlideIds.length;

        if ((this.data.orderedSlideIds.indexOf(slideId) + 1) === succeedingSlideIndex) {
            return this;
        }

        const precedingPart = this.data.orderedSlideIds.slice(0, succeedingSlideIndex).filter(id => id !== slideId);
        const succeedingPart = this.data.orderedSlideIds.slice(succeedingSlideIndex).filter(id => id !== slideId);

        const orderedSlideIds = [...precedingPart, slideId, ...succeedingPart];

        return new SlideshowBuilder({
            ...this.data,
            isDirty: true,
            orderedSlideIds,
        })
    }

    public withCreatedSlide(id: string | null = null): SlideshowBuilder
    {
        const slideBuilder = SlideBuilder.createEmpty(id);

        const orderedSlideIds = [...this.data.orderedSlideIds, slideBuilder.id];
        const slideBuilderMap = {...this.data.slideBuilderMap, [slideBuilder.id]: slideBuilder};

        return new SlideshowBuilder({
            ...this.data,
            isDirty: true,
            orderedSlideIds,
            slideBuilderMap,
        });
    }

    public withUpdatedSlide(slideBuilder: SlideBuilder): SlideshowBuilder
    {
        this.assertSlideExists(slideBuilder.id);

        if (this.data.slideBuilderMap[slideBuilder.id] === slideBuilder) {
            return this;
        }

        const slideBuilderMap = {...this.data.slideBuilderMap, [slideBuilder.id]: slideBuilder};

        return new SlideshowBuilder({
            ...this.data,
            isDirty: true,
            slideBuilderMap,
        });
    }

    private assertSlideExists(slideId: string): void
    {
        if (!this.data.orderedSlideIds.includes(slideId)) {
            throw new Error(`Slide does not exist but was supposed to: "${slideId}"`);
        }
    }

    public build(): ISlideshow
    {
        const slideshow = [];

        for (const slideId of this.data.orderedSlideIds) {
            const slideBuilder = this.data.slideBuilderMap[slideId];
            slideshow.push(
                slideBuilder.build()
            );
        }

        return slideshow;
    }
}
