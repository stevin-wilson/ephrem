export class BiblesFetchError extends Error {
    constructor(message, statusCode, statusText, context) {
        super(message);
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.context = context;
        this.name = 'BiblesFetchError';
    }
}
export class BooksFetchError extends Error {
    constructor(message, statusCode, statusText, context) {
        super(message);
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.context = context;
        this.name = 'BooksFetchError';
    }
}
export class PassageFetchError extends Error {
    constructor(message, statusCode, statusText, context) {
        super(message);
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.context = context;
        this.name = 'PassageFetchError';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLXR5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS1iaWJsZS9hcGktdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBYUEsTUFBTSxPQUFPLGdCQUFpQixTQUFRLEtBQUs7SUFDekMsWUFDRSxPQUFlLEVBQ1IsVUFBa0IsRUFDbEIsVUFBa0IsRUFDbEIsT0FBMkI7UUFFbEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBSlIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNsQixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQ2xCLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBR2xDLElBQUksQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUM7SUFDakMsQ0FBQztDQUNGO0FBZ0NELE1BQU0sT0FBTyxlQUFnQixTQUFRLEtBQUs7SUFDeEMsWUFDRSxPQUFlLEVBQ1IsVUFBa0IsRUFDbEIsVUFBa0IsRUFDbEIsT0FBMEI7UUFFakMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBSlIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNsQixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQ2xCLFlBQU8sR0FBUCxPQUFPLENBQW1CO1FBR2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUM7SUFDaEMsQ0FBQztDQUNGO0FBNkJELE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxLQUFLO0lBQzFDLFlBQ0UsT0FBZSxFQUNSLFVBQWtCLEVBQ2xCLFVBQWtCLEVBQ2xCLE9BQTRCO1FBRW5DLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUpSLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNsQixZQUFPLEdBQVAsT0FBTyxDQUFxQjtRQUduQyxJQUFJLENBQUMsSUFBSSxHQUFHLG1CQUFtQixDQUFDO0lBQ2xDLENBQUM7Q0FDRiJ9