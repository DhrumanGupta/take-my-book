import type {NextPage} from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <main className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
      <h1 className="font-extrabold text-7xl md:text-8xl border-1 border-orange text-center">
        404
      </h1>
      <p className="text-center md:text-lg max-w-sm lg:max-w-lg">
        Uh oh! The page you were looking was not found. <br />
        <Link href="/"> Go Home</Link>
      </p>
    </main>
  )
}

export default Home
