import axios from 'axios';

const TELEGRAM_BOT_TOKEN = "7562224843:AAEzzfcoLsygc-XFRATGLX5aOxTKWIacSAk";
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function getTelegramComments(postId: string) {
  // 这里应该是实际从Telegram API获取评论的逻辑
  // 为了演示，我们返回一些包含嵌套回复和引用的模拟数据
  // const mockComments = [
  //   {
  //     id: 1,
  //     text: '很棒的文章！',
  //     author: '用户1',
  //     date: '2023-04-15',
  //     replies: [
  //       {
  //         id: 3,
  //         text: '谢谢您的评论！',
  //         author: '作者',
  //         date: '2023-04-15',
  //         quote: {
  //           author: '用户1',
  //           text: '很棒的文章！',
  //         },
  //       },
  //       {
  //         id: 4,
  //         text: '我也觉得很棒！',
  //         author: '用户3',
  //         date: '2023-04-16',
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     text: '学到了很多，谢谢分享。',
  //     author: '用户2',
  //     date: '2023-04-16',
  //     quote: {
  //       author: '作者',
  //       text: '文章中的某个段落...',
  //     },
  //   },
  // ];

  // 模拟API调用延迟
  // await new Promise(resolve => setTimeout(resolve, 1000));

  return getMessageReplies("@zsai0101", 18)
}

export async function getChannelMessages(channelUsername: string, limit: number = 10) {
  try {
    const response = await axios.get(`${TELEGRAM_API_BASE}/getUpdates`, {
      params: { chat_id: channelUsername, limit }
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching channel messages:', error);
    return [];
  }
}

export async function getMessageReplies(channelUsername: string, messageId: number) {
  try {
    const response = await axios.get(`${TELEGRAM_API_BASE}/getReplies`, {
      params: { chat_id: channelUsername, message_id: messageId }
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching message replies:', error);
    return [];
  }
}