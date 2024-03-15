import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

// services
import { useComment } from "@/pages/test-kitchen/hooks/useComment";
import SocketContext from "@/services/contexts/socketContext";
import AuthContext from "@/services/contexts/authContext";

// types
import { AuthContextType, SocketContextType } from "@/services/contexts/models";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CommentInputProps, CommentWrapProps, CommentsProps } from "@/pages/test-kitchen/models";
import { CommentFeedMessageType } from "@/pages/test-kitchen/models";

// feeds
const COMMENT_FEED_CHANNEL = import.meta.env.VITE_COMMENT_FEED_CHANNEL;

const CommentInput = ({ iterationId }: CommentInputProps) => {

  // socket
  const { socket } = useContext(SocketContext) as SocketContextType;
  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  // input state
  const [text, setText] = useState("");

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const changeCommentHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target } = e;
    const { value } = target;
    setText(value);
    adjustTextareaHeight(target)
  }

  const { createComment } = useComment({ iterationId });

  const handleCreateComment = async () => {
    const newComment = await createComment.mutateAsync({ text });
    if (newComment) {
      setText("");
      socket?.emit(COMMENT_FEED_CHANNEL, {
        userId,
        newComment
      });
    };
  };

  return (
    <>
      <div>
        Add a Comment
      </div>
      <label htmlFor="comment-textarea" />
      <textarea
        placeholder="type here..."
        value={text}
        onChange={changeCommentHandler}
        id="comment-textarea"
        className="border-0 border-b-2 grow border-slate-50 focus:border-orange-300 
                   overflow-y-hidden resize-none focus:outline-none bg-transparent"
      />
      <div className="flex justify-center pt-2">
        <button
          className="uppercase bg-slate-950 px-2 py-1 text-white"
          onClick={handleCreateComment}
        >
          send
        </button>
      </div>
    </>
  );
};

const CommentWrap = ({ comment }: CommentWrapProps) => {

  const { text, createdOn, user } = comment;
  const { image, username, id } = user;

  var event = new Date(createdOn);
  const time = event.toLocaleTimeString('en-US');
  const date = event.toLocaleDateString('en-GB');

  return (
    <div className="flex items-center py-3 first:pt-0 last:pb-0">
      <Link to={`/profile/${id}`} className="aspect-square max-w-12 rounded-full overflow-hidden">
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="pl-2 ">
        <div className="line-clamp-2">
          {text}
        </div>
        <div className="flex space-x-3">
          <span className="italic">from {username}</span>
          <span className="italic text-gray-600">{date}, {time}</span>
        </div>
      </div>
    </div>
  );
};

export const Comments = ({ iteration }: CommentsProps) => {

  // unpack iteration id
  const { id: iterationId } = iteration;

  // socket
  const { socket } = useContext(SocketContext) as SocketContextType;

  // auth
  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  // query comments
  const { getComments } = useComment({ iterationId });
  const { data, isLoading } = getComments;

  // client
  const queryClient = useQueryClient();

  // new comments -> invalidate query
  useEffect(() => {
    socket?.on(COMMENT_FEED_CHANNEL, ({ userId: emitterId, newComment }: CommentFeedMessageType): undefined => {

      if (emitterId === userId) return;

      if (iterationId === newComment.iterationId) {
        queryClient.invalidateQueries({ queryKey: ["comments", iterationId] })
      };
    });
  }, [socket])

  // Render loading screen
  if (isLoading) {
    return (
      <div className="flex flex-col">
        <CommentInput iterationId={iterationId} />
        <div className="animate-pulse rounded-full my-5 h-4 bg-slate-300" />
        <div className="animate-pulse divide-y divide-slate-600">
          {Array.from(Array(5).keys()).map((index) => (
            <div className="flex items-center py-3 first:pt-0 last:pb-0" key={index}>
              <div className="aspect-square min-w-10 rounded-full bg-slate-300" />
              <div className="pl-2 grow">
                <div className="animate-pulse rounded-full w-full h-2 my-1 bg-slate-300" />
                <div className="animate-pulse rounded-full w-full h-2 my-1 bg-slate-300" />
                <div className="animate-pulse rounded-full w-full h-2 my-1 bg-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div className="flex flex-col">
      <CommentInput iterationId={iterationId} />
      {data?.length ? (
        <>
          <div className="my-5">
            Previous Comments
          </div>
          <div className="divide-y divide-slate-600">
            {data?.map((comment, index) => (
              <CommentWrap comment={comment} key={index} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center my-5">
          no comments have been added for this iteration yet
        </div>
      )}
    </div>
  );
};