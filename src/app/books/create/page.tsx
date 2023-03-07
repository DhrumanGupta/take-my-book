"use client";

import clsx from "clsx";
import { PrimaryButton } from "components/Button";
import Plus from "components/icons/Plus";
import InputGroup from "components/InputGroup";
import MetaDecorator from "components/MetaDecorator";
import TextAreaInputGroup from "components/TextAreaInputGroup";
import { FormEventHandler, useEffect, useState } from "react";
import { Book } from "types/DTOs";
import { BookCreateProps, ClientRequestState } from "types/requests";
import { createBook } from "lib/apis/bookApi";
import Loading from "components/Loading";
import { useRouter } from "next/navigation";
import { ProtectedPage } from "components/Auth";
// import { useSocket } from "lib/SocketContext";

interface Params extends Omit<BookCreateProps, "pictures"> {
  pictures: File[];
}

interface FileUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles }) => {
  return (
    <div className="bg-gray-light rounded-md text-center w-full h-full">
      {files.length > 0 && (
        <span className="p-4">
          {files.map((file) => (
            <p key={file.name}>{file.name}</p>
          ))}
        </span>
      )}
      <label
        htmlFor="file-upload"
        className={clsx("hover:cursor-pointer block font-bold p-4", "pt-12")}
      >
        <Plus className="w-1/6 h-min mx-auto mb-10 text-gray-darks" />
        Upload Images
        <p className="pb-8 w-3/4 mx-auto font-normal">
          Using real pictures helps others verify your book
        </p>
      </label>

      <input
        type="file"
        multiple
        onChange={(e) => {
          setFiles(Array.from(e.target.files || []));
        }}
        id="file-upload"
        className="invisible hidden"
        accept="image/png, image/jpeg"
      />
    </div>
  );
};

const initialParams = {
  title: "",
  isbn: "",
  description: "",
  price: "0",
  pictures: [],
};

function Create() {
  const [params, setParams] = useState<Params>(initialParams);

  const [request, setRequest] = useState<ClientRequestState<Book>>({
    data: undefined,
    loading: false,
    error: undefined,
  });

  const setPictures = (files: File[]) => {
    const error = "Please select at most 3 files";
    if (files.length > 3) {
      setRequest({ error, loading: false });
      return;
    }

    if (request.error === error)
      setRequest({ error: undefined, loading: false });

    setParams((old) => ({
      ...old,
      pictures: files,
    }));
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (request.loading || request.data) return;

    const { title, isbn, description, price, pictures } = params;
    if (!title || !isbn || !description || !price || pictures.length <= 0) {
      setRequest({
        loading: false,
        error: "Please fill in all the fields",
      });
      return;
    }

    setRequest({
      data: undefined,
      loading: true,
    });

    try {
      // const images = await uploadImages(pictures);
      const book = await createBook({
        title,
        isbn,
        description,
        price,
        pictures,
      });

      setRequest({
        data: book,
        loading: false,
      });

      setParams(initialParams);
    } catch (err: any) {
      console.log(err);
      let error = "";
      if (err.response?.data) {
        error = err.response.data.msg as string;
      } else {
        error = err.message;
      }
      setRequest({
        data: undefined,
        loading: false,
        error,
      });
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (request.data) {
      router.push(`/books/${request.data.id}`);
    }
  }, [request, router]);

  return (
    <>
      <MetaDecorator
        title="Create a listing"
        description="BorrowMyBooks is a one-stop application for finding and listing IB-MYP and IBDP books. BorrowMyBooks simplifies the entire process and streamlines communication so you can find and list books faster."
      />

      {request.data && (
        <p className="text-blue mb-3 text-center">
          Listing successfully created!
        </p>
      )}
      {request.loading && <Loading />}
      {request.error && (
        <p className="text-orange mb-3 text-center">{request.error}</p>
      )}
      <div className="container-custom block md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:h-full">
        <div className="hidden md:block max-h-[90%]">
          <FileUpload files={params.pictures} setFiles={setPictures} />
        </div>
        <form
          className="flex flex-col py-6 md:py-2 lg:pt-12 lg:pb-24 lg:col-span-2"
          onSubmit={onSubmit}
        >
          <div className="mb-10 md:hidden md:mb-0 max-h-64">
            <FileUpload files={params.pictures} setFiles={setPictures} />
          </div>
          {/* <br /> */}

          {/* <div className="md:block"> */}
          <InputGroup
            type="text"
            className="!mt-0"
            label="Title"
            placeholder="Enter the title of the book"
            value={params.title}
            setValue={(val) => setParams((old) => ({ ...old, title: val }))}
          />
          {/* </div> */}

          <InputGroup
            type="text"
            label="ISBN"
            placeholder="Enter the ISBN of the book"
            value={params.isbn}
            setValue={(val) => setParams((old) => ({ ...old, isbn: val }))}
          />

          <InputGroup
            type="number"
            label="Price"
            placeholder="Enter the price of the book"
            value={params.price}
            setValue={(val) =>
              setParams((old) => ({ ...old, price: val.toString() }))
            }
          />

          <TextAreaInputGroup
            label="Description"
            placeholder="Enter the description of the book"
            value={params.description}
            setValue={(val) =>
              setParams((old) => ({ ...old, description: val }))
            }
          />

          <PrimaryButton className="mt-6">Create Listing</PrimaryButton>

          {/* <div className="md:hidden">
          <MobileFilter data={params} setData={setParams} />
        </div>
        <div className="hidden md:block">
          <Filter data={params} setData={setParams} />
        </div>

        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <BookList params={searchParams} />
        </div> */}
        </form>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <ProtectedPage>
      <Create />
    </ProtectedPage>
  );
}
