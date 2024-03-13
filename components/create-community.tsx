import { useCreateCommunityMutation } from "@/lib/mutations/useCreateCommunityMutation";
import { useRouter } from "next/router";
import { CreateCommunityForm } from "./forms/create-community-form";
import React from "react";
import { useCreateCommunityForm } from "@/lib/useCreateCommunityForm";
import Button from "./ui/button";
import { Container } from "./layout/container";
import { LayoutPane } from "./layout/content";

export function CreateCommunity() {
  const router = useRouter();
  const { mutateAsync } = useCreateCommunityMutation();

  // async function onSubmit(data: Form) {
  //   await mutateAsync({
  //     img: profileImage,
  //     tags: Object.values(selected),
  //     ...data,
  //   });
  //   router.push("/");
  // }

  return (
    // <div className="flex min-h-screen  flex-col items-center py-16 bg-slate-50 justify-center mx-auto">
    //   <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[385px]">
    //     <div className="flex flex-col space-y-8 ">
    //       <h1 className="text-2xl font-semibold text-center">
    //         Create Your Community
    //       </h1>
    //       <div className="lg:max-w-2xl">
    //         <CreateCommunityForm
    //           onSubmit={onSubmit}
    //           profileImage={profileImage}
    //           selected={selected}
    //           setProfileImage={setProfileImage}
    //           setSelected={setSelected}
    //         >
    //           <div className="flex items-center justify-center">
    //             <Button size="sm" type="submit" className="text-center">
    //               Create Community
    //             </Button>
    //           </div>
    //         </CreateCommunityForm>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <Container>
      <LayoutPane>
        <div className="mx-auto lg:max-w-2xl">
          <div className="px-4 space-y-2 my-8">
            <h1 className="text-lg font-semibold text-center">
              Create your community
            </h1>
          </div>
          <CreateCommunityForm />
        </div>
      </LayoutPane>
    </Container>
  );
}
