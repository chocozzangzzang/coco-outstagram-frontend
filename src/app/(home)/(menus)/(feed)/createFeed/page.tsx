"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

const Page = () => {

    const [ postImages, setPostImages ] = useState<string[]>([]);
    const [ feedDescription, setFeedDescription ] = useState("");
    const postImagesRef = useRef<HTMLInputElement>(null);

    const handlePostImages = (event : ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        let tempImages = [];
        if(!files) return;
        else {
            if( files.length > 5) { 
                alert("파일은 5개 이상 첨부할 수 없습니다!"); 
                event.target.value = "";
                return;
            } else {
                for(let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if(file.size > 5 * 1024 * 1024) {
                        alert("파일은 5MB를 넘을 수 없습니다!");
                        event.target.value = "";
                        return;
                    } else {
                        const imgUrl = URL.createObjectURL(file);
                        tempImages.push(imgUrl)
                    }
                }
                setPostImages(tempImages);
            }
        }
    }

    const fileUploadHandling = () => {
        postImagesRef.current?.click();
    }

    const handleDescription = (event : ChangeEvent<HTMLTextAreaElement>) => {
        setFeedDescription(event.target.value);
    }

    return (
        <div className="flex flex-col h-screen w-[80%] mx-auto pt-12 pb-12 gap-4 items-center">
            <div className="flex flex-col w-[80%] h-[50%]">
                <div className="flex justify-end pb-2">
                    <Button variant="outline">
                        게시하기
                    </Button>
                </div>
                <div className="w-full h-full flex border relative items-center justify-center" onClick={fileUploadHandling}>
                    {
                        postImages.length > 0 ? (
                                <Image
                                    fill
                                    src={postImages[0]}
                                    alt="postImage"
                                    objectFit="cover"
                                    sizes="100vw"
                                />
                        ) : (
                            <p>Image is Loading..........</p>
                        )
                    }
                </div>
                <Input
                    type="file"
                    ref={postImagesRef}
                    onChange={handlePostImages}
                    style={{ "display" : "none" }}
                    multiple
                    required
                    accept="image/*"
                />
            </div>
            <div className="flex flex-col w-[80%] h-[30%]">
                <Textarea
                    value={feedDescription}
                    onChange={handleDescription}
                    placeholder="Write a description of your feed"
                    rows={4}
                    className="resize-none"
                />
            </div>
        </div>
    )
}

export default Page;