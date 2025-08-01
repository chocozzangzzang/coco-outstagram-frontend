import { Button } from '@/components/ui/button';
import { UserProp } from '@/types/post';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const FollowUser: React.FC<UserProp> = ( { user } )=> {

    const [ isFollowed, setIsFollowed ] = useState(false);
    const nowUserId = Number(localStorage.getItem("userid"));
    const [ followingId, setFollowingId ] = useState<number>();

    const getAllFollowers = async() => {
        const response = await fetch("http://localhost:8080/api/user/follows");
        const data = await response.json();
        const myFollowing = data.filter((user: {followerId: number;}) => user.followerId === nowUserId);
        
        myFollowing.map((f : {id: number; followingId: number;}) => {
            if(f.followingId === user.id) {
                setIsFollowed(true);
                setFollowingId(f.id);
                return;
            }
        })
    }

    useEffect(() => {
        getAllFollowers();
    }, []);

    const follow = async () => {
        const response = await fetch("http://localhost:8080/api/user/following", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ followerId: nowUserId, followingId: user.id})
        });
        if(response.status !== 201) {
            alert("팔로우하지 못했습니다!!");
            return;
        } else {
            const data = await response.json();
            setFollowingId(data.id);
            setIsFollowed(true);
        }
    }

    const unFollow = async () => {
        await fetch("http://localhost:8080/api/user/unfollow", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: followingId, followerId: nowUserId, followingId: user.id})
        })
        setIsFollowed(false);
    }

    return ( user && (
        <>
            <div className=" border border-black w-[70%] h-[15vh] flex items-center gap-4 rounded-xl p-4">
                <div className='w-[20%] flex items-center justify-center'>
                    {
                        user.profilePictureUrl ? (
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={user.profilePictureUrl}/>
                                <AvatarFallback>UserProfile</AvatarFallback>
                            </Avatar>
                        ) : (
                            <User className='w-16 h-16'/>
                        )
                    }
                </div>
                <div className='w-[50%] flex flex-col gap-4'>
                    <p>{user.username}</p>
                    <p>{user.email}</p>
                </div>
                <div className='w-[15%] flex'>
                    {
                        isFollowed ? (
                            <Button variant="outline" onClick={unFollow}>UnFollow</Button>
                        ) : (
                            <Button variant="outline" onClick={follow}>Follow</Button>
                        )
                    }
                </div>
            </div>
        </>
    ))
}

export default FollowUser;