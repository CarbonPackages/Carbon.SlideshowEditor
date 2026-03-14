import {describe, it} from "node:test";
import {equal, deepEqual} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";
import {ImageSlideItemBuilder} from "./ImageSlideItemBuilder.ts";

describe('SlideBuilder', () => {
    it('create new slide item', () => {
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
                's1': 'slide1',
            })
        );


        slideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withCreatedItem(
                ImageSlideItemBuilder.createEmpty('newImage0')
            )
        );

        equal(slideshowBuilder.isDirty, true)

        // building does not show the image as its empty and omitted
        deepEqual(
            slideshowBuilder.build(),
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
            ] as ISlideshow,
        );

        const imageBuilder = slideshowBuilder.getById('slide0').getById('newImage0');
        equal(imageBuilder.flowImageObject, null);

        slideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withUpdatedItem(
                imageBuilder.withFlowImageObject({
                    __identity: 'newImage'
                })
            )
        );

        deepEqual(
            slideshowBuilder.build(),
            [
                [
                    {
                        type: "image",
                        imageId: "first"
                    },
                    {
                        type: "image",
                        imageId: "newImage"
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
