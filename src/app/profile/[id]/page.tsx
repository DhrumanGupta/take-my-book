"use client";

import { authRoutes, bookRoutes } from "data/routes";
import { getUserById, updatePhoto as updateUserPhoto } from "lib/apis/userApi";
import { Book, User } from "types/DTOs";
import useSWR, { useSWRConfig } from "swr";
import Loading from "components/Loading";
import Image from "next/image";
import { PrimaryButton } from "components/Button";
import Link from "next/link";
import useUser from "hooks/useUser";
import { getBooksForUser } from "lib/apis/bookApi";
import BookListingCard from "components/books/BookListingCard";
import { Fragment, useRef } from "react";

const Profile = ({ user }: { user: User }) => {
  const { user: currentUser } = useUser();

  const { mutate } = useSWRConfig();

  const inputFile = useRef<HTMLInputElement>(null);

  const onUploadClick = () => {
    inputFile.current?.click();
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files || files.length < 0) {
      return;
    }

    const file = files[0];

    updateUserPhoto(file).then((resp) => {
      mutate(authRoutes.userById(user.id), resp, {
        revalidate: false,
      });
    });
  };

  return (
    <div className="rounded p-5 bg-gray-light py-8 flex flex-col justify-center">
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={onFileUpload}
        multiple={false}
      />
      <div className="mx-auto rounded-full overflow-hidden w-32 h-32">
        <div className="relative h-full w-full">
          <Image
            fill={true}
            className={"object-cover"}
            src={user.photoUrl ? user.photoUrl : "/images/unknown_person.jpg"}
            alt={`Photo of ${user.name}`}
          />
        </div>
      </div>
      <p className="text-center my-3 text-lg font-semibold">{user.name}</p>
      {user.id === currentUser?.id ? (
        <PrimaryButton onClick={onUploadClick} className="w-full">
          Change profile picture
        </PrimaryButton>
      ) : (
        <Link href={`/chat/${user.id}`}>
          <PrimaryButton className="w-full">Send Message</PrimaryButton>
        </Link>
      )}
    </div>
  );
};

const BookList = ({ books }: { books: Book[] }) => {
  return (
    <Fragment>
      {books.map((book) => (
        <BookListingCard {...book} key={book.id} />
      ))}
    </Fragment>
  );
};

export default function Page({ params: { id } }: { params: { id: string } }) {
  const {
    data: userData,
    error: userError,
    isLoading: isUserLoading,
    mutate: mutateUser,
  } = useSWR(authRoutes.userById(id), async () => await getUserById(id));

  const {
    data: bookData,
    error: bookError,
    isLoading: isBookLoading,
  } = useSWR(bookRoutes.getForUser(id), async () => await getBooksForUser(id));

  if (isUserLoading && isBookLoading) {
    return <Loading />;
  }

  if (userError) {
    return <div>user not found</div>;
  }

  return (
    <div className="grid md:flex-grow m-4 grid-cols-1 lg:grid-cols-3">
      {userData && <Profile user={userData} mutate={mutateUser} />}

      <div className="lg:col-span-2 px-8">
        <h2>Listings</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookData && <BookList books={bookData} />}
        </div>
      </div>
      {/* {JSON.stringify(data)} */}
    </div>
  );
}
