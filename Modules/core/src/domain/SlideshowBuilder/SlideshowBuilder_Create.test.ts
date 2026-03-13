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
    });

    it('create from slide', () => {
        deepEqual(
            SlideshowBuilder.createFromValue([[]]).build(),
            [[]],
        );

        const slideshowBuilder = SlideshowBuilder.createFromValue(
            [
                [
                    {
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
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
                        __type__: "Carbon\\SlideshowEditor\\ImageSlideItem",
                        imageId: "myId"
                    }
                ]
            ] as ISlideshow,
        );
    });
});
