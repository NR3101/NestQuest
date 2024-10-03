import { fetchProfileImage } from "@/utils/actions";
import { LuUser2 } from "react-icons/lu";

const UserIcon = async () => {
  const profileImage = await fetchProfileImage();

  if (profileImage) {
    return (
      <img src={profileImage} className="rounded-full object-cover size-6" />
    );
  }
  return <LuUser2 className="size-6 bg-primary rounded-full text-white" />;
};

export default UserIcon;
