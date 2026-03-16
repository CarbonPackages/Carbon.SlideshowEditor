import {describe, it} from "node:test";
import {deepEqual, equal} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";

describe('SlideBuilder', () => {
    it('update slide item', () => {
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
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's0i0': 'firstImage',
                's1': 'slide1',
                's1i0': 'secondImage',
            })
        );

        deepEqual(slideshowBuilder.getById('slide0').getById('firstImage').flowImageObject, {
            __identity: 'first'
        });

        const newSlideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withUpdatedItem(
                slideshowBuilder.getById('slide0').getById('firstImage').withFlowImageObject({
                    __identity: 'updatedImage'
                })
            )
        );

        // immutability must be ensured. The original builder is NOT modified.
        deepEqual(slideshowBuilder.getById('slide0').getById('firstImage').flowImageObject, {
            __identity: 'first'
        });

        equal(newSlideshowBuilder.isDirty, true)

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        type: "image",
                        imageId: "updatedImage"
                    }
                ],
                [
                    {
                        type: "image",
                        imageId: "second"
                    }
                ]
            ] as ISlideshow,
        );
    });

    it('update slide item to same value', () => {
        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        type: "text",
                        text: "My first text"
                    }
                ],
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's0i0': 'firstText',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withUpdatedItem(
                slideshowBuilder.getById('slide0').getById('firstText').withText('My first text')
            )
        );

        deepEqual(newSlideshowBuilder.build(), slideshowBuilder.build());
        equal(newSlideshowBuilder.isDirty, false);
        equal(newSlideshowBuilder, slideshowBuilder);
    });
});
