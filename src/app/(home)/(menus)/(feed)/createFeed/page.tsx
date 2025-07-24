"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { storage } from "../../../../../firebase/config.js";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; 

import { ChangeEvent,  useEffect,  useRef, useState } from "react";
import { error } from "console";
import { useRouter } from "next/navigation";

// Define the type for better clarity (matching your backend DTO)
interface PostImageInfo {
    imageIdx: number;
    imageUrl: string;
    fileName: string;
}

const Page = () => {

    const [ postImages, setPostImages ] = useState<string[]>([]);
    const [ files, setFiles ] = useState<File[]>([]);
    const [ downloadURLs, setDownloadURLs ] = useState([]);
    const [ uploadProgress, setUploadProgress ] = useState({});
    const [ error, setError ] = useState("");
    
    const [ feedDescription, setFeedDescription ] = useState("");
    const postImagesRef = useRef<HTMLInputElement>(null);

    const [ current, setCurrent ] = useState(0);
    const [ count, setCount ] = useState(0);
    const [ api, setApi ] = useState<CarouselApi>();

    const router = useRouter();
    const resetState = () => {
        setPostImages([]);          // Resets to an empty array
        setFiles([]);              // Resets to an empty array
        setDownloadURLs([]);       // Resets to an empty array
        setUploadProgress({});     // Resets to an empty object
        setError("");              // Resets to an empty string
        setFeedDescription("");    // Resets to an empty string
    };

    useEffect(() => {
        if(!api) return;

        setCount(postImages.length);
        api.scrollTo(0);
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1)
      })
    }, [api, postImages])
    
    const uploadPost = async(uploadedURLs : PostImageInfo[]) => {
        const postData = { content :  feedDescription, writer : localStorage.getItem("username"), postImages : uploadedURLs };
        const result = await fetch("http://localhost:8080/api/post/create", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        })
        if(result.status !== 201) {
            alert("게시물 작성에 실패하였습니다!");
        } else {
            resetState();
            router.push("/");
        }
    }

    const handlePostUpload = async () => {
        if( !files ) {
            alert("파일을 첨부하세요!");
            return;
        }

        if( !feedDescription ) {
            alert("피드 내용을 입력하세요!");
            return;
        }
        
        const uploadPromise : Promise<PostImageInfo>[] = files.map(async (file, index) => {
            const uuid = uuidv4();
            const storageRef = ref(storage, `feeds/${uuid}${(new Date()).getTime()}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            return new Promise<PostImageInfo>((resolve, reject) => {
                    let fileName: string = "";
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            fileName = snapshot.ref.name;
                            setUploadProgress((prev) => ({
                                ...prev,
                                [file.name] : progress,
                            }));
                            //console.log(`${file.name}의 진행상황 : ${progress.toFixed(2)}`);
                        },
                        (error) => {
                            //console.log(`${file.name} : 업로드 실패!!`);
                            setError((prev) => prev + `\n${file.name} 업로드 실패 : ${error.message}`);
                            reject(error);
                        },
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log(`${file.name} 업로드 완료 - URL : ${url} >> ${fileName}`);
                            resolve({ imageIdx : index, imageUrl : url, fileName : fileName});
                        }
                    );
                })
            })
        
        try {
            const uploadedURLs = await Promise.all(uploadPromise);
            // console.log(`이미지 업로드 완료! : ${uploadedURLs}`);
            uploadPost(uploadedURLs);
        } catch (error) {
        // 이미지 업로드 또는 백엔드 API 호출 중 발생한 모든 에러를 여기서 처리
        console.error('글 작성 과정에서 최종 오류 발생:', error);
        // 사용자에게 적절한 오류 메시지 표시
        }   
    }

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
                setFiles([]);
                for(let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if(file.size > 5 * 1024 * 1024) {
                        alert("파일은 5MB를 넘을 수 없습니다!");
                        event.target.value = "";
                        return;
                    } else {
                        const imgUrl = URL.createObjectURL(file);
                        setFiles(prev => [...prev, file]);
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
            <div className="flex flex-col w-[80%] h-[80%]">
                <div className="flex justify-end pb-2">
                    <Button variant="outline" onClick={handlePostUpload}>
                        게시하기
                    </Button>
                </div>
                <div className="w-full flex border rounded-2xl h-full justify-center items-center" onClick={fileUploadHandling}>
                    {
                        postImages.length > 0 ? (
                            <Carousel className="w-[95%] h-[95%]" setApi={setApi}>
                                <CarouselContent className="w-full h-full">
                                    {postImages.map((postImage, index) => (
                                        <CarouselItem key={index} className="h-full w-full relative">
                                            <img
                                                src={postImage}
                                                alt={`postImage ${index}`}
                                                className="h-full w-full object-contain absolute inset-0 pl-4"
                                                // width={800} height={600}
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious onClick={(e) => {
                                    e.stopPropagation();
                                    api?.scrollPrev();
                                    }
                                } />
                                <CarouselNext onClick={(e) => {
                                    e.stopPropagation()
                                    api?.scrollNext();
                                    }
                                 } />
                                {
                                    postImages.length > 0 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-black z-10 font-extrabold">
                                            { current } / { count }
                                        </div>
                                    )
                                }
                            </Carousel>
                            ) : (
                                <Card className="w-full h-full">
                                    <CardContent className="flex items-center justify-center w-full h-full">
                                        <div className="text-gray-500 text-center">
                                            사진을 업로드하려면 클릭하세요. (최대 5장)
                                        </div>
                                    </CardContent>
                                </Card>
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