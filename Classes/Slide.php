<?php

declare(strict_types=1);

namespace Carbon\SlideshowEditor;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final readonly class Slide implements \JsonSerializable
{
    /** @var array<SlideItemInterface> */
    public array $items;

    public function __construct(
        SlideItemInterface ...$items
    ) {
        $this->items = $items;
    }

    /** @param array<int|string,mixed> $array */
    public static function fromArray(array $array): self
    {
        return new self(
            ...array_map(
                /**
                 * @param array{__type__:class-string<SlideItemInterface>} $item
                 */
                fn (array $item): SlideItemInterface => ($item['__type__'])::fromArray($item),
                $array
            )
        );
    }

    /** @return iterable<string> */
    public function extractAssetIds(): iterable
    {
        foreach ($this->items as $item) {
            yield from $item->extractAssetIds();
        }
    }

    /** @return array<int|string,mixed> */
    public function jsonSerialize(): mixed
    {
        return array_map(
            fn (SlideItemInterface $item) => ['__type__' => $item::class, ...$item->jsonSerialize()],
            $this->items
        );
    }
}
