"use client";

import axios from "axios";
import Loading from "components/Loading";
import useUser from "hooks/useUser";
import { AxiosResponse } from "lib/apis/types";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import { Book } from "types/DTOs";
import useSWR from "swr";
import { adminRoutes } from "data/routes";
import Link from "next/link";

const bookFetcher = async (url: string) => {
  const response: AxiosResponse<Book[]> = await axios.get(url);
  return response.data.data!;
};

const BookLink = ({ book, dataKey }: { book: Book; dataKey: string }) => {
  // @ts-ignore
  let el = book[dataKey];
  if (dataKey.toLowerCase().includes("on")) {
    el = new Date(el).toLocaleDateString();
  }

  if (dataKey.toLowerCase().includes("price")) {
    el = `Rs. ${el}`;
  }
  return (
    <Link
      href={`/books/${book.id}`}
      className="break-words no-underline text-black"
    >
      {el}
    </Link>
  );
};

const Page = () => {
  const { user, loading, loggedIn } = useUser();

  const router = useRouter();

  const { data, isLoading } = useSWR(adminRoutes.logs, bookFetcher);

  useEffect(() => {
    if ((!loading && !loggedIn) || (user && user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, router, loggedIn, loading]);

  if (loading || isLoading || data === undefined) {
    return <Loading />;
  }

  return (
    <div className="p-5">
      <h1>Book Listing Logs</h1>
      <div className="border-t border-r grid grid-cols-4 child:text-center child:p-1 child:border-l child:border-b">
        <h2 className="text-center bg-gray-light">Listing name</h2>
        <h2 className="text-center bg-gray-light">Price</h2>
        <h2 className="text-center bg-gray-light">ISBN</h2>
        <h2 className="text-center bg-gray-light">Listed at</h2>
        {data.map((book) => (
          <Fragment key={book.id}>
            <BookLink book={book} dataKey="title" />
            <BookLink book={book} dataKey="price" />
            <BookLink book={book} dataKey="isbn" />
            <BookLink book={book} dataKey="listedOn" />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Page;
