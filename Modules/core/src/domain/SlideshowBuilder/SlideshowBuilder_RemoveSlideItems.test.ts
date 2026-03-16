import {describe, it} from "node:test";
import {deepEqual, equal, throws} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";
import {ImageSlideItemBuilder} from "./ImageSlideItemBuilder.ts";
import {SlideBuilder} from "./SlideBuilder.ts";

describe('SlideBuilder', () => {
    it('remove new slide item from the start', () => {
        let slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        type: "image",
                        imageId: "my-image"
                    },
                    {
                        type: "text",
                        text: "My text"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's0i0': 'firstImage',
                's0i1': 'firstText',
            })
        );

        let newSlideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withRemovedItem(
                'firstImage'
            )
        );
        // immutability must be ensured. The original builder is NOT modified.
        equal(slideshowBuilder.getById('slide0').getById('firstImage') instanceof ImageSlideItemBuilder, true);
        // new builder does not have image
        throws(() => newSlideshowBuilder.getById('slide0').getById('firstImage'));

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
