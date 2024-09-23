export async function getTelegramComments(postId: string) {
  // 这里应该是实际从Telegram API获取评论的逻辑
  // 为了演示，我们返回一些包含嵌套回复和引用的模拟数据
  const mockComments = [
    {
      id: 1,
      text: '很棒的文章！',
      author: '用户1',
      date: '2023-04-15',
      replies: [
        {
          id: 3,
          text: '谢谢您的评论！',
          author: '作者',
          date: '2023-04-15',
          quote: {
            author: '用户1',
            text: '很棒的文章！',
          },
        },
        {
          id: 4,
          text: '我也觉得很棒！',
          author: '用户3',
          date: '2023-04-16',
        },
      ],
    },
    {
      id: 2,
      text: '学到了很多，谢谢分享。',
      author: '用户2',
      date: '2023-04-16',
      quote: {
        author: '作者',
        text: '文章中的某个段落...',
      },
    },
  ];

  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  return mockComments;
}