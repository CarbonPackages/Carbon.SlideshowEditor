import type {ITextSlideItem} from "../Slideshow/Slideshow";

export class TextSlideItemBuilder
{
    private constructor(
        private readonly data: {
            readonly id: string;
            readonly text: string | null;
            readonly isDirty: boolean;
        }
    ) {
    }

    public static createFromValue(value: ITextSlideItem, id: string | null): TextSlideItemBuilder
    {
        return new TextSlideItemBuilder({
            id: id ?? crypto.randomUUID(),
            text: value.text,
            isDirty: false,
        });
    }

    public static createEmpty(id: string | null = null): TextSlideItemBuilder
    {
        return new TextSlideItemBuilder({
            id: id ?? crypto.randomUUID(),
            text: null,
            isDirty: false,
        });
    }

    public get icon(): string
    {
        return 'paragraph';
    }

    public get label(): string
    {
        return 'Text';
    }

    public get id(): string
    {
        return this.data.id;
    }

    public get text(): string
    {
        return this.data.text ?? '';
    }

    public get isDirty(): boolean
    {
        // todo obsolete as we always do from above?
        return this.data.isDirty;
    }

    public withText(text: string): TextSlideItemBuilder
    {
        if (this.data.text === text) {
            return this;
        }
        return new TextSlideItemBuilder({
            ...this.data,
            isDirty: true,
            text
        });
    }

    public build(): ITextSlideItem | null
    {
        return this.data.text ? {
            type: "text",
            text: this.data.text
        } : null;
    }
}
