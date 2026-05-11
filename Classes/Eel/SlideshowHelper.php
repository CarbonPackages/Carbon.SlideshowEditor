<?php

declare(strict_types=1);

namespace Carbon\SlideshowEditor\Eel;

use Carbon\SlideshowEditor\ImageSlideItem;
use Carbon\SlideshowEditor\SlideItemInterface;
use Carbon\SlideshowEditor\Slideshow;
use Carbon\SlideshowEditor\TextSlideItem;
use Carbon\SlideshowEditor\VideoSlideItem;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Media\Domain\Model\ImageInterface;
use Neos\Media\Domain\Repository\ImageRepository;

/**
 * Eel helpers exposed to Fusion under `Carbon.SlideShowEditor.*` for read-side rendering of
 * `Carbon\SlideshowEditor\Slideshow` properties.
 */
class SlideshowHelper implements ProtectedContextAwareInterface
{
    #[Flow\Inject]
    protected ImageRepository $imageRepository;

    /**
     * Truthy when the slideshow has at least one slide. Used by the Fusion `@if.hasSlides`
     * guard on the renderer; PHP's `count()` is not callable from the untrusted Eel context.
     */
    public function hasSlides(?Slideshow $slideshow): bool
    {
        return $slideshow !== null && $slideshow->items !== [];
    }

    /**
     * Resolve an `ImageSlideItem::imageId` (asset persistence identifier) to an
     * `ImageInterface` consumable by `Neos.Neos:ImageTag`. Returns null if the asset is gone.
     *
     * Accepts null because Fusion AFX evaluates the `asset` attribute even when the
     * surrounding element's `@if.isImage` predicate is false — for non-image items
     * (TextSlideItem etc.) `item.imageId` resolves to null, not a string.
     */
    public function imageById(?string $imageId): ?ImageInterface
    {
        if ($imageId === null || $imageId === '') {
            return null;
        }
        $entity = $this->imageRepository->findByIdentifier($imageId);
        return $entity instanceof ImageInterface ? $entity : null;
    }

    /**
     * Return the concrete slide-item type as a string so Fusion can dispatch with
     * `Neos.Fusion:Case`. One of: 'image' | 'text' | 'video'.
     */
    public function itemType(SlideItemInterface $item): string
    {
        return match ($item::class) {
            ImageSlideItem::class => 'image',
            TextSlideItem::class => 'text',
            VideoSlideItem::class => 'video',
        };
    }

    public function allowsCallOfMethod($methodName): bool
    {
        return true;
    }
}
