"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const Page = () => {
    
    const router = useRouter();
    const [ nowUser, setNowUser ] = useState("");

    useEffect(() => {
        const nowUsername = localStorage.getItem("username");
        if(!nowUsername) {
            alert("로그인되지 않은 사용자입니다!!");
            router.push("/auth/loginPage");
        } else {
            setNowUser(nowUsername);
        }
    }, [])
    
    return (
        nowUser && (
            <div className="flex flex-col items-center h-full gap-4">
                <div className="h-[20%] w-[90%] flex justify-between mt-20">
                    <div className="w-[25%] flex justify-center items-center">
                        <Avatar className="w-32 h-32">
                            <AvatarImage src="https://github.com/shadcn.png"/>
                            <AvatarFallback>UserProfile</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="w-[70%] flex flex-col p-3 gap-4">
                        <div className="flex gap-4">
                            <p>{nowUser}</p>
                            <p>## EDIT PROFILE ##</p>
                        </div>
                        <div className="flex justify-between">
                            <p>POSTS 24</p>
                            <p>FOLLOWING 35</p>
                            <p>FOLLOWERS 15</p>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    POSTS AREA
                </div>
            </div>
        )
    )
}

export default Page;