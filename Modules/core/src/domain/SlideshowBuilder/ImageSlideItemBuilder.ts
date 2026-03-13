import type {IImageSlideItem} from "../Slideshow/Slideshow";

export class ImageSlideItemBuilder
{
    public flowImageObject: {__identity: string} | null;

    private constructor(
        private readonly data: {
            readonly id: string;
            readonly imageId: string | null;
            readonly isDirty: boolean;
        }
    ) {
        this.flowImageObject = this.data.imageId ? {
            __identity: this.data.imageId
        } : null;
    }

    public static createFromValue(value: IImageSlideItem): ImageSlideItemBuilder
    {
        return new ImageSlideItemBuilder({
            id: crypto.randomUUID(),
            imageId: value.imageId,
            isDirty: false,
        });
    }

    public static createEmpty(): ImageSlideItemBuilder
    {
        return new ImageSlideItemBuilder({
            id: crypto.randomUUID(),
            imageId: null,
            isDirty: false,
        });
    }


    public get id(): string
    {
        return this.data.id;
    }

    public get isDirty(): boolean
    {
        // todo obsolete as we always do from above?
        return this.data.isDirty;
    }

    public withFlowImageObject(flowImageObject: {__identity: string}): ImageSlideItemBuilder
    {
        return new ImageSlideItemBuilder({
            ...this.data,
            isDirty: true,
            imageId: flowImageObject.__identity
        });
    }

    public build(): IImageSlideItem | null
    {
        return this.data.imageId ? {
            __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
            imageId: this.data.imageId
        } : null;
    }
}
