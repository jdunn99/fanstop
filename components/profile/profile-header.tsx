import { Community, Socials as ProfileSocials } from "@/lib/api/validators";
import { Socials } from "../socials";
import { ProfileImage } from "../ui/profile-image";
import { useCommunitySocialsQuery } from "@/lib/queries/useCommunitySocialsQuery";

interface ProfileHeaderProps {
  community: Community;
  socials?: ProfileSocials;
}

export function ProfileHeader({ community }: ProfileHeaderProps) {
  const { data: socials } = useCommunitySocialsQuery(community.slug);

  return (
    <div className="w-full space-y-8 mx-auto max-w-screen-md text-center">
      <div className="flex justify-end"></div>
      {community.image ? <ProfileImage src={community.image} /> : null}
      <h1 className="text-center text-4xl font-bold  text-slate-800 dark:text-slate-200">
        {community.name}
      </h1>
      <p className="w-full text-center  font-regular text-slate-500 leading-loose dark:text-slate-400">
        {community.description}
      </p>
      <div className="flex justify-center">
        <div className="dark:text-slate-300 flex items-center gap-2 font-semibold text-slate-600 text-sm sm:flex-row flex-col ">
          <p>{community._count.subscribers} subscribers</p>
          <p>{community._count.posts} posts</p>
        </div>
      </div>
      {typeof socials !== "undefined" ? <Socials {...socials} /> : null}
    </div>
  );
}
