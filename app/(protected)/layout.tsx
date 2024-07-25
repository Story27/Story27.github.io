import Image from "next/image";
import { Navbar } from "./_components/navbar";
import bg from "./../../public/bg.jpg";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center">
      <Image
        src={bg}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="fixed inset-0 -z-10"
        style={{ backgroundRepeat: "repeat" }}
      />
      <div className="relative w-full"></div>
      <Navbar />
      {children}
    </div>
  );
};
export default ProtectedLayout;
