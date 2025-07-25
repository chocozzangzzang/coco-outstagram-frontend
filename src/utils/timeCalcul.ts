import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export function getTimeAgo(targetTime : string): string {
    try {
        const date = parseISO(targetTime);

        return formatDistanceToNow(date, { addSuffix : true, locale : ko});
    } catch (error) {
        console.log(`날짜 파싱 오류 : ${error}`);
        return "날짜 오류";
    }
} 