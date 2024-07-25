import { useSession } from "next-auth/react";

export const UseCurrentUser = () => {
  const session = useSession({ required: true });

  return session.data?.user;
};
