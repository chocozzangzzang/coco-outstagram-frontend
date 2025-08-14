import { getTimeAgo } from '@/utils/timeCalcul';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React, { useEffect, useState } from 'react'
import { Comment } from '@/types/post';
import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2Icon } from 'lucide-react';

const PostCommentLayout = ({ comment, delComms } : { 
  comment : Comment,
  delComms : (id : number) => void,
}) => {
  const [ avatarUrl, setAvatarUrl ] = useState(null);

  const editComment = (id : number) => {
    alert(id);
  }

  const deleteComment = async (id : number) => {
    if(!confirm("댓글을 삭제하시겠습니까?")) return;
    const response = await fetch(`http://localhost:8080/api/comment/delete?commentId=${id}`);
    if(response.status !== 200) {
      alert("댓글을 삭제하지 못했습니다!!");
    } else {
      delComms(comment.id);
    }
  }

  const getAvatarUserProfile = async (username : string) => {
    const response = await fetch("http://localhost:8080/api/user/profile", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
      })
    });
    if(response.status !== 200) {
      return;
    } else {
      const result = await response.json();
      setAvatarUrl(result.profilePictureUrl);
    }
  }

  useEffect(() => {
    getAvatarUserProfile(comment.username);
  }, [comment]);

  return (
    <>
      <div className="mb-3 flex flex-col items-start flex-1">
        <div className="flex items-center">
          <img src={avatarUrl ?? "./globe.svg"} 
              className="w-8 h-8 rounded-full mr-3 border border-gray-300" />
          <span className="font-semibold text-gray-800 mr-2">{comment.username}</span>
          <p className="text-gray-400 flex-1">{comment.content}</p>
          </div>
          <div>
            <p className="text-gray-400">{getTimeAgo(comment.createdAt)}</p>
          </div>
        </div>
        {
          comment.userId === Number(localStorage.getItem('userid')) && (
            <div className="flex justify-center items-center">
              <Button onClick={() => editComment(comment.id)}>
                <PencilIcon />
              </Button>
              <Button onClick={() => deleteComment(comment.id)}>
                <Trash2Icon />
              </Button>
            </div>
          )
        }
    </>
  )
}

export default PostCommentLayout;