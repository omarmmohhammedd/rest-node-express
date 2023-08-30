export class ApiError extends Error{
    public statusCode: number;
    public status: string;
    constructor(message:string, statusCode:number) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail'
        
    }
    
}