"use client"; // this is a client component

import Navbar from "components/Navbar";
import { ProtectedPage, AnonymousPage } from "components/Auth";
import { SocketProvider } from "lib/SocketContext";

function MyApp({ children }: { children: React.ReactNode }) {
  //   // @ts-ignore
  //   const isProtected = Component.isProtected;
  //   // @ts-ignore
  //   const isAnonymous = Component.isAnonymous;

  //   if (isProtected && isAnonymous) {
  //     throw new Error(
  //       `The component ${Component.name} is anonymous and protected as the same time. Please choose either one`
  //     );
  //   }

  return (
    <SocketProvider>
      <html>
        <body>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            {children}
          </div>
        </body>
      </html>
    </SocketProvider>
  );
}

export default MyApp;
