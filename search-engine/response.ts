class MyResponse {
    constructor(private status: number, private responseType: "data" | "error", private response?: any) {}

    public toJSON() {
        const jsonResponse: any = {
            status: this.status
        }
        
        jsonResponse[this.responseType] = this.response;

        return jsonResponse;
    }
}

export { MyResponse };