"use client"

import FollowUser from '@/layouts/follow-user';
import { User } from '@/types/post';
import React, { useEffect, useState } from 'react'

const Page = () => {

    const [ users, setUsers ] = useState<User[]>([]);

    const getAllUsers = async() => {
        const response = await fetch("http://localhost:8080/api/user/all");
        const result   = await response.json();
        setUsers(result);
    }


    useEffect(() => {
        getAllUsers();
    }, []);


  return (
    <div className="w-full h-full flex flex-col items-center text-lg font-bold gap-10 overflow-y-auto pt-8 pb-8">
        { users.map((user, index) => {
            if(user.id !== Number(localStorage.getItem("userid"))) {
                return (
                    <FollowUser key={index} user={user}/>
                )
            }
            
        })}
    </div>
  )
}

export default Page;