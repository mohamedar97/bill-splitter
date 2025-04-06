"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { signOut } from "@/lib/authClient";
import { useRouter } from "next/navigation";

const LogoutLink = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        onClick={() => {
          signOut();
          router.replace("/login");
        }}
        className="inline-flex h-10 items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Button>
    </div>
  );
};

export default LogoutLink;
