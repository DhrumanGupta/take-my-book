import type { NextPage } from "next";
// import Image from "next/image";
import Link from "next/link";
import { Dispatch, FC } from "react";
// import Card from "src/components/Card";
// import InfoCard from "components/home/InfoCard";
// import Message from "components/icons/Message";
// import Search from "components/icons/Search";
// import Verified from "components/icons/Verified";
import { useReducer } from "react";
import produce from "immer";
import MetaDecorator from "components/MetaDecorator";
import InputGroup from "components/InputGroup";
import PasswordInputGroup from "components/PasswordInputGroup";
import { PrimaryButton } from "components/Button";

const initialState: State = {
  state: "signup",
  data: {
    name: "",
    password: "",
    email: "",
  },
  hidden: true,
};

type ActionKind =
  | "changeSignUp"
  | "toggleHidden"
  | "setEmail"
  | "setPassword"
  | "setName";

type Action = {
  type: ActionKind;
  payload?: any;
};

type State = {
  state: "login" | "signup";
  data: {
    name: string;
    password: string;
    email: string;
  };
  hidden: boolean;
};

const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;

  switch (type) {
    case "changeSignUp":
      return produce(state, (draft) => {
        draft.state = draft.state === "login" ? "signup" : "login";
      });
    case "toggleHidden":
      return produce(state, (draft) => {
        draft.hidden = !state.hidden;
      });
    case "setEmail":
      return produce(state, (draft) => {
        draft.data.email = payload;
      });
    case "setPassword":
      return produce(state, (draft) => {
        draft.data.password = payload;
      });
    case "setName":
      return produce(state, (draft) => {
        draft.data.name = payload;
      });
    default:
      return state;
  }
};

type Props = {
  children?: React.ReactNode;
  func: () => any;
};

const Toggle: FC<Props> = ({ children, func }) => {
  return (
    <a href="#" onClick={() => func()}>
      {children}
    </a>
  );
};

const Home: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggle = () => {
    console.log("clicked");
    dispatch({ type: "changeSignUp" });
  };

  return (
    <>
      <MetaDecorator
        title="Sign Up / Login"
        description="BorrowMyBooks is a one-stop application for finding and listing IB-MYP and IBDP books. BorrowMyBooks simplifies the entire process and streamlines communication so you can find and list books faster."
      />
      <main className="container-custom flex flex-col h-[85vh] items justify">
        <div className="flex flex-col justify-center container-custom flex-grow">
          <h1>Create an account</h1>
          {state.state === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <Toggle func={toggle}>Sign Up.</Toggle>
            </p>
          ) : (
            <p>
              Already have an account? <Toggle func={toggle}>Sign In.</Toggle>
            </p>
          )}
          <form className="flex flex-col mt-4">
            {state.state === "signup" && (
              <InputGroup
                label="Name"
                value={state.data.name}
                setValue={(value) =>
                  dispatch({ type: "setName", payload: value })
                }
              />
            )}

            <InputGroup
              label="Email"
              type="email"
              value={state.data.email}
              setValue={(value) =>
                dispatch({ type: "setEmail", payload: value })
              }
            />

            <PasswordInputGroup
              label="Password"
              hidden={state.hidden}
              toggleHidden={() => dispatch({ type: "toggleHidden" })}
              value={state.data.password}
              setValue={(value) =>
                dispatch({ type: "setPassword", payload: value })
              }
            />

            <PrimaryButton className="mt-6">
              {state.state === "login" ? "Login" : "Sign Up"}
            </PrimaryButton>
          </form>
          {/* <h1 className="mb-1">Don&apos;t buy, borrow</h1>
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
          /> */}
        </div>
      </main>
    </>
  );
};

export default Home;
