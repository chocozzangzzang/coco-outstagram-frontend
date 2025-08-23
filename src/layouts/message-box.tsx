import { User } from "@/types/post";
import MessageBoxModal from "./message-box-modal";
import { useState } from "react";

const MessageBox = ({ person }: { person: User }) => {
  const nowUser = localStorage.getItem("userid");
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => {
    setModalOpen(false);
  };
  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className="w-[100%] h-[15%] flex" onClick={openModal}>
        <div className="w-[100%] flex items-start p-4 bg-white rounded-lg shadow-md">
          <div className="flex-shrink-0 w-1/5 flex justify-center">
            <img
              src={person.profilePictureUrl ?? "./globe.svg"}
              alt="프로필 이미지"
              className="rounded-full w-full max-w-[80px] h-auto object-cover"
            />
          </div>

          <div className="flex-1 ml-5 overflow-hidden">
            <div className="font-bold text-lg text-gray-800 truncate">
              {person.username}
            </div>
            <div className="text-gray-600 text-sm mt-1 break-words">
              메세지 내용 출력칸
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <MessageBoxModal
          show={modalOpen}
          onHide={closeModal}
          nowUser={Number(nowUser)}
          other={person}
        />
      )}
    </>
  );
};

export default MessageBox;
