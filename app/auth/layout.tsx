import Image from "next/image";
import bg from "./../../public/bg.jpg";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <Image
        src={bg}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="fixed inset-0 -z-10"
        style={{ backgroundRepeat: "repeat" }}
      />
      {children}
    </div>
  );
};
export default AuthLayout;
