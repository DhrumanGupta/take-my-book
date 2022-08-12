import { PrismaClient, User } from "@prisma/client";
import { generateHashWithSalt } from "../src/lib/crypto";

const prisma = new PrismaClient();

const createUser = async ({
  password,
  email,
  name,
}: {
  password: string;
  email: string;
  name: string;
}) => {
  const { salt, hash } = generateHashWithSalt(password);
  return await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      salt,
      passwordHash: hash,
    },
  });
};

async function main() {
  const user = await createUser({
    email: "test@gmail.com",
    password: "test1234",
    name: "Test Person",
  });

  const books: Array<{
    title: string;
    description: string;
    price: number;
    pictures: string[];
    listedBy: User;
  }> = [
    {
      title: "IB MYP Physics",
      description: "IB MYP Physics for years 4-5, in good condition",
      price: 0,
      listedBy: user,
      pictures: [
        "https://images-na.ssl-images-amazon.com/images/I/51XxRZcpMNL.jpg",
      ],
    },
    {
      title: "IB MYP Chemistry",
      description: "IB MYP Chemistry for years 4-5, in good condition",
      price: 0,
      listedBy: user,
      pictures: [
        "https://images-na.ssl-images-amazon.com/images/I/81KzVWyEWqL.jpg",
      ],
    },
    {
      title: "IB MYP Biology",
      description: "IB MYP Biology for years 4-5, in good condition",
      price: 1200,
      listedBy: user,
      pictures: [
        "https://images-na.ssl-images-amazon.com/images/I/81KzVWyEWqL.jpg",
      ],
    },
    {
      title: "IB DP Computer Science",
      description: "IB DP Computer Science, in good condition",
      price: 1700,
      listedBy: user,
      pictures: [
        "https://images-na.ssl-images-amazon.com/images/I/81KzVWyEWqL.jpg",
      ],
    },
    {
      title: "IB DP Mathematics AA",
      description:
        "IB DP Mathematics AA, generally in good condition with some wear and tear",
      price: 1700,
      listedBy: user,
      pictures: [
        "https://images-na.ssl-images-amazon.com/images/I/81KzVWyEWqL.jpg",
      ],
    },
    {
      title: "IB DP Mathematics AA HL Extension",
      description:
        "IB DP Mathematics AA HL Extension, generally in good condition with some wear and tear",
      price: 1700,
      listedBy: user,
      pictures: [
        "https://images-na.ssl-images-amazon.com/images/I/81KzVWyEWqL.jpg",
      ],
    },
  ];

  await Promise.all(
    books.map((book) =>
      prisma.book.create({
        data: {
          title: book.title,
          isbn: Math.random().toString(36).slice(2).toUpperCase(),
          description: book.description,
          price: book.price,
          listedById: book.listedBy.id,
          featuredPicture: book.pictures[0],
          pictures: {
            create: book.pictures.map((url) => ({ url })),
          },
        },
      })
    )
  );

  await Promise.all(
    books.map((book) =>
      prisma.book.create({
        data: {
          title: book.title,
          isbn: Math.random().toString(36).slice(2).toUpperCase(),
          description: book.description,
          price: book.price,
          listedById: book.listedBy.id,
          featuredPicture: book.pictures[0],
          pictures: {
            create: book.pictures.map((url) => ({ url })),
          },
        },
      })
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });