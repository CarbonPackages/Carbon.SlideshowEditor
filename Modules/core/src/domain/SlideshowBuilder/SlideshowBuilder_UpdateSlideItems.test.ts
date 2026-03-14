import {describe, it} from "node:test";
import {deepEqual, equal} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";

describe('SlideBuilder', () => {
    it('update slide item', () => {
        let slideshowBuilder = SlideshowBuilder.createFromValue(
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

        slideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withUpdatedItem(
                slideshowBuilder.getById('slide0').getById('firstImage').withFlowImageObject({
                    __identity: 'updatedImage'
                })
            )
        );

        equal(slideshowBuilder.isDirty, true)

        deepEqual(
            slideshowBuilder.build(),
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
});
