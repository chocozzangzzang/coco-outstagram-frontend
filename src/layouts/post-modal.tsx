import { Comment, Post } from "@/types/post";
import { XIcon } from "lucide-react";
import { useState } from "react";

const PostModal = ({ post, onClose } : {post : Post, onClose : () => void;}) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.comments); // 모달 내에서 댓글 상태 관리

  const handleAddComment = () => {
    if (newComment.trim()) {
      const commentId = 11; // 간단한 고유 ID 생성
      setComments([...comments, { id: commentId, userId: 1, postId: 12, content: newComment }]);
      setNewComment('');
    }
  };

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e : React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === 'modal-overlay') {
      onClose();
    }
  };

  return (
    // 모달 오버레이
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-sans animate-fade-in"
      onClick={handleOverlayClick}
    >
      {/* 모달 컨테이너 */}
      <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl h-auto max-h-[90vh] overflow-hidden transform scale-95 animate-scale-in">
        {/* 왼쪽: 이미지 영역 */}
        <div className="w-full md:w-1/2 bg-gray-200 flex items-center justify-center overflow-hidden relative">
          <img
            src={post.postImages[0].imageUrl}
            alt="게시글 이미지"
            className="w-full h-full object-contain" // 이미지 비율 유지
          />
        </div>

        {/* 오른쪽: 게시글 및 댓글 영역 */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
          {/* 모달 헤더 (사용자 정보 및 닫기 버튼) */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src="./globe.svg" className="w-9 h-9 rounded-full mr-3 border border-gray-300" />
              <span className="font-bold text-gray-800 text-lg">test</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              aria-label="모달 닫기"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* 게시글 내용 */}
          <div className="p-4 border-b border-gray-200">
            <p className="text-gray-700 leading-relaxed text-base">
              <span className="font-bold mr-2">tester</span>
              caption??
            </p>
            <p className="text-gray-500 text-xs mt-2">time</p>
          </div>

          {/* 댓글 목록 */}
          <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="mb-3 flex items-start">
                  <span className="font-semibold text-gray-800 mr-2">{comment.userId}</span>
                  <p className="text-gray-700 flex-1">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          {/* 댓글 입력 필드 */}
          <div className="p-4 border-t border-gray-200 flex items-center">
            <input
              type="text"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-base"
              placeholder="댓글 달기..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
            />
            <button
              onClick={handleAddComment}
              className="ml-3 px-5 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md active:scale-98"
            >
              게시
            </button>
          </div>
        </div>
      </div>

      {/* Tailwind CSS 애니메이션을 위한 스타일 */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }

        /* Custom scrollbar for comments section */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        `}
      </style>
    </div>
  );
};

export default PostModal;