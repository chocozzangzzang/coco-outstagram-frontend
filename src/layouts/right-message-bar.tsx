"use client";

import { User } from "@/types/post";
import { useEffect, useState } from "react";
import MessageBox from "./message-box";

const RightMessageBar = () => {
  const [user, setUser] = useState<User[]>();

  const getUsers = async () => {
    const nowUser = localStorage.getItem("userid");

    try {
      const response = await fetch("http://localhost:8080/api/user/all", {
        headers: {
          Authorization: `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        alert("유저를 불러올 수 없습니다");
      } else {
        const result = await response.json();
        const resultExceptNowUser = result.filter(
          (res: { id: number | null }) => res.id !== Number(nowUser)
        );
        setUser(resultExceptNowUser);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 pt-4">
        {user?.map((person) => (
          <MessageBox person={person} key={person.id} />
        ))}
      </div>
    </>
  );
};

export default RightMessageBar;
