<?php

declare(strict_types=1);

namespace Carbon\SlideshowEditor\Tests\Functional;

use Carbon\SlideshowEditor\ImageSlideItem;
use Carbon\SlideshowEditor\Slide;
use Carbon\SlideshowEditor\Slideshow;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceInterface;
use Neos\ContentRepository\Core\Infrastructure\Property\PropertyConverter;
use Neos\ContentRepository\Core\Infrastructure\Property\PropertyType;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Node\PropertyName;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Tests\FunctionalTestCase;

class SlideshowNodePropertySerializationTest extends FunctionalTestCase
{
    protected PropertyConverter $propertyConverter;

    public function setUp(): void
    {
        parent::setUp();

        $crRegistry = $this->objectManager->get(ContentRepositoryRegistry::class);

        $spy = new class implements ContentRepositoryServiceFactoryInterface
        {
            public PropertyConverter $propertyConverter;

            public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): ContentRepositoryServiceInterface
            {
                $this->propertyConverter = $serviceFactoryDependencies->propertyConverter;
                return new class implements ContentRepositoryServiceInterface
                {
                };
            }
        };

        $crRegistry->buildService(
            ContentRepositoryId::fromString('default'),
            $spy
        );

        $this->propertyConverter = $spy->propertyConverter;
    }

    /** @test */
    public function deAndEncodeVideoObject(): void
    {
        $slideshow = new Slideshow(
            new Slide(
                new ImageSlideItem(imageId: 'first'),
                new ImageSlideItem(imageId: 'second'),
            ),
            new Slide(
                new ImageSlideItem(imageId: 'third'),
            )
        );

        $serialized = $this->propertyConverter->serializePropertyValue(
            PropertyType::fromNodeTypeDeclaration('Carbon\\SlideshowEditor\\Slideshow', PropertyName::fromString('slideshow'), NodeTypeName::fromString('Vendor:Test')),
            $slideshow
        );

        self::assertEquals(
            'Carbon\\SlideshowEditor\\Slideshow',
            $serialized->type
        );

        self::assertEquals(
            [
                [
                    [
                        '__type__' => 'Carbon\SlideshowEditor\ImageSlideItem',
                        'imageId' => 'first'
                    ],
                    [
                        '__type__' => 'Carbon\SlideshowEditor\ImageSlideItem',
                        'imageId' => 'second'
                    ],
                ],
                [
                    [
                        '__type__' => 'Carbon\SlideshowEditor\ImageSlideItem',
                        'imageId' => 'third'
                    ]
                ]
            ],
            $serialized->value
        );

        self::assertEquals(
            $slideshow,
            $this->propertyConverter->deserializePropertyValue($serialized)
        );
    }
}
