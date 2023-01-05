import MetaDecorator from "components/MetaDecorator";
import { useState } from "react";
import { BookCreateProps } from "types/requests";

interface Params extends Omit<BookCreateProps, "pictures"> {
  pictures: File[];
}

interface FileUploadProps {
  setFiles: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ setFiles }) => {
  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => {
          setFiles(Array.from(e.target.files || []));
        }}
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

  const setPictures = (files: File[]) => {
    setParams((old) => ({
      ...old,
      pictures: files,
    }));
  };

  console.log(params.pictures);

  return (
    <>
      <MetaDecorator
        title="Create a listing"
        description="BorrowMyBooks is a one-stop application for finding and listing IB-MYP and IBDP books. BorrowMyBooks simplifies the entire process and streamlines communication so you can find and list books faster."
      />
      <main className="container-custom grid grid-cols-1 md:grid-cols-3 gap-8 py-6 md:py-2 lg:pt-12 lg:pb-24">
        <FileUpload setFiles={setPictures} />
        {/* <div className="md:hidden">
          <MobileFilter data={params} setData={setParams} />
        </div>
        <div className="hidden md:block">
          <Filter data={params} setData={setParams} />
        </div>

        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <BookList params={searchParams} />
        </div> */}
      </main>
    </>
  );
}

export default Create;
