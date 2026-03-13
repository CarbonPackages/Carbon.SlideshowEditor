<?php

namespace Carbon\SlideshowEditor;

interface SlideItemInterface extends \JsonSerializable
{
    /** @param array<int|string,mixed> $array */
    public static function fromArray(array $array): self;

    /** @return iterable<string> */
    public function extractAssetIds(): iterable;

    /** @return array<int|string,mixed> */
    public function jsonSerialize(): array;
}
