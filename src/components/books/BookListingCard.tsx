import { Book } from "types/DTOs";
import Image from "next/image";
import Link from "next/link";

function BookListingCard({
  title,
  isbn,
  id,
  description,
  price,
  featuredPicture,
  pictures,
  listedOn,
}: Book) {
  return (
    <Link href={`/books/${id}`} className="no-underline text-black">
      {/* <a className="no-underline text-black"> */}
      <div className="w-full">
        <div className="relative overflow-hidden aspect-w-3 aspect-h-4">
          <Image
            src={featuredPicture}
            alt={`Picture of ${title}`}
            layout="fill"
            className="object-cover"
          />
        </div>
      </div>

      <h3 className="mt-1 font-semibold text-lg">
        {title} <span className="text-gray-dark text-sm">({isbn})</span>
      </h3>
      <p>{price > 0 ? `Rs. ${price}` : "Free"}</p>
      {/* </a> */}
    </Link>
  );
}

export default BookListingCard;
