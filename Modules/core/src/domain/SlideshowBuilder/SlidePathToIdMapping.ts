type Mapping = {
    [id: string]: `s${number}` | `s${number}i${number}`
};

export class SlidePathToIdMapping
{
    private constructor(
        private readonly pathMapping: Mapping,
        private readonly slideIndex: number | null,
    ) {
    }

    public static create(pathMapping: Mapping): SlidePathToIdMapping
    {
        return new SlidePathToIdMapping(pathMapping, null);
    }

    public withSlideIndex(index: number): SlidePathToIdMapping
    {
        return new SlidePathToIdMapping(this.pathMapping, index);
    }

    public getForSlide(): string | null
    {
        return this.pathMapping[`s${this.slideIndex}`] ?? null;
    }

    public getForSlideItemIndex(index: number): string | null
    {
        if (this.slideIndex === null) {
            return null;
        }
        return this.pathMapping[`s${this.slideIndex}i${index}`] ?? null;
    }
}
