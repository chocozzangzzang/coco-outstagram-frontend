"use client"

import PostLayout from "@/layouts/post-layout";
import { Post } from "@/types/post";
import { useEffect, useState } from "react";

function Page() {

  const [ posts, setPosts ] = useState<Post[]>([]);

  const getPosts = async() => {
      const postResponse = await fetch("http://localhost:8080/api/post/all");
      const postResult = await postResponse.json();

      const userResponse = await fetch("http://localhost:8080/api/user/all");
      const userResult = await userResponse.json();

      const response = await fetch("http://localhost:8080/api/user/follows");
      const result = await response.json();
      
      const myFollowing = result.filter((res : {followerId : number}) => res.followerId === Number(localStorage.getItem("userid")))
                                .map((temp : {followingId : number}) => temp.followingId);
      myFollowing.push(Number(localStorage.getItem('userid')));
      const iWantShow = userResult.filter((user : {id : number}) => myFollowing.includes(user.id)).map((user : {username : string}) => user.username);

      const filteredPosts = postResult.filter((post : {writer : string}) => iWantShow.includes(post.writer));
      setPosts(filteredPosts);
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
