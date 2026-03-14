<?php

declare(strict_types=1);

namespace Carbon\SlideshowEditor;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final readonly class TextSlideItem implements SlideItemInterface
{
    public function __construct(
        public string $text,
    ) {
    }

    /** @param array<int|string,mixed> $array */
    public static function fromArray(array $array): self
    {
        return new self(
            text: $array['text'],
        );
    }

    /** @return iterable<string> */
    public function extractAssetIds(): iterable
    {
        // todo haha also extract asset ids from text via regex
        yield from [];
    }

    /** @return array<int|string,mixed> */
    public function jsonSerialize(): array
    {
        return [
            'text' => $this->text,
        ];
    }
}
