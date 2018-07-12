export class Rental{
    id: string;
    title: string;
    city: string;
    street: string;
    category: string;
    image: string;
    bedrooms: number;
    description: string;
    dailyRate: number;
    shared: boolean;
    createdAt: string;

    constructor(){
        this.id="";
        this.title="";
        this.city="";
        this.street="";
        this.category="";
        this.image="";
        this.bedrooms=0;
        this.description="";
        this.dailyRate=0;
        this.shared=false;
        this.createdAt="";
    }
}