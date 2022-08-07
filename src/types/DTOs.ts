export interface User {
  name: string;
  email: string;
  id: string;
  role: "USER" | "ADMIN";
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  description: string;
  price: number;
  featuredPicture: string;
  listedOn: Date;
  pictures: string[];
}
