"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


const Page = () => {
    
    const router = useRouter();
    const [ nowUser, setNowUser ] = useState("");

    const [ userProfile, setUserProfile ] = useState<{
        id: number; 
        username: string; 
        email: string; 
        role: string; 
        profilePictureName: string;
        profilePictureUrl: string; 
        createdAt: string;}>();

    const getProfile = async(username : string | null) => {
        await fetch("http://localhost:8080/api/user/profile", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username : username})
        }).then(async (result) => {
            const data = await result.json();
            setUserProfile(data);
        })
    }

    useEffect(() => {
        const nowUsername = localStorage.getItem("username");
        if(!nowUsername) {
            alert("로그인되지 않은 사용자입니다!!");
            router.push("/auth/loginPage");
        } else {
            getProfile(nowUsername);
        }
    }, [])
    
    return (
        userProfile && (
            <div className="flex flex-col items-center h-full gap-4">
                <div className="h-[20%] flex justify-between mt-20">
                    <div className="w-[25%] flex justify-center items-center">
                        <Avatar className="w-32 h-32">
                            <AvatarImage src={userProfile?.profilePictureUrl || "https://github.com/shadcn.png"}/>
                            <AvatarFallback>UserProfile</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="w-[70%] flex flex-col p-3 gap-4">
                        <div className="flex gap-10 items-center">
                            <p>{userProfile?.username}</p>
                            <Button
                                onClick={() => router.push("/profile/edit")}
                                variant="outline"
                                className="bg-blue-500 text-white"
                            >
                                Edit Profile
                            </Button>
                        </div>
                        <div className="w-full flex justify-between">
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