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
                        type: "image",
                        imageId: "first"
                    }
                ],
                [
                    {
                        type: "image",
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
                        type: "image",
                        imageId: "first"
                    }
                ],
                [
                    {
                        type: "image",
                        imageId: "second"
                    }
                ],
                [

                ]
            ] as ISlideshow,
        );
    });
});
