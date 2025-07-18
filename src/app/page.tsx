import { CompassIcon, HeartIcon, HouseIcon, MessageCircleIcon, PlusSquareIcon, SearchIcon, User2Icon } from "lucide-react";
import Link from "next/link";

function Page() {
  return (
    <div className="flex min-h-screen w-full mx-auto"> {/* 전체 화면 높이를 차지하는 Flex 컨테이너 */}
        {/* 상단 섹션 (1 비율) */}
        <div className="m-2 p-4 gap-6 flex flex-col md:p-6 md:m-4" style={{ "flex" : 1 }}>
          <h3 className="text-2xl font-bold mb-2 md:mb-4 text-purple-600">Outstagram</h3>
          <nav className="flex flex-col gap-2 md:gap-8">
            <Link href="/" className="no-underline flex gap-3 text-lg items-center"><HouseIcon /><span>Home</span></Link>
            <Link href="/userSearch" className="no-underline flex gap-3 text-lg items-center"><SearchIcon />Search User</Link>
            <Link href="/feedSearch" className="no-underline flex gap-3 text-lg items-center"><CompassIcon />Search Feed</Link>
            <Link href="/message" className="no-underline flex gap-3 text-lg items-center"><MessageCircleIcon />Messages</Link>
            <Link href="/notification" className="no-underline flex gap-3 text-lg items-center"><HeartIcon />Notification</Link>
            <Link href="/createFeed" className="no-underline flex gap-3 text-lg items-center"><PlusSquareIcon />Create Feed</Link>
            <Link href="/profile" className="no-underline flex gap-3 text-lg items-center"><User2Icon />Profile</Link>
          </nav> 
        </div>

        {/* 구분선 */}
        <div className="border-l-2 border-gray-300 hidden md:block"></div> {/* 얇은 회색 구분선 */}

        {/* 중간 섹션 (2 비율) */}
        <div className="flex flex-col items-center justify-center text-lg font-bold m-2 md:m-4 p-4" style={{ "flex" : 6 }}>
          중간 섹션 (2)
        </div>

        {/* 구분선 */}
        <div className="border-r-2 border-gray-300"></div> {/* 얇은 회색 구분선 */}

        {/* 하단 섹션 (1 비율) */}
        <div className="flex flex-col items-center justify-center text-lg font-bold" style={{ "flex" :  3 }}>
          하단 섹션 (1)
        </div>

    </div>
  )
}

export default Page;
