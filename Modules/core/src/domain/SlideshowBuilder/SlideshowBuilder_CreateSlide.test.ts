import {describe, it} from "node:test";
import {equal, deepEqual, throws} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";
import {SlideBuilder} from "./SlideBuilder.ts";

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

        const newSlideshowBuilder = slideshowBuilder.withCreatedSlide('newSlide');

        // immutability must be ensured. The original builder is NOT modified.
        throws(() => slideshowBuilder.getById('newSlide'));
        equal(newSlideshowBuilder.getById('newSlide') instanceof SlideBuilder, true);

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
