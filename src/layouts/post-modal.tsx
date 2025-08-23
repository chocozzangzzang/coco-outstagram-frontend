import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Comment, Post, User } from "@/types/post";
import { getTimeAgo } from "@/utils/timeCalcul";
import { XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PostCommentLayout from "./post-comment-layout";

const PostModal = ({ post, isLike, onClose, comments, setComments } : {
    post : Post, 
    isLike : boolean, 
    onClose : () => void,
    comments: Comment[],
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>
  }) => {
  const [newComment, setNewComment] = useState('');
  // const [comments, setComments] = useState<Comment[]>(post.comments); // 모달 내에서 댓글 상태 관리
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<User>();

  const [api, setApi] = useState<CarouselApi>();
  const createdDuration = useMemo(() => getTimeAgo(post.createdAt), [post.createdAt]);

  const getUserInfo = async() => {
    const username = post.writer;
    const response = await fetch("http://localhost:8080/api/user/profile", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username : username,
      })
    });
    if(response.status !== 200) {
      alert("프로필을 불러올 수 없습니다.");
      onClose();
    } else {
      const result = await response.json();
      setUser(result);
    }
  }

  useEffect(() => {
          if(!api) return;

          getUserInfo();

          if(post.postImages.length > 0) {
              api.scrollTo(0);
              setCurrent(api.selectedScrollSnap() + 1);
  
              api.on("select", () => {
                  setCurrent(api.selectedScrollSnap() + 1)
              })
              setCount(post.postImages.length);
              console.log(post.likes);  
          }

          if(post.id) {
            //getComments(post.id);
          }
      }, [api]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const username = String(localStorage.getItem("username"));
      const userId = Number(localStorage.getItem('userid'));
      const postId = post.id;

      const response = await fetch("http://localhost:8080/api/comment/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PUBLIC_JWT_SECRET_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            postId: postId,
            userId: userId,
            username: username,
            content: newComment,
        })
      });
      if(response.status !== 201) {
        alert("댓글을 달지 못했습니다!!");
      } else {
        const result = await response.json();
        // comments.push(result);
        setComments(prevComments => [...prevComments, result]);
      }
      setNewComment('');
    }
  };

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e : React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === 'modal-overlay') {
      onClose();
    }
  };

  const deleteComment = async (id : number) => {
    if(!confirm("댓글을 삭제하시겠습니까?")) return;
    const response = await fetch(`http://localhost:8080/api/comment/delete?commentId=${id}`);
    if(response.status !== 200) {
      alert("댓글을 삭제하지 못했습니다!!");
    } else {
      const newComments = comments.filter((comment) => comment.id !== id);
      comments = newComments;
      setComments(newComments);
    }
  }

  return (
    // 모달 오버레이
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-sans animate-fade-in"
      onClick={handleOverlayClick}
    >
      {/* 모달 컨테이너 */}
      <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl h-[80vh] overflow-hidden transform scale-95 animate-scale-in">
        {/* 왼쪽: 이미지 영역 */}
        <div className="w-full md:w-1/2 bg-gray-200 flex items-center justify-center overflow-hidden relative">
          {post.postImages.length > 0 && 
            <Carousel className="w-[100%] h-[100%]" setApi={setApi}>
                <CarouselContent className="w-full h-full">
                  {post.postImages.map((postImage, index) => (
                    <CarouselItem key={index} className="h-full w-full relative">
                      <img
                        src={postImage.imageUrl}
                        alt={`postImage ${index}`}
                        className="h-full w-full object-contain absolute inset-0 pl-6"
                        // width={800} height={600}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious onClick={(e) => {
                    e.stopPropagation();
                    api?.scrollPrev();
                    }
                } />
                <CarouselNext onClick={(e) => {
                  e.stopPropagation()
                  api?.scrollNext();
                  }
                } />
                {
                  post.postImages.length > 0 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-black z-10 font-extrabold">
                    { current } / { count }
                  </div>)
                }
            </Carousel>}
        </div>

        {/* 오른쪽: 게시글 및 댓글 영역 */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
          {/* 모달 헤더 (사용자 정보 및 닫기 버튼) */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src={user?.profilePictureUrl? user.profilePictureUrl : "./globe.svg"} 
              className="w-9 h-9 rounded-full mr-3 border border-gray-300" />
              <span className="font-bold text-gray-800 text-lg">{post.writer}</span>
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
              <span className="font-bold mr-2">{post.writer}</span>
              {post.content}
            </p>
            <p className="text-gray-500 text-xs mt-2">{createdDuration}</p>
          </div>

          {/* 댓글 목록 */}
          <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <PostCommentLayout comment={comment} delComms={deleteComment}/>                  
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