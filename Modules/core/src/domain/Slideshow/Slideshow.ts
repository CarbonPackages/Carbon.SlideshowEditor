export type ISlideshow = ISlide[];

export type ISlide = ISlideItem[];

export type ISlideItem = ITextSlideItem | IImageSlideItem | IVideoSlideItem;

export interface ITextSlideItem {
    'type': 'text'
    'text': string
}

export interface IImageSlideItem {
    'type': 'image'
    'imageId': string
}

export interface IVideoSlideItem {
    'type': 'video'
    'video': unknown
}
