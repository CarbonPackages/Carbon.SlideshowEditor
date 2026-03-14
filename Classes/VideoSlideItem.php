<?php

declare(strict_types=1);

namespace Carbon\SlideshowEditor;

use Carbon\VideoPlatformEditor\Video;
use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final readonly class VideoSlideItem implements SlideItemInterface
{
    public function __construct(
        public Video $video,
    ) {
    }

    /** @param array<int|string,mixed> $array */
    public static function fromArray(array $array): self
    {
        return new self(
            video: Video::fromArray($array['video']),
        );
    }

    /** @return iterable<string> */
    public function extractAssetIds(): iterable
    {
        yield $this->video->thumbnail->id;
    }

    /** @return array<int|string,mixed> */
    public function jsonSerialize(): array
    {
        return [
            'video' => $this->video,
        ];
    }
}
