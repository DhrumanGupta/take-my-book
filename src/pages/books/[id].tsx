import { GetServerSideProps, NextPage } from "next";
import { Book, User } from "types/DTOs";
import PictureViewer from "components/books/PictureViewer";
import MetaDecorator from "components/MetaDecorator";
import { getBook as getBookFromDb } from "lib/repos/book";
import { getUser as getUserFromDb } from "lib/repos/user";
import { PrimaryButton } from "components/Button";
import Link from "next/link";
import useUser from "hooks/useUser";
import Loading from "components/Loading";

type PageProps = {
  // id: string;
  book: Book;
  user: User;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const id = context.query?.id as string | undefined;

  if (!id) {
    return {
      notFound: true,
    };
  }

  const book = await getBookFromDb({ id });
  if (!book) {
    return {
      notFound: true,
    };
  }

  const user = await getUserFromDb({ id: book.listedById });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return { props: { book, user } };
};

const BookPage: NextPage<PageProps> = ({ book, user }) => {
  const { user: currentUser, loading, loggedIn } = useUser();

  // if (loading || !book) {
  //   return <Loading />;
  // }

  return (
    <>
      <MetaDecorator description={book?.description || "Loading..."} />
      <div className="mx-6 my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <PictureViewer pictures={book ? book.pictures : ["/placeholder.png"]} />
        <div className="lg:col-span-2">
          <h2 className="mt-2">{book ? book.title : "Title"}</h2>

          <p className="mb-2">Rs. {book ? book.price : "-"}</p>

          {book && currentUser?.id != user.id && (
            <Link href={loggedIn ? `/chat/${user.id}` : "/signup"}>
              <PrimaryButton className="w-full mb-2">
                {loggedIn ? "Message Seller" : "Login to Message Seller"}
              </PrimaryButton>
            </Link>
          )}

          {/* <hr className="my-1 text-gray-dark" /> */}
          {book &&
            book.description.split("\n").map((text, index) => (
              <p key={index} className="mb-4 break-words">
                {text}
              </p>
            ))}

          <p className="font-bold mt-3">Technical Details</p>
          <p>ISBN: {book ? book.isbn : "1234567890"}</p>
          {/* <p></p> */}
          <br />

          <p className="font-bold">Listed By</p>
          <p>{user ? user.name : "Lorem Ipsum"}</p>
        </div>
      </div>
    </>
  );
};

export default BookPage;
