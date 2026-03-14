import {describe, it} from "node:test";
import {equal} from "node:assert/strict";
import {SlideshowBuilder} from './SlideshowBuilder.ts';
import {SlidePathToIdMapping} from "./SlidePathToIdMapping.ts";

describe('SlideBuilder Navigation', () => {
    it('get next and previous slide id', () => {
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

        equal(
            slideshowBuilder.previousSlideId('slide0'),
            null
        )

        equal(
            slideshowBuilder.previousSlideId('slide1'),
            'slide0'
        )

        equal(
            slideshowBuilder.previousSlideId('slide2'),
            'slide1'
        )

        equal(
            slideshowBuilder.nextSlideId('slide0'),
            'slide1'
        )

        equal(
            slideshowBuilder.nextSlideId('slide1'),
            'slide2'
        )

        equal(
            slideshowBuilder.nextSlideId('slide2'),
            null
        )
    });
});
