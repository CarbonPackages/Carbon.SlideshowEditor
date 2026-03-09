<?php

declare(strict_types=1);

namespace Carbon\SlideshowEditor;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final readonly class Slideshow implements \JsonSerializable
{
    public function __construct(
        public string $test
    ) {
    }

    /** @param array<int|string,mixed> $array */
    public static function fromArray(array $array): self
    {
        return new self(
            test: $array['test'],
        );
    }

    /** @return array<int|string,mixed> */
    public function jsonSerialize(): mixed
    {
        return [
            'test' => $this->test,
        ];
    }
}
