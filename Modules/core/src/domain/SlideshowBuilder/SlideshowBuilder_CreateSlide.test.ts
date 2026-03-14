import {describe, it} from "node:test";
import {equal, deepEqual} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";

describe('SlideBuilder', () => {
    it('create new slide', () => {
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
                ]
            ],
        );

        const newSlideshowBuilder = slideshowBuilder.withCreatedSlide();

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
                        imageId: "second"
                    }
                ],
                [

                ]
            ] as ISlideshow,
        );
    });
});
