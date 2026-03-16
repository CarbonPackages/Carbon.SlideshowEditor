import {describe, it} from "node:test";
import {equal, deepEqual} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";

describe('SlideBuilder Move', () => {
    it('move slide from middle to start', () => {
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
                ],
                [
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's1': 'slide1',
                's2': 'slide2',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withMovedSlide('slide1', 'slide0');

        // original builder is not modified
        deepEqual(slideshowBuilder.slides.map(slide => slide.id), ['slide0', 'slide1', 'slide2']);
        deepEqual(newSlideshowBuilder.slides.map(slide => slide.id), ['slide1', 'slide0', 'slide2']);

        equal(newSlideshowBuilder.isDirty, true)

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        type: "image",
                        imageId: "second"
                    }
                ],
                [
                    {
                        type: "image",
                        imageId: "first"
                    }
                ],
                [
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ] as ISlideshow,
        );
    });

    it('move slide from start to middle', () => {
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
                ],
                [
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's1': 'slide1',
                's2': 'slide2',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withMovedSlide('slide0', 'slide2');

        equal(newSlideshowBuilder.isDirty, true)

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        type: "image",
                        imageId: "second"
                    }
                ],
                [
                    {
                        type: "image",
                        imageId: "first"
                    }
                ],
                [
                    {
                        type: "image",
                        imageId: "third"
                    }
                ],
            ] as ISlideshow,
        );
    });

    it('move slide from end to middle', () => {
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
                ],
                [
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's1': 'slide1',
                's2': 'slide2',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withMovedSlide('slide2', 'slide1');

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
                        imageId: "third"
                    }
                ],
                [
                    {
                        type: "image",
                        imageId: "second"
                    }
                ],
            ] as ISlideshow,
        );
    });

    it('move slide from start to end', () => {
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
                ],
                [
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's1': 'slide1',
                's2': 'slide2',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withMovedSlide('slide0', null);

        equal(newSlideshowBuilder.isDirty, true)

        deepEqual(
            newSlideshowBuilder.build(),
            [
                [
                    {
                        type: "image",
                        imageId: "second"
                    }
                ],
                [
                    {
                        type: "image",
                        imageId: "third"
                    }
                ],
                [
                    {
                        type: "image",
                        imageId: "first"
                    }
                ],
            ] as ISlideshow,
        );
    });

    it('move slide to same position', () => {
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
                ],
                [
                    {
                        type: "image",
                        imageId: "third"
                    }
                ]
            ],
            SlidePathToIdMapping.create({
                's0': 'slide0',
                's1': 'slide1',
                's2': 'slide2',
            })
        );

        const newSlideshowBuilder = slideshowBuilder.withMovedSlide('slide0', 'slide0');

        deepEqual(newSlideshowBuilder.build(), slideshowBuilder.build())
        equal(newSlideshowBuilder.isDirty, false)
        equal(newSlideshowBuilder, slideshowBuilder)

        const newSlideshowBuilder2 = slideshowBuilder.withMovedSlide('slide0', 'slide1');

        deepEqual(newSlideshowBuilder2.build(), slideshowBuilder.build())
        equal(newSlideshowBuilder2.isDirty, false)
        equal(newSlideshowBuilder, slideshowBuilder)

        const newSlideshowBuilder3 = slideshowBuilder.withMovedSlide('slide2', null);

        deepEqual(newSlideshowBuilder3.build(), slideshowBuilder.build())
        equal(newSlideshowBuilder3.isDirty, false)
        equal(newSlideshowBuilder, slideshowBuilder)
    });
});
