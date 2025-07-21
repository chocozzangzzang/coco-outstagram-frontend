"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ChangeEvent,  useEffect,  useRef, useState } from "react";

const Page = () => {

    const [ postImages, setPostImages ] = useState<string[]>([]);
    const [ feedDescription, setFeedDescription ] = useState("");
    const postImagesRef = useRef<HTMLInputElement>(null);

    const [ current, setCurrent ] = useState(0);
    const [ count, setCount ] = useState(0);
    const [ api, setApi ] = useState<CarouselApi>();

    useEffect(() => {
        if(!api) return;

        setCount(postImages.length);
        api.scrollTo(0);
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1)
      })
    }, [api, postImages])

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

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    return (
        <div className="flex flex-col h-screen w-[80%] mx-auto pt-12 pb-12 gap-4 items-center">
            <div className="flex flex-col w-[80%] h-[80%]">
                <div className="flex justify-end pb-2">
                    <Button variant="outline">
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