interface UserSignupProps {
  email: string;
  password: string;
  name: string;
}

interface UserLoginProps {
  email: string;
  password: string;
}

interface BookSearchProps {
  cursor?: string;
  isbn?: string;
  search?: string;
  priceLow?: string;
  priceHigh?: string;
}

interface BookCreateProps {
  title: string;
  isbn: string;
  description: string;
  price: string;
}

interface BookUploadImageProps {
  id: string;
}

interface ClientRequestState<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export type {
  ClientRequestState,
  BookUploadImageProps,
  UserSignupProps,
  UserLoginProps,
  BookCreateProps,
  BookSearchProps,
};
