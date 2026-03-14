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
                fn (array $item): SlideItemInterface => match ($item['type']) {
                   'text' => TextSlideItem::fromArray($item),
                   'image' => ImageSlideItem::fromArray($item),
                   'video' => VideoSlideItem::fromArray($item),
                    default => throw new \RuntimeException(sprintf('Invalid slide item "%s".', json_encode($item)), 1773479921)
                },
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
            fn (SlideItemInterface $item) => [
                'type' => match ($item::class) {
                    TextSlideItem::class => 'text',
                    ImageSlideItem::class => 'image',
                    VideoSlideItem::class => 'video',
                    default => throw new \RuntimeException(sprintf('Invalid slide item "%s".', $item::class), 1773479941)
                },
                ...$item->jsonSerialize()
            ],
            $this->items
        );
    }
}
