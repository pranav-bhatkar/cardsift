"use server";

import { EmploymentType } from "@cc/generated/prisma";
import { prisma } from "@cc/lib/prisma";

export async function signupAction({
  userId,
  age,
  creditScore,
  employment,
  income,
  existingRelationship,
}: {
  userId: string;
  employment: EmploymentType;
  income: number;
  creditScore: number;
  age: number;
  existingRelationship: string[];
}) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      employment: employment,
      income: income,
      creditScore: creditScore,
      age: age,
    },
  });
  for (const relationship of existingRelationship) {
    await prisma.bank.update({
      where: { id: relationship },
      data: {
        eRUser: {
          connect: { id: userId },
        },
      },
    });
  }
  return {
    success: true,
    message: "User information updated successfully",
  };
}
