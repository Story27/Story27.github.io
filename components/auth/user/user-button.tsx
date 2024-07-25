"use client";

import { FaUser } from "react-icons/fa";
import { ExitIcon, GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { UseCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "../logout/logout-button";

export const UserButton = () => {
  const user = UseCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-slate-700">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem asChild>
          <LogoutButton>
            <a className="flex items-center">
              <ExitIcon className="h-4 w-4 mr-2" />
              Logout
            </a>
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
