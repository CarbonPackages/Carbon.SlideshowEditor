export type ISlideshow = ISlide[];

export type ISlide = ISlideItem[];

export type ISlideItem = IImageSlideItem;

export interface IImageSlideItem {
    '__type__': 'Carbon\\SlideshowEditor\\ImageSlideItem'
    'imageId': string
}
