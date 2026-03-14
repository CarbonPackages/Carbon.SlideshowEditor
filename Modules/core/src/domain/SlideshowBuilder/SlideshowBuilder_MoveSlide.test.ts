import {describe, it} from "node:test";
import {equal, deepEqual} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";

describe('SlideBuilder Move', () => {
    it('move slide from middle to start', () => {
        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "first"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "second"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's1': 'slide1',
                's2': 'slide2',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withMovedSlide('slide1', 'slide0');

        equal(newSlideshowBuilder.isDirty, true)

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "second"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "first"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "third"
                    }
                ]
            ] as ISlideshow,
        );
    });

    it('move slide from start to end', () => {
        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "first"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "second"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's1': 'slide1',
                's2': 'slide2',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withMovedSlide('slide0', 'slide2');

        equal(newSlideshowBuilder.isDirty, true)

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "second"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "third"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "first"
                    }
                ],
            ] as ISlideshow,
        );
    });

    it('move slide from end to middle', () => {
        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "first"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "second"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's1': 'slide1',
                's2': 'slide2',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withMovedSlide('slide2', 'slide1');

        equal(newSlideshowBuilder.isDirty, true)

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "first"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "third"
                    }
                ],
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "second"
                    }
                ],
            ] as ISlideshow,
        );
    });
});
