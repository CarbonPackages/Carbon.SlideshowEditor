<?php

declare(strict_types=1);

namespace Carbon\SlideshowEditor\Infrastructure;

use Carbon\SlideshowEditor\Slideshow;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;

#[Flow\Aspect()]
class AssetUsageExtractionAspect
{
    #[Flow\Around('method(Neos\Neos\AssetUsage\Service\AssetUsageIndexingService->extractAssetIds())')]
    public function extractAssetIdsFromValueObjects(JoinPointInterface $joinPoint): array
    {
        $nodePropertyValue = $joinPoint->getMethodArgument('value');
        if ($nodePropertyValue instanceof Slideshow) {
            // ToDo fix in core array_unique
            return array_unique(iterator_to_array($nodePropertyValue->extractAssetIds(), preserve_keys: false));
        }
        return $joinPoint->getAdviceChain()->proceed($joinPoint);
    }
}
