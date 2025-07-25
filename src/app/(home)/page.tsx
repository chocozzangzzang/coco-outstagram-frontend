"use client"

import PostLayout from "@/layouts/post-layout";
import { Post } from "@/types/post";
import { useEffect, useState } from "react";

function Page() {

  const [ posts, setPosts ] = useState<Post[]>([]);

  const getPosts = async() => {
    await fetch("http://localhost:8080/api/post/all")
      .then( async (result) => {
        const data = await result.json();
        console.log(data);
        setPosts(data);
      })
  }

  useEffect(() => {
    getPosts();
  }, [])


  return (
    <> {/* 전체 화면 높이를 차지하는 Flex 컨테이너 */}      
        {/* 중간 섹션 (2 비율) */}
        <div className="w-full h-full flex flex-col items-center justify-center text-lg font-bold gap-10 overflow-y-auto pt-8 pb-8">
            {posts.map((post, index) => (
              <PostLayout key={index} post={post}/>
            ))}
        </div>
    </>
  )
}

export default Page;
