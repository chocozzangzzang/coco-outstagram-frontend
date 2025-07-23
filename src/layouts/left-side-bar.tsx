"use client"

import { Button } from "@/components/ui/button";
import { CompassIcon, HeartIcon, HouseIcon, LogOutIcon, MessageCircleIcon, PlusSquareIcon, SearchIcon, User2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LeftSideBar = () => {

    const router = useRouter();
    const logout = () => {
        localStorage.clear();
        router.push("/auth/loginPage");
    }

    return (
        <>
            <Link href="/" className="text-2xl font-bold mb-2 md:mb-4 text-purple-600 no-underline" >Outstagram</Link>
            <nav className="flex flex-col gap-2 md:gap-8">
                <Link href="/" className="no-underline flex gap-3 text-lg items-center"><HouseIcon /><span>Home</span></Link>
                <Link href="/userSearch" className="no-underline flex gap-3 text-lg items-center"><SearchIcon />Search User</Link>
                <Link href="/feedSearch" className="no-underline flex gap-3 text-lg items-center"><CompassIcon />Search Feed</Link>
                <Link href="/message" className="no-underline flex gap-3 text-lg items-center"><MessageCircleIcon />Messages</Link>
                <Link href="/notification" className="no-underline flex gap-3 text-lg items-center"><HeartIcon />Notification</Link>
                <Link href="/createFeed" className="no-underline flex gap-3 text-lg items-center"><PlusSquareIcon />Create Feed</Link>
                <Link href="/profile" className="no-underline flex gap-3 text-lg items-center"><User2Icon />Profile</Link>
            </nav>
            <div className="w-full">
                <Button
                    onClick={logout} 
                    variant="ghost" className="flex gap-3 text-lg justify-start !p-2">
                    <LogOutIcon />Logout
                </Button>
            </div>
        </>
    )
};

export default LeftSideBar;