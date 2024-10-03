import { GiBarracksTent } from "react-icons/gi";
import { Button } from "../ui/button";
import Link from "next/link";

const Logo = () => {
  return (
    <Button size="icon" asChild>
      <Link href="/">
        <GiBarracksTent className="size-6" />
      </Link>
    </Button>
  );
};
export default Logo;
