export class DragContext
{
    private constructor(
        private readonly data: {
            readonly isDragging: boolean;
            readonly isDragover: boolean;
            readonly dragoverId: string | null;
        }
    ) {
    }

    public static dragging(): DragContext
    {
        return new DragContext({
            isDragging: true,
            isDragover: false,
            dragoverId: null,
        })
    }

    public static none(): DragContext
    {
        return new DragContext({
            isDragging: false,
            isDragover: false,
            dragoverId: null,
        });
    }

    public withDragover(dragOverId: string | null): DragContext
    {
        return new DragContext({
            ...this.data,
            isDragover: true,
            dragoverId: dragOverId
        });
    }

    public withoutDragover(): DragContext
    {
        return new DragContext({
            ...this.data,
            isDragover: false,
            dragoverId: null
        });
    }

    public get isDragging(): boolean
    {
        return this.data.isDragging;
    }

    public get isDragoverLast(): boolean
    {
        return this.data.isDragover && this.data.dragoverId === null;
    }

    public get dragoverId(): string | null
    {
        return this.data.dragoverId;
    }
}
