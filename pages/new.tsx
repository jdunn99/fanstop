import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { CreateInput } from "@/components/create-input";
import { Container, Header } from "@/components/layout";

export default function newCommunityPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4"></div>
      </header>
      <div className="max-w-screen-xl  flex-1 gap-12 mx-auto w-full  ">
        <main className="flex w-full flex-1 flex-col overflow-hidden pt-8">
          <Container>
            <Header heading="Create a new community." />
            <p className="text-lg font-medium text-slate-500">
              To create a new community, simply fill out some information below.
            </p>
            <div className="mx-auto flex bg-slate-50 p-8 w-full flex-col justify-center space-y-6 sm:w-[460px]">
              <div className="flex flex-col space-y-8 text-center">
                <CreateInput />
              </div>
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  if (session === null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
