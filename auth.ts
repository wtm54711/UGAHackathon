"use client";

import { mockAuth } from "./auth-mock";

export async function getUser() {
  const result = await mockAuth.getUser();
  return result;
}
