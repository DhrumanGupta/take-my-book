import React, { useEffect, FC } from "react";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import Hamburger from "./icons/Hamburger";
import Close from "./icons/Close";
import {
  Menu,
  MenuPopover,
  MenuButton,
  useMenuButtonContext,
  MenuLink,
  MenuItems,
} from "@reach/menu-button";
import useUser from "hooks/useUser";
import { PrimaryButton } from "./Button";
import { logout } from "lib/apis/userApi";
import { AnimatePresence, motion } from "framer-motion";

type Route = {
  path: string;
  label: string;
  primary?: boolean;
};

const ROUTES: Route[] = [
  {
    path: "/books",
    label: "Browse Listings",
  },
];

const ANONYMOUS_ROUTES: Route[] = [
  {
    path: "/signup",
    label: "Sign Up / Sign In",
    primary: true,
  },
];

const PROTECTED_ROUTES: Route[] = [
  {
    path: "/me",
    label: "My Account",
  },
  {
    path: "/chat",
    label: "Chat",
  },
  {
    path: "/books/create",
    label: "Create Listing",
    primary: true,
  },
];

const ADMIN_ROUTES: Route[] = [
  {
    path: "/logs",
    label: "Logs",
    primary: true,
  },
];

const NavItem = ({
  to,
  className,
  children,
}: {
  to: string;
  className: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={to}
      className={clsx(
        "px-5 py-3 rounded-xl font-semibold duration-100 !no-underline text-xs lg:text-sm",
        className
      )}
    >
      {/* <a
        className={clsx(
          "px-5 py-3 rounded-xl font-semibold duration-100 !no-underline text-xs lg:text-sm",
          className
        )}
      > */}
      {children}
      {/* </a> */}
    </Link>
  );
};

const MobileMenuList: FC = () => {
  const { isExpanded } = useMenuButtonContext();

  const { loggedIn, mutate, user } = useUser();

  useEffect(() => {
    if (isExpanded) {
      // don't use overflow-hidden, as that toggles the scrollbar and causes layout shift
      // document.body.classList.add("fixed");
      document.body.classList.add("overflow-y-scroll");
      // alternatively, get bounding box of the menu, and set body height to that.
      document.body.style.height = "100vh";
    } else {
      // document.body.classList.remove("fixed");
      document.body.classList.remove("overflow-y-scroll");
      document.body.style.removeProperty("height");
    }
  }, [isExpanded]);

  return (
    <AnimatePresence>
      {isExpanded ? (
        <MenuPopover
          position={(r) => ({
            top: `calc(${Number(r?.top) + Number(r?.height)}px + 1rem)`, // 1.75rem from navbar
            left: 0,
            bottom: 0,
            right: 0,
          })}
          style={{ display: "block" }}
          className="z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{
              duration: 0.15,
              ease: "linear",
            }}
            className="flex h-full flex-col overflow-y-scroll border-t border-gray-dark bg-white duration-500 w-screen"
          >
            <MenuItems className="flex flex-col b-0 !no-underline">
              <Link href={"/"} className={"no-underline"}>
                <MenuLink as={"p"} className="mobile-navbar-item">
                  Home
                </MenuLink>
              </Link>

              {ROUTES.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={"no-underline"}
                >
                  <MenuLink as={"p"} className="mobile-navbar-item">
                    {route.label}
                  </MenuLink>
                </Link>
              ))}

              {!loggedIn &&
                ANONYMOUS_ROUTES.map((route, index) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={"no-underline"}
                  >
                    <MenuLink as={"p"} className="mobile-navbar-item">
                      {route.label}
                    </MenuLink>
                  </Link>
                ))}

              {loggedIn &&
                PROTECTED_ROUTES.map((route, index) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={"no-underline"}
                  >
                    <MenuLink as={"p"} className="mobile-navbar-item">
                      {route.label}
                    </MenuLink>
                  </Link>
                ))}

              {loggedIn &&
                user!.role === "ADMIN" &&
                ADMIN_ROUTES.map((route, index) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={"no-underline"}
                  >
                    <MenuLink as={"p"} className="mobile-navbar-item">
                      {route.label}
                    </MenuLink>
                  </Link>
                ))}

              {loggedIn && (
                <PrimaryButton
                  className="text-sm font-semibold w-[90vw] mx-auto mt-5"
                  onClick={() => {
                    // @ts-ignore
                    logout().then(() => mutate(null));
                  }}
                >
                  Sign Out
                </PrimaryButton>
              )}

              {/* {LINKS.map((link) => (
                <Link href={link.to} key={link.to}>
                  <MenuLink as={"a"} className="">
                    {link.name}
                  </MenuLink>
                </Link>
              ))} */}
            </MenuItems>
          </motion.div>
        </MenuPopover>
      ) : null}
    </AnimatePresence>
  );
};

const MobileMenu: FC = () => (
  <Menu>
    {({ isExpanded }) => (
      <>
        <MenuButton>
          {isExpanded ? (
            <Close className="w-8 h-8 fill-primary" />
          ) : (
            // eslint-disable-next-line react/jsx-no-undef
            <Hamburger className="w-10 h-10 fill-primary" />
          )}
        </MenuButton>
        <MobileMenuList />
      </>
    )}
  </Menu>
);

const DesktopBar: FC = () => {
  const { loggedIn, mutate, user } = useUser();
  return (
    <div className="hidden lg:flex child:ml-3 first:m-0 justify-end py-5 pr-5">
      <Link href="/" className="!no-underline text-black block m-0 mr-auto">
        <div className="flex hover:cursor-pointer">
          <div className="w-10 m-0 relative h-10">
            <Image src="/logo.png" alt="Book logo" fill />
          </div>
          <h2 className="my-auto ml-2">Borrow My Books</h2>
        </div>
      </Link>
      {ROUTES.map((route, index) => (
        <NavItem
          key={route.path}
          to={route.path}
          className={
            route.primary
              ? "bg-orange !text-white hover:bg-darkOrange"
              : "bg-white border-2 border-black !text-black hover:bg-gray-light"
          }
        >
          {route.label}
        </NavItem>
      ))}
      {!loggedIn &&
        ANONYMOUS_ROUTES.map((route, index) => (
          <NavItem
            key={route.path}
            to={route.path}
            className={
              route.primary
                ? "bg-orange !text-white hover:bg-darkOrange"
                : "bg-white border-2 border-black !text-black hover:bg-gray-light"
            }
          >
            {route.label}
          </NavItem>
        ))}
      {loggedIn &&
        PROTECTED_ROUTES.map((route, index) => (
          <NavItem
            key={route.path}
            to={route.path}
            className={
              route.primary
                ? "bg-orange !text-white hover:bg-darkOrange"
                : "bg-white border-2 border-black !text-black hover:bg-gray-light"
            }
          >
            {route.label}
          </NavItem>
        ))}

      {loggedIn &&
        user.role === "ADMIN" &&
        ADMIN_ROUTES.map((route, index) => (
          <NavItem
            key={route.path}
            to={route.path}
            className={
              route.primary
                ? "bg-orange !text-white hover:bg-darkOrange"
                : "bg-white border-2 border-black !text-black hover:bg-gray-light"
            }
          >
            {route.label}
          </NavItem>
        ))}

      {loggedIn && (
        <PrimaryButton
          className="text-xs lg:text-sm font-semibold"
          onClick={() => {
            // @ts-ignore
            logout().then(() => mutate(null));
          }}
        >
          Sign Out
        </PrimaryButton>
      )}
    </div>
  );
};

export default function Navbar() {
  return (
    <header>
      <nav>
        <DesktopBar />
        <div className="flex items-end justify-end w-screen">
          <div className="flex items-end lg:hidden mt-4 mr-4">
            <MobileMenu />
          </div>
        </div>
      </nav>
    </header>
  );
}
