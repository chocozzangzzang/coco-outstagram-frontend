
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PostProps } from "@/types/post";
import { getTimeAgo } from "@/utils/timeCalcul";
import { HeartIcon, HeartPlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PostLayout: React.FC<PostProps> = ( { post } ) => {

    const [ api, setApi ] = useState<CarouselApi>();
    const [ current, setCurrent ] = useState(0);
    const [ count, setCount ] = useState(0);
    const [ liked, setLiked ] = useState(false);

    const createdDuration = useMemo(() => getTimeAgo(post.createdAt), [post.createdAt]);
    useEffect(() => {
        if(!api) return;

        if(post.postImages.length > 0) {

            api.scrollTo(0);
            setCurrent(api.selectedScrollSnap() + 1);

            api.on("select", () => {
                setCurrent(api.selectedScrollSnap() + 1)
            })

            setCount(post.postImages.length);

            const userId = localStorage.getItem("userid");

            post.likes.map((like) => {
                if(like.userId.toString() === userId) {setLiked(true); return;}
            })   
        } 
    }, [api])

    console.log("----" , liked);

    return (
        <>
            <div className=" border border-black w-[70%] h-[70vh] flex flex-col items-center pt-6 gap-4 rounded-xl pr-2">
                <div className="w-[80%] h-[10%] flex flex-start items-center gap-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src="https://github.com/shadcn.png"/>
                        <AvatarFallback>UserProfile</AvatarFallback>
                    </Avatar> {post.writer} {createdDuration}
                </div>
                <div className="w-[80%] h-[50%] pl-4 pr-2">
                    {post.postImages.length > 0 && 
                        <Carousel className="w-[100%] h-[100%]" setApi={setApi}>
                            <CarouselContent className="w-full h-full">
                                {post.postImages.map((postImage, index) => (
                                    <CarouselItem key={index} className="h-full w-full relative">
                                        <img
                                            src={postImage.imageUrl}
                                            alt={`postImage ${index}`}
                                            className="h-full w-full object-contain absolute inset-0 pl-6"
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
                                post.postImages.length > 0 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-black z-10 font-extrabold">
                                        { current } / { count }
                                    </div>
                                )
                            }
                        </Carousel>
                    }
                </div>
                <div className="w-[80%] h-[8%]  pl-2">
                    { liked ? <HeartIcon /> : <HeartPlusIcon />}
                </div>
                <div className="w-[80%] h-[10%]  flex flex-col pl-2">
                    <p>Likes {post.likes.length}개</p>
                    <p>{post.content}</p>
                </div>
                <div className="w-[80%] h-[10%]  pl-2">
                    댓글 {post.comments.length}개 ##댓글보기##
                </div>
            </div>
        </>
    )
}

export default PostLayout;