<?php

declare(strict_types=1);

namespace Carbon\SlideshowEditor\Infrastructure;

use Carbon\SlideshowEditor\Slide;
use Carbon\SlideshowEditor\Slideshow;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * Workaround for the Neos Ui and the ContentRepository using different serialisation methods for value objects
 * {@link https://github.com/neos/neos-development-collection/issues/5759}
 * Covered by test {@see VideoNodePropertySerializationTest}
 */
final class SlideshowNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    /**
     * @param array<string,mixed> $context
     * @return array|\ArrayObject<string,mixed>|bool|float|int|mixed|string|null
     */
    public function normalize(mixed $object, ?string $format = null, array $context = [])
    {
        if ($object instanceof Slideshow || $object instanceof Slide) {
            return $this->normalizer->normalize(
                $object->jsonSerialize(),
                $format,
                $context
            );
        }
        return $object;
    }

    public function supportsNormalization(mixed $data, ?string $format = null)
    {
        return $data instanceof Slideshow || $data instanceof Slide;
    }
}
