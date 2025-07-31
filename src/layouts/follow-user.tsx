import { Button } from '@/components/ui/button';
import { UserProp } from '@/types/post';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const FollowUser: React.FC<UserProp> = ( { user } )=> {

    const [ isFollowed, setIsFollowed ] = useState(false);
    const nowUserId = Number(localStorage.getItem("userid"));
    const [ followList, setFollowList ] = useState([]);
    
    const getFollowers = async () => {
        const response = await fetch("http://localhost:8080/api/user/follows");
        const result = await response.json();
        console.log(result);
        setFollowList(result);
    }

    useEffect(() => {
        getFollowers();
    }, []);

    return ( user && user.id !== nowUserId && (
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
                            <Button variant="outline">UnFollow</Button>
                        ) : (
                            <Button variant="outline">Follow</Button>
                        )
                    }
                </div>
            </div>
        </>
    ))
}

export default FollowUser;