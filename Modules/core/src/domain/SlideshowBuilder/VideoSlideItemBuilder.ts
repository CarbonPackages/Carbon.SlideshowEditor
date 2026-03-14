import type {IVideoSlideItem} from "../Slideshow/Slideshow";

export class VideoSlideItemBuilder
{
    private constructor(
        private readonly data: {
            readonly id: string;
            readonly video: unknown;
            readonly isDirty: boolean;
        }
    ) {
    }

    public static createFromValue(value: IVideoSlideItem, id: string | null): VideoSlideItemBuilder
    {
        return new VideoSlideItemBuilder({
            id: id ?? crypto.randomUUID(),
            video: value.video,
            isDirty: false,
        });
    }

    public static createEmpty(id: string | null = null): VideoSlideItemBuilder
    {
        return new VideoSlideItemBuilder({
            id: id ?? crypto.randomUUID(),
            video: null,
            isDirty: false,
        });
    }


    public get id(): string
    {
        return this.data.id;
    }

    public get video(): unknown
    {
        return this.data.video;
    }

    public get isDirty(): boolean
    {
        // todo obsolete as we always do from above?
        return this.data.isDirty;
    }

    public withVideo(video: unknown): VideoSlideItemBuilder
    {
        return new VideoSlideItemBuilder({
            ...this.data,
            isDirty: true,
            video
        });
    }

    public build(): IVideoSlideItem | null
    {
        return this.data.video ? {
            __type__: "Carbon\\SlideshowEditor\\VideoSlideItem",
            video: this.data.video
        } : null;
    }
}
