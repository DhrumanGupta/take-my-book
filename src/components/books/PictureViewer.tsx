import { FC, Fragment, useState } from "react";
import Image from "next/image";

type PictureViewerProps = {
  pictures: string[];
};

const PictureViewer: FC<PictureViewerProps> = ({ pictures }) => {
  const [picture, setPicture] = useState(0);

  const nextPicture = () => {
    setPicture((old) => (old + 1) % pictures.length);
  };

  const previousPicture = () => {
    setPicture((old) => (old - 1 + pictures.length) % pictures.length);
  };

  return (
    <span>
      <div className="h-full grid grid-cols-10">
        <button
          onClick={previousPicture}
          className={"hover:bg-gray-light duration-150"}
        >
          &lt;
        </button>
        <span className="aspect-w-3 aspect-h-4 col-span-8 overflow-hidden">
          <Image
            // layout="fill"
            fill={true}
            alt="Book Picture"
            placeholder="blur"
            blurDataURL="/placeholder.png"
            className="object-cover"
            src={pictures[picture]}
          />
        </span>
        <button
          onClick={nextPicture}
          className={"hover:bg-gray-light duration-150"}
        >
          &gt;
        </button>
      </div>
    </span>
  );
};

export default PictureViewer;
