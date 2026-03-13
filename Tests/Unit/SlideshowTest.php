<?php

declare(strict_types=1);

namespace Carbon\SlideshowEditor\Tests\Unit;

use Carbon\SlideshowEditor\ImageSlideItem;
use Carbon\SlideshowEditor\Slide;
use Carbon\SlideshowEditor\Slideshow;
use PHPUnit\Framework\TestCase;

class SlideshowTest extends TestCase
{
    /** @test */
    public function jsonDeAndEncode(): void
    {
        $slideshow = new Slideshow(
            new Slide(
                new ImageSlideItem(imageId: 'first'),
                new ImageSlideItem(imageId: 'second'),
            ),
            new Slide(
                new ImageSlideItem(imageId: 'third'),
            )
        );

        $json = <<<'JSON'
        [
            [
                {
                    "__type__": "Carbon\\SlideshowEditor\\ImageSlideItem",
                    "imageId": "first"
                },
                {
                    "__type__": "Carbon\\SlideshowEditor\\ImageSlideItem",
                    "imageId": "second"
                }
            ],
            [
                {
                    "__type__": "Carbon\\SlideshowEditor\\ImageSlideItem",
                    "imageId": "third"
                }
            ]
        ]
        JSON;

        self::assertJsonStringEqualsJsonString(
            $json,
            json_encode($slideshow)
        );

        self::assertEquals(
            $slideshow,
            Slideshow::fromArray(json_decode($json, true))
        );
    }

    /** @test */
    public function extractAssetIds(): void
    {
        $slideshow = new Slideshow(
            new Slide(
                new ImageSlideItem(imageId: 'first'),
                new ImageSlideItem(imageId: 'second'),
            ),
            new Slide(
                new ImageSlideItem(imageId: 'third'),
            )
        );

        self::assertEquals(
            ['first', 'second', 'third'],
            iterator_to_array($slideshow->extractAssetIds(), false)
        );
    }
}
