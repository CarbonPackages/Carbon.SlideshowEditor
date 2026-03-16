import {describe, it} from "node:test";
import {equal, deepEqual} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";

describe('SlideBuilder Move', () => {
    it('move slide item from middle to start', () => {
        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        type: "image",
                        imageId: "first"
                    },
                    {
                        type: "image",
                        imageId: "second"
                    },
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's0i0': 'firstItem',
                's0i1': 'secondItem',
                's0i2': 'thirdItem',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withMovedItem('secondItem', 'firstItem')
        );

        equal(newSlideshowBuilder.isDirty, true)

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        type: "image",
                        imageId: "second"
                    },
                    {
                        type: "image",
                        imageId: "first"
                    },
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ] as ISlideshow,
        );
    });

    it('move slide item from start to middle', () => {
        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        type: "image",
                        imageId: "first"
                    },
                    {
                        type: "image",
                        imageId: "second"
                    },
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's0i0': 'firstItem',
                's0i1': 'secondItem',
                's0i2': 'thirdItem',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withMovedItem('firstItem', 'thirdItem')
        );

        equal(newSlideshowBuilder.isDirty, true)

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        type: "image",
                        imageId: "second"
                    },
                    {
                        type: "image",
                        imageId: "first"
                    },
                    {
                        type: "image",
                        imageId: "third"
                    },
                ]
            ] as ISlideshow,
        );
    });

    it('move slide item from end to middle', () => {
        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        type: "image",
                        imageId: "first"
                    },
                    {
                        type: "image",
                        imageId: "second"
                    },
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's0i0': 'firstItem',
                's0i1': 'secondItem',
                's0i2': 'thirdItem',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withMovedItem('thirdItem', 'secondItem')
        );

        equal(newSlideshowBuilder.isDirty, true)

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
                        imageId: "third"
                    },
                    {
                        type: "image",
                        imageId: "second"
                    },
                ]
            ] as ISlideshow,
        );
    });

    it('move slide item from start to end', () => {
        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        type: "image",
                        imageId: "first"
                    },
                    {
                        type: "image",
                        imageId: "second"
                    },
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's0i0': 'firstItem',
                's0i1': 'secondItem',
                's0i2': 'thirdItem',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withMovedItem('firstItem',  null)
        );

        equal(newSlideshowBuilder.isDirty, true)

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        type: "image",
                        imageId: "second"
                    },
                    {
                        type: "image",
                        imageId: "third"
                    },
                    {
                        type: "image",
                        imageId: "first"
                    },
                ]
            ] as ISlideshow,
        );
    });

    it('move slide item to same position', () => {
        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        type: "image",
                        imageId: "first"
                    },
                    {
                        type: "image",
                        imageId: "second"
                    },
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's0i0': 'firstItem',
                's0i1': 'secondItem',
                's0i2': 'thirdItem',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withMovedItem('firstItem',  'firstItem')
        );

        deepEqual(newSlideshowBuilder.build(), slideshowBuilder.build())
        equal(newSlideshowBuilder.isDirty, false)
        equal(newSlideshowBuilder, slideshowBuilder)

        const newSlideshowBuilder2 = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withMovedItem('firstItem',  'secondItem')
        );

        deepEqual(newSlideshowBuilder2.build(), slideshowBuilder.build())
        equal(newSlideshowBuilder2.isDirty, false)
        equal(newSlideshowBuilder2, slideshowBuilder)

        const newSlideshowBuilder3 = slideshowBuilder.withUpdatedSlide(
            slideshowBuilder.getById('slide0').withMovedItem('thirdItem',  null)
        );

        deepEqual(newSlideshowBuilder3.build(), slideshowBuilder.build())
        equal(newSlideshowBuilder3.isDirty, false)
        equal(newSlideshowBuilder3, slideshowBuilder)
    });
});
