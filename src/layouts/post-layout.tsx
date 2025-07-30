
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Post, PostProps } from "@/types/post";
import { getTimeAgo } from "@/utils/timeCalcul";
import { HeartIcon, HeartPlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PostModal from "./post-modal";
import { Button } from "@/components/ui/button";

const PostLayout: React.FC<PostProps> = ( { post } ) => {

    const [ api, setApi ] = useState<CarouselApi>();
    const [ current, setCurrent ] = useState(0);
    const [ count, setCount ] = useState(0);
    const [ liked, setLiked ] = useState(false);
    const [ likeId, setLikeId ] = useState<Number>();

    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ currentPost, setCurrentPost ] = useState<Post | null>(null);
    const userId = localStorage.getItem("userid");

    const openModal = (post : Post) => {
        setCurrentPost(post);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setCurrentPost(null);
        setIsModalOpen(false);
    }

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
            console.log(post.likes);
            post.likes.map((like) => {
                if(like.userId.toString() === userId) {
                    setLikeId(like.id); 
                    setLiked(true); 
                    return;
                }
            })   
        } 
    }, [api])

    const like = async () => {
        const result = await fetch("http://localhost:8080/api/post/like", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId: post.id,
                userId: userId,
            })
        });
        
        if(result.status === 201) {
            setLiked(true);
            const { id } = await result.json();
            setLikeId(id);
            post.likes.push({id : id, postId : post.id, userId : Number(userId)});  
        } else {
            alert("좋아요를 누를 수 없는 상태입니다!");
        }
        return;
    }

    const dislike = async () => {
        const result = await fetch("http://localhost:8080/api/post/dislike", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: likeId,
                postId: post.id,
                userId: Number(userId),
            })
        })

        if(result.status === 200) {
            setLiked(false);
            const deletedLikes = post.likes.filter(like => like.id !== likeId);
            post.likes = deletedLikes;
            setLikeId(0);
        }
    }

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
                <div className="flex items-center w-[80%] h-[5%] pl-2">
                    { liked ? <HeartIcon fill="red" onClick={dislike} /> : <HeartIcon onClick={like} />}
                </div>
                <div className="w-[80%] h-[10%]  flex flex-col pl-2">
                    <p>{post.likes.length} likes</p>
                    <p>{post.content}</p>
                </div>
                <div className="w-[80%] h-[10%]  pl-2">
                    <Button variant="ghost" onClick={() => openModal(post)}> {post.comments.length} comments </Button>
                </div>
            </div>

            {isModalOpen && post && (
                <PostModal post={post} onClose={closeModal} />
            )}
        </>
    )
}

export default PostLayout;