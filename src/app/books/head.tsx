import MetaDecorator from "components/MetaDecorator";

export default async function Head() {
  return (
    <MetaDecorator
      isHeadFile
      title="Book Listings"
      description="BorrowMyBooks is a one-stop application for finding and listing IB-MYP and IBDP books. BorrowMyBooks simplifies the entire process and streamlines communication so you can find and list books faster."
    />
  );
}
