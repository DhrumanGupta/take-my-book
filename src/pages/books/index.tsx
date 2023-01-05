import type { NextPage } from "next";
import MetaDecorator from "components/MetaDecorator";
import useSwrInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { bookRoutes } from "data/routes";
import { getBooks as getBooksDb } from "lib/apis/bookApi";
import { BookSearchProps } from "types/requests";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Loading from "components/Loading";
import BookListingCard from "components/listings/BookListingCard";
import SlideDown from "react-slidedown";
import InputGroup from "components/InputGroup";
import clsx from "clsx";
import { BookQueryResult } from "types/responses";
import axios from "axios";
import { SecondaryButton } from "components/Button";

interface FilterProps {
  data: BookSearchProps;
  setData: Dispatch<SetStateAction<BookSearchProps>>;
}

const Filter = ({ data, setData }: FilterProps) => {
  return (
    <>
      <InputGroup
        type="text"
        label="Book Name"
        placeholder="E.g. The Great Gatsby"
        className="w-full"
        value={data.search}
        setValue={(val) => setData((old) => ({ ...old, search: val }))}
      />

      <br />
      <br />

      <InputGroup
        type="text"
        label="ISBN"
        placeholder="E.g. 978-3-16-148410-0"
        className="w-full"
        value={data.isbn}
        setValue={(val) => setData((old) => ({ ...old, isbn: val }))}
      />

      <br />
      <br />

      <label className="mt-4 mb-1 font-semibold">Price Range</label>
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder={"Min"}
          type={"number"}
          value={data.priceLow}
          min={0}
          step={1}
          onChange={(e) =>
            setData((old) => {
              const value = parseFloat(e.target.value);
              const finalValue = Math.floor(value).toString();
              if (value < 0) {
                return old;
              }
              if (value > parseFloat(old.priceHigh || "0")) {
                return {
                  ...old,
                  priceLow: finalValue,
                  priceHigh: finalValue,
                };
              }
              return { ...old, priceLow: finalValue };
            })
          }
          className={"bg-gray-light text-md p-2 rounded w-full"}
        />

        <input
          placeholder={"Max"}
          type={"number"}
          min={0}
          step={1}
          value={data.priceHigh}
          onChange={(e) =>
            setData((old) => {
              const value = parseFloat(e.target.value);
              const finalValue = Math.floor(value).toString();
              if (value < 0) {
                return old;
              }

              if (value < parseFloat(old.priceLow || "0")) {
                return {
                  ...old,
                  priceLow: finalValue,
                  priceHigh: finalValue,
                };
              }
              return { ...old, priceHigh: finalValue };
            })
          }
          className={"bg-gray-light text-md p-2 rounded w-full"}
        />
      </div>
    </>
  );
};

const MobileFilter = ({ data, setData }: FilterProps) => {
  const [visible, setVisible] = useState<Boolean>(false);

  return (
    <>
      <p
        className={clsx("font-bold", visible && "mb-3")}
        onClick={() => setVisible((old) => !old)}
      >
        Filter {visible ? "v" : ">"}
      </p>

      {visible && (
        <SlideDown>
          <Filter data={data} setData={setData} />
        </SlideDown>
      )}
    </>
  );
};

const BookList = ({ params }: { params: BookSearchProps }) => {
  const getKey: SWRInfiniteKeyLoader<BookQueryResult | null> = (
    index,
    previosData
  ) => {
    return bookRoutes.getAll({
      ...params,
      cursor: previosData?.nextCursor,
    });
  };

  const { data, error, size, setSize, isLoading } =
    useSwrInfinite<BookQueryResult | null>(getKey, fetcher, {
      refreshInterval: 300000, // 5 Minutes
      shouldRetryOnError: true,
    });

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red">{error}</p>;

  return (
    <>
      {data!.length <= 0 && (
        <p className="text-gray-dark text-center absolute left-1/2 bottom-1/2 -translate-x-1/2 -translate-y-1/2">
          Wow, such empty
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {data!.map((listing) =>
          listing?.books.map((book) => (
            <BookListingCard key={book.id} {...book} />
          ))
        )}
      </div>

      {data?.at(-1)?.nextCursor && (
        <SecondaryButton
          className="w-full mt-4"
          onClick={() => setSize(size + 1)}
        >
          Load More
        </SecondaryButton>
      )}
    </>
  );
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

const Books: NextPage = () => {
  const [params, setParams] = useState<BookSearchProps>({
    isbn: "",
    search: "",
    priceLow: "",
    priceHigh: "",
  });

  const [searchParams, setSearchParams] = useState<BookSearchProps>(params);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams(params);
    }, 500);

    return () => clearTimeout(timeout);
  }, [params]);

  return (
    <>
      <MetaDecorator
        title="Book Listings"
        description="BorrowMyBooks is a one-stop application for finding and listing IB-MYP and IBDP books. BorrowMyBooks simplifies the entire process and streamlines communication so you can find and list books faster."
      />
      <main className="container-custom grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 py-6 md:py-2 lg:pt-12 lg:pb-24">
        <div className="md:hidden">
          <MobileFilter data={params} setData={setParams} />
        </div>
        <div className="hidden md:block">
          <Filter data={params} setData={setParams} />
        </div>

        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <BookList params={searchParams} />
        </div>
      </main>
    </>
  );
};

export default Books;
