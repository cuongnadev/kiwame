import { formatDate } from "@/helper/formatDate";
import { Comment } from "@/types/comment";
import { Flag, MoreVertical, ThumbsDown, ThumbsUp, Trash } from "lucide-react";
import Image from "next/image";
import { Button, Popup } from "../../ui";

export interface CommentItemPros {
    comment: Comment,
    liked: boolean,
    handleDislike: (id: string, user_id: string) => void,
    deleteComment: (comment_id: string) => void,
    user_id: string
}

export function CommentItem({ comment, liked, handleDislike, user_id, deleteComment }: CommentItemPros) {
    return (
        <div
            key={comment.id}
            className="flex gap-4 pb-6 border-b border-gray-800 hover:bg-gray-950 p-4 rounded transition -mx-4 px-4"
        >
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl overflow-hidden">
                    {comment.user.avatar_url.startsWith('http') ? (
                        <Image
                            src={comment.user.avatar_url}
                            alt={comment.user.name}
                            width={40}
                            height={40}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        comment.user.avatar_url
                    )}
                </div>
            </div>

            {/* Comment Content */}
            <div className="flex-1 min-w-0">
                {/* Header - Username and Time */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm hover:underline cursor-pointer">
                        {comment.user.channelName}
                    </span>
                    <span className="text-neutral-500 text-xs font-semibold">
                        {formatDate(comment.created_at)}
                    </span>
                </div>

                {/* Comment Text */}
                <p className="text-gray-200 text-md font-semibold leading-relaxed mb-1 break-words">
                    {comment.content}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <div className="flex gap-1 items-center">
                        <Button
                            icon={<ThumbsUp size={16} className={`${liked ? 'fill-white' : ''}`} />}
                            variant="outline"
                            radius='full'
                            className={`border-none p-2!`}
                        />
                        <span>{(comment.likes + (liked ? 1 : 0)).toString()}</span>
                    </div>
                    <Button
                        icon={<ThumbsDown size={16} className={`${liked ? 'fill-white' : ''}`} />}
                        onClick={() => handleDislike(comment.id, user_id)}
                        variant='outline'
                        radius="full"
                        className='border-none p-2! transition-colors'
                    />

                    {/* Reply Button */}
                    <Button
                        text='Phản hồi'
                        variant="outline"
                        className='border-none p-1! text-sm'
                        radius='full'
                    />
                </div>
            </div>
            <div className="flex items-center">
                <Popup
                    trigger={
                        <Button
                            icon={<MoreVertical size={18} />}
                            variant='outline'
                            className='border-none p-2!'
                            radius="full"
                        />
                    }
                    position="bottom"
                >
                    <div className="p-1 w-auto">
                        <Button
                            icon={<Flag size={16} />}
                            text="Báo cáo vi phạm"
                            variant="outline"
                            className="border-none"
                            radius="md"
                        />
                        {user_id === comment.user.id && (
                            <Button
                                icon={<Trash size={16} />}
                                onClick={()=>{deleteComment(comment.id)}}
                                text="Xóa bình luận"
                                variant="outline"
                                className="border-none"
                                radius="md"
                            />
                        )}
                    </div>
                </Popup>
            </div>
        </div>
    )
}