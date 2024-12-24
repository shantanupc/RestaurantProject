export interface RestaurentData {
    _id?: string;  // MongoDB ObjectID
    posts: {
        id: string;
        name: string;
        address: string;
        email: string;
        services: string;
        mobile: number | string;
    };
}