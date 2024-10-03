import Image from "next/image";

type UserInfoProps = {
  profile: {
    profileImage: string;
    firstName: string;
  };
};

const UserInfo = ({ profile: { firstName, profileImage } }: UserInfoProps) => {
  return (
    <article className="grid grid-cols-[auto,1fr] gap-4 mt-4">
      <Image
        src={profileImage}
        alt={firstName}
        width={50}
        height={50}
        className="rounded size-12 object-cover"
      />

      <div>
        <p>
          Hosted By <span className="font-bold"> {firstName}</span>
        </p>
        <p className="text-muted-foreground font-light">
          Superhost &middot; Joined in 2021
        </p>
      </div>
    </article>
  );
};
export default UserInfo;
