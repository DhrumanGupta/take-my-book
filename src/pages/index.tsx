import type {NextPage} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Card from '../components/Card'
import InfoCard from '../components/home/InfoCard'
import Message from '../components/icons/Message'
import Search from '../components/icons/Search'
import Verified from '../components/icons/Verified'
import MetaDecorator from '../components/MetaDecorator'

const Home: NextPage = () => {
  return (
    <>
      <MetaDecorator description="BorrowMyBooks is a one-stop application for finding and listing IB-MYP and IBDP books. BorrowMyBooks simplifies the entire process and streamlines communication so you can find and list books faster." />
      <main className="container-custom grid grid-cols-1 pt-6 md:py-2 lg:pt-12 lg:pb-24 md:grid-cols-2">
        <div className="flex flex-col align-center justify-center">
          <h1 className="mb-1">Don&apos;t buy, borrow</h1>
          <p className="md:max-w-[90%] lg:max-w-[80%]">
            Buying new books every year is expensive and wasteful. BorrowMyBooks
            allows you to find and coordinate book pickups from other students.
            Get started by <Link href="signup">signing up</Link>, or browsing
            the <Link href="listings">current listings</Link>.
          </p>
        </div>
        <div className="w-full h-96 md:h-112 relative">
          <Image
            src="/images/index/books.png"
            alt="IB Books"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </main>
      <section className="gray-section">
        <div className="container-custom py-10 md:py-16">
          <h1>What is BorrowMyBooks?</h1>
          <p className="md:max-w-xl lg:max-w-2xl">
            BorrowMyBooks is a one-stop application for finding and listing
            IB-MYP and IBDP books. BorrowMyBooks simplifies the entire process
            and streamlines communication so you can find and list books faster.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <InfoCard
              title="Verified Users"
              description="A badge to mark verified students in order to increase trust and
                confidence. Rest assured that any user with the badge has been
                verified as a student at Pathways."
              Icon={Verified}
            />

            <InfoCard
              title="Communication"
              description="A built-in chat service that helps accelarate the process.
                Message the listing's owner directly or create a group chat
                to discuss with others."
              Icon={Message}
            />

            <InfoCard
              title="Comprehensive Search"
              description="A simple, comprehensive tool to search listings efficiently,
                with filters like grades, subjects, and more. Need a book by its
                ISBN? Try out our ISBN filter!"
              Icon={Search}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
