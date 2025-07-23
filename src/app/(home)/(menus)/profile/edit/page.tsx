"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid"; 

const Page = () => {

    const router = useRouter();
    const [ profileImageUrl, setProfileImageUrl ] = useState("");
    const [ profileImage, setProfileImage ] = useState<File>();
    const [ uploadProgress, setUploadProgress ] = useState({});
    const [ error, setError ] = useState("");
    const [ uploadedUrl, setUploadedUrl ] = useState<{name: string, fileName: string, fileUrl: string}>();
    const [ userProfile, setUserProfile ] = useState<{
        id: number; 
        username: string; 
        email: string; 
        role: string; 
        profilePictureUrl: string; 
        createdAt: string;}>();
    const profileImageRef = useRef<HTMLInputElement>(null);
    
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

    const handleProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if(!files) return;
        else {
            const selectedImage = files[0];
            // console.log(selectedImage);
            if(selectedImage.size > 5 * 1024 * 1024) {
                alert("파일은 5MB를 넘을 수 없습니다!");
                event.target.value = "";
                return;
            } else {
                const imgUrl = URL.createObjectURL(selectedImage);
                setProfileImage(selectedImage);
                setProfileImageUrl(imgUrl);
            }
        }
    }

    const profileImageChange = async () => {
        if(!profileImage) {
            alert("이미지가 변경되지 않았습니다!");
            return;
        }
        const uuid = uuidv4();
        const storageRef = ref(storage, `profiles/${userProfile?.username}_${uuid}`)
        const uploadTask = uploadBytesResumable(storageRef, profileImage);

        let fileName = "";
        try {
            await new Promise<void>((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        fileName = snapshot.ref.name;
                        setUploadProgress({
                            [profileImage.name] : progress
                        })
                    }, (error) => {
                        setError(`${profileImage.name} 업로드 실패 : ${error.message}`);
                        reject(error);
                    }, async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        setUploadedUrl({ name : profileImage.name, fileName : fileName, fileUrl : url});
                        console.log(`${profileImage.name} 업로드 완료 - URL : ${url}`);
                        resolve();
                        await fetch("http://localhost:8080/api/user/profileImage", {
                            method: "PUT",
                            headers: {
                                "Authorization": `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                username: userProfile?.username,
                                filename: fileName,
                                fileurl:  url, 
                            })
                        }).then((result) => {
                            if(result.status != 201) {
                                alert("업데이트하지 못했습니다!");
                                return;
                            } else {
                                router.push("/profile");
                            }
                        })
                    }
                )
            })
        } catch (error) {
                console.log(`${profileImage.name} error : ${error}`);
        }
    }

    
    
    useEffect(() => {
        const nowUserName = localStorage.getItem("username");
        if(!nowUserName) {
            alert("로그인 되어있지 않습니다!");
            router.push("/auth/loginPage");
            return;
        }
        getProfile(nowUserName);
        
    }, []);


    return (
        userProfile && (<div className="w-[80%] h-full flex flex-col items-center gap-4 mt-20">
            <div className="w-full h-[30%] p-4 flex rounded-xl border-neutral-500">
                <div className="w-[25%] flex justify-center items-center">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={profileImageUrl || "https://github.com/shadcn.png"}/>
                        <AvatarFallback>UserProfile</AvatarFallback>
                    </Avatar>
                </div>
                <div className="w-[40%] flex flex-col justify-center items-center gap-6">
                    <p>{userProfile.email}</p>
                    <p>{userProfile.username}</p>
                </div>
                <div className="w-[35%] flex flex-col justify-center items-center gap-4">
                    <>
                        <Button
                                onClick={() => profileImageRef.current?.click()}
                                variant="outline"
                                className="bg-blue-500 text-white"
                            >
                                Select Image
                        </Button>
                        {
                            profileImage && (
                                <Button
                                onClick={profileImageChange}
                                variant="outline"
                                className="bg-slate-700 text-white"
                                >
                                    Change Profile
                                </Button>
                            )
                        }
                    </>
                    
                </div>
                <Input
                    type="file"
                    ref={profileImageRef}
                    onChange={handleProfileImage}
                    style={{ "display" : "none" }}
                    accept="image/*"
                />
            </div>
        </div>)
    )
}

export default Page;