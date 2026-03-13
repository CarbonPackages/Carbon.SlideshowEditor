import {describe, it} from "node:test";
import {equal, deepEqual} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";

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
        );

        const firstSlideId = slideshowBuilder.getSlideIdForIndex(0);
        const secondSlideId = slideshowBuilder.getSlideIdForIndex(1);

        const newSlideshowBuilder = slideshowBuilder.withMovedSlide(secondSlideId, firstSlideId);

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
        );

        const firstSlideId = slideshowBuilder.getSlideIdForIndex(0);
        const thirdSlideId = slideshowBuilder.getSlideIdForIndex(2);

        const newSlideshowBuilder = slideshowBuilder.withMovedSlide(firstSlideId, thirdSlideId);

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
        );

        const secondSlideId = slideshowBuilder.getSlideIdForIndex(1);
        const thirdSlideId = slideshowBuilder.getSlideIdForIndex(2);

        const newSlideshowBuilder = slideshowBuilder.withMovedSlide(thirdSlideId, secondSlideId);

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
