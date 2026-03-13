<?php

declare(strict_types=1);

namespace Carbon\SlideshowEditor;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final readonly class ImageSlideItem implements SlideItemInterface
{
    public function __construct(
        public string $imageId,
    ) {
    }

    /** @param array<int|string,mixed> $array */
    public static function fromArray(array $array): self
    {
        return new self(
            imageId: $array['imageId'],
        );
    }

    /** @return iterable<string> */
    public function extractAssetIds(): iterable
    {
        yield $this->imageId;
    }

    /** @return array<int|string,mixed> */
    public function jsonSerialize(): array
    {
        return [
            'imageId' => $this->imageId,
        ];
    }
}
