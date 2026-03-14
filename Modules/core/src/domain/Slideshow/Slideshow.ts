export type ISlideshow = ISlide[];

export type ISlide = ISlideItem[];

export type ISlideItem = IImageSlideItem | IVideoSlideItem;

export interface IImageSlideItem {
    '__type__': 'Carbon\\SlideshowEditor\\ImageSlideItem'
    'imageId': string
}

export interface IVideoSlideItem {
    '__type__': 'Carbon\\SlideshowEditor\\VideoSlideItem'
    'video': unknown
}
