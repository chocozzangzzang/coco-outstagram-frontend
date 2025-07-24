"use client"

import { useEffect, useState } from "react";

function Page() {

  const [ posts, setPosts ] = useState([]);

  const getPosts = async() => {
    await fetch("http://localhost:8080/api/post/all")
      .then( async (result) => {
        const data = await result.json();
        // console.log(data);
        setPosts(data);
      })
  }

  useEffect(() => {
    getPosts();
  }, [])


  return (
    <> {/* 전체 화면 높이를 차지하는 Flex 컨테이너 */}      
        {/* 중간 섹션 (2 비율) */}
        <div className="w-full h-full flex flex-col items-center justify-center text-lg font-bold gap-10 overflow-y-auto pt-8">
            {posts.map((post, index) => (
              <div className="w-[70%] h-[70vh] flex flex-col items-center bg-slate-600 pt-6 gap-4">
                <div className="w-[80%] h-[50%] bg-red-600">
                    IMAGE SECTION
                </div>
                <div className="w-[80%] h-[10%] bg-yellow-500">
                    LIKE COMMENT COUNTING SECTION
                </div>
                <div className="w-[80%] h-[15%] bg-pink-950">
                    POST CONTENT SECTION
                </div>
                <div className="w-[80%] h-[10%] bg-white">
                    COMMENT COUNT & SHOW BUTTON SECTION
                </div>
              </div>
            ))}
        </div>
    </>
  )
}

export default Page;
