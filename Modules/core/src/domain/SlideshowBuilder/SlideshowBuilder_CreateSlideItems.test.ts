import {describe, it} from "node:test";
import {deepEqual, equal, throws} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";
import {ImageSlideItemBuilder} from "./ImageSlideItemBuilder.ts";
import {TextSlideItemBuilder} from "./TextSlideItemBuilder.ts";
import {SlideBuilder} from "./SlideBuilder.ts";

describe('SlideBuilder', () => {
    it('create new slide item', () => {
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
                's1': 'slide1',
            })
        );


        let newSlideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withCreatedItem(
                ImageSlideItemBuilder.createEmpty('newImage0')
            )
        );

        // immutability must be ensured. The original builder is NOT modified.
        throws(() => slideshowBuilder.getById('slide0').getById('newImage0'));
        equal(newSlideshowBuilder.getById('slide0').getById('newImage0') instanceof ImageSlideItemBuilder, true);

        equal(newSlideshowBuilder.isDirty, true)

        // building does not show the image as its empty and omitted
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
                ]
            ] as ISlideshow,
        );

        const imageBuilder = newSlideshowBuilder.getById('slide0').getById('newImage0');
        equal(imageBuilder.flowImageObject, null);

        newSlideshowBuilder = newSlideshowBuilder.withUpdatedSlide(
            newSlideshowBuilder.getById('slide0').withUpdatedItem(
                imageBuilder.withFlowImageObject({
                    __identity: 'newImage'
                })
            )
        );

        deepEqual(
            newSlideshowBuilder.build(),
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

    it('create new slide item at the start', () => {
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
            slideshowBuilder.getById('slide0').withCreatedItem(
                TextSlideItemBuilder.createEmpty('newText'),
                'firstImage'
            )
        );
        // immutability must be ensured. The original builder is NOT modified.
        throws(() => slideshowBuilder.getById('slide0').getById('newText'));
        equal(newSlideshowBuilder.getById('slide0').getById('newText') instanceof TextSlideItemBuilder, true);

        equal(newSlideshowBuilder.isDirty, true)

        // building does not show the image as its empty and omitted
        deepEqual(
            newSlideshowBuilder.build(),
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
            ] as ISlideshow,
        );

        const textBuilder = newSlideshowBuilder.getById('slide0').getById('newText');
        equal(textBuilder.text, '');

        newSlideshowBuilder = newSlideshowBuilder.withUpdatedSlide(
            newSlideshowBuilder.getById('slide0').withUpdatedItem(
                textBuilder.withText('My new text')
            )
        );

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        type: "text",
                        text: "My new text"
                    },
                    {
                        type: "image",
                        imageId: "my-image"
                    },
                    {
                        type: "text",
                        text: "My text"
                    }
                ]
            ] as ISlideshow,
        );
    });

    it('create new slide item in the middle', () => {
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

        slideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withCreatedItem(
                TextSlideItemBuilder.createEmpty('newText'),
                'firstText'
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
                        imageId: "my-image"
                    },
                    {
                        type: "text",
                        text: "My text"
                    }
                ]
            ] as ISlideshow,
        );

        const textBuilder = slideshowBuilder.getById('slide0').getById('newText');
        equal(textBuilder.text, '');

        slideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withUpdatedItem(
                textBuilder.withText('My new text')
            )
        );

        deepEqual(
            slideshowBuilder.build(),
            [
                [
                    {
                        type: "image",
                        imageId: "my-image"
                    },
                    {
                        type: "text",
                        text: "My new text"
                    },
                    {
                        type: "text",
                        text: "My text"
                    }
                ]
            ] as ISlideshow,
        );
    });
});
