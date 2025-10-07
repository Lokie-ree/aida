"use client";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();

  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
    >
      Sign out
    </Button>
  );
}
