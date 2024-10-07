import { getTranslation } from '../contexts/LanguageContext';
import { Language } from '../translations';
import { getTelegramComments } from '../utils/telegramUtils';
import { getConfig } from '../utils/config';
interface Comment {
  id: number;
  text: string;
  author: string;
  date: string;
  replies?: Comment[];
  quote?: {
    author: string;
    text: string;
  };
}

interface TelegramCommentsProps {
  postId: string;
  lang: Language;
}

const CommentItem = ({ comment }: { comment: Comment }) => (
  <div className="mb-2 last:mb-0">
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
        <span className="font-semibold">{comment.author}</span> • {comment.date}
      </p>
      {comment.quote && (
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-2 text-xs">
          <p className="font-semibold">{comment.quote.author}:</p>
          <p className="text-gray-700 dark:text-gray-300">{comment.quote.text}</p>
        </div>
      )}
      <p className="text-sm">{comment.text}</p>
    </div>
    {comment.replies && comment.replies.length > 0 && (
      <div className="ml-3 mt-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
        {comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} />
        ))}
      </div>
    )}
  </div>
);

const TelegramComments = async ({ postId, lang }: TelegramCommentsProps) => {
  // const comments = await getTelegramComments(postId);
  const config = getConfig()

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{getTranslation(lang, 'comments')}</h2>
        <a
          href={`https://t.me/${config.telegram_channel_id}/${postId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded"
        >
          {getTranslation(lang, 'addComment')}
        </a>
      </div>
      <div className="space-y-2">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default TelegramComments;