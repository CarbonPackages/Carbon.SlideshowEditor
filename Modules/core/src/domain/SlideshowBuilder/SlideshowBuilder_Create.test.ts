import {describe, it} from "node:test";
import {equal, deepEqual} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import type {ISlideshow} from "../Slideshow";

describe('SlideBuilder', () => {
    it('create empty', () => {
        deepEqual(
            SlideshowBuilder.createFromValue([]).build(),
            [],
        );

        deepEqual(
            SlideshowBuilder.createFromValue(null).build(),
            [],
        );

        deepEqual(
            SlideshowBuilder.createFromValue([[]]).build(),
            [[]],
        );
    });

    it('create from slide with image', () => {
        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        type: "image",
                        imageId: "myId"
                    }
                ]
            ]
        );

        equal(slideshowBuilder.isDirty, false);

        deepEqual(
            slideshowBuilder.build(),
            [
                [
                    {
                        type: "image",
                        imageId: "myId"
                    }
                ]
            ] as ISlideshow,
        );
    });

    it('create from slide with image and video', () => {
        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        type: "image",
                        imageId: "myId"
                    },
                    {
                        type: "video",
                        video: {
                            videoId: "#1267845"
                        }
                    }
                ],
                [
                    {
                        type: "text",
                        text: "<span>my text</span>"
                    },
                ]
            ]
        );

        equal(slideshowBuilder.isDirty, false);

        deepEqual(
            slideshowBuilder.build(),
            [
                [
                    {
                        type: "image",
                        imageId: "myId"
                    },
                    {
                        type: "video",
                        video: {
                            videoId: "#1267845"
                        }
                    }
                ],
                [
                    {
                        type: "text",
                        text: "<span>my text</span>"
                    },
                ]
            ] as ISlideshow,
        );
    });
});
