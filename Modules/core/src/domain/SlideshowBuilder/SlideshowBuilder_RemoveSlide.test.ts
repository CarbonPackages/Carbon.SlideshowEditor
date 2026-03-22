import {describe, it} from "node:test";
import {deepEqual, equal, throws} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";
import {SlideBuilder} from "./SlideBuilder.ts";

describe('SlideBuilder', () => {
    it('remove new slide from the start', () => {
        let slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        type: "image",
                        imageId: "my-image"
                    },
                ],
                [
                    {
                        type: "text",
                        text: "My text"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's0i0': 'firstImage',
                's1': 'slide1',
                's1i1': 'firstText',
            })
        );

        let newSlideshowBuilder = slideshowBuilder.withRemovedSlide(
            'slide0'
        );

        // immutability must be ensured. The original builder is NOT modified.
        equal(slideshowBuilder.getById('slide0') instanceof SlideBuilder, true);
        // new builder does not have image
        throws(() => newSlideshowBuilder.getById('slide0'));

        equal(newSlideshowBuilder.isDirty, true)

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        type: "text",
                        text: "My text"
                    }
                ]
            ] as ISlideshow,
        );
    });
});
