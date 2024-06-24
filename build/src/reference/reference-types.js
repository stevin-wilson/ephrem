export class BookNotFoundError extends Error {
    constructor(message = 'Book Not Found', context) {
        super(message);
        this.name = 'BookNotFoundError';
        this.context = context;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLXR5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JlZmVyZW5jZS9yZWZlcmVuY2UtdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbUNBLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxLQUFLO0lBRzFDLFlBQVksT0FBTyxHQUFHLGdCQUFnQixFQUFFLE9BQXlCO1FBQy9ELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsbUJBQW1CLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztDQUNGIn0=