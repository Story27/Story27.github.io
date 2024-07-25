import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twpFactorToken = await db.twoFactorToken.findUnique({
      where: {
        token,
      },
    });
    return twpFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twpFactorToken = await db.twoFactorToken.findFirst({
      where: {
        email,
      },
    });
    return twpFactorToken;
  } catch {
    return null;
  }
};
