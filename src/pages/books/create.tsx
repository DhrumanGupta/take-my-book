import clsx from "clsx";
import { PrimaryButton } from "components/Button";
import Plus from "components/icons/Plus";
import InputGroup from "components/InputGroup";
import MetaDecorator from "components/MetaDecorator";
import TextAreaInputGroup from "components/TextAreaInputGroup";
import { FormEventHandler, useState } from "react";
import { Book } from "types/DTOs";
import { BookCreateProps, ClientRequestState } from "types/requests";
import { createBook, uploadImages } from "lib/apis/bookApi";

interface Params extends Omit<BookCreateProps, "pictures"> {
  pictures: File[];
}

interface FileUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles }) => {
  return (
    <div className="bg-gray-light rounded-md text-center w-full">
      {files.length > 0 && (
        <span className="p-4">
          {files.map((file) => (
            <p key={file.name}>{file.name}</p>
          ))}
        </span>
      )}
      <label
        htmlFor="file-upload"
        className={clsx(
          "hover:cursor-pointer block font-bold p-4",
          files.length > 0 ? "pt-12" : "pt-20"
        )}
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

function Create() {
  const [params, setParams] = useState<Params>({
    title: "",
    isbn: "",
    description: "",
    price: 0,
    pictures: [],
  });

  const [request, setRequest] = useState<ClientRequestState<Book>>({
    data: undefined,
    loading: false,
    error: undefined,
  });

  const setPictures = (files: File[]) => {
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
      return;
    }

    setRequest({
      data: undefined,
      loading: true,
    });

    try {
      const images = await uploadImages(pictures);
      const book = await createBook({
        title,
        isbn,
        description,
        price,
        pictures: images,
      });

      setRequest({
        data: book,
        loading: false,
      });
    } catch (err) {
      setRequest({
        data: undefined,
        loading: false,
        error: err as string,
      });
    }

    console.log(params);
  };

  console.log(params.pictures);

  return (
    <>
      <MetaDecorator
        title="Create a listing"
        description="BorrowMyBooks is a one-stop application for finding and listing IB-MYP and IBDP books. BorrowMyBooks simplifies the entire process and streamlines communication so you can find and list books faster."
      />
      <form
        className="container-custom grid grid-cols-1 md:grid-cols-3 md:gap-8 py-6 md:py-2 lg:pt-12 lg:pb-24"
        onSubmit={onSubmit}
      >
        {request.data && (
          <p className="text-blue mb-3 text-center">
            Listing successfully created!
          </p>
        )}
        <FileUpload files={params.pictures} setFiles={setPictures} />
        <br />

        <InputGroup
          type="text"
          label="Title"
          placeholder="Enter the title of the book"
          value={params.title}
          setValue={(val) => setParams((old) => ({ ...old, title: val }))}
        />

        <InputGroup
          type="text"
          label="ISBN"
          placeholder="Enter the ISBN of the book"
          value={params.isbn}
          setValue={(val) => setParams((old) => ({ ...old, isbn: val }))}
        />

        <InputGroup
          type="text"
          label="Price"
          placeholder="Enter the price of the book"
          value={params.price}
          setValue={(val) => setParams((old) => ({ ...old, price: val }))}
        />

        <TextAreaInputGroup
          label="Description"
          placeholder="Enter the description of the book"
          value={params.description}
          setValue={(val) => setParams((old) => ({ ...old, description: val }))}
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
    </>
  );
}

Create.isProtected = true;

export default Create;
