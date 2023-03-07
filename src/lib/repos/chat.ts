import { Prisma } from "@prisma/client";
import { prisma } from "lib/db";
// import { ChatMessage } from "@prisma/client";
import { ChatSession, ChatMessage, User } from "types/DTOs";
import { getUser } from "lib/repos/user";

type ChatSessionWithMessages = Prisma.ChatSessionGetPayload<{
  include: {
    messages: {
      include: { sender: true };
    };
    users: {
      include: { user: true };
    };
  };
}>;

const getChatSessionsForUser = async (
  userId: string
): Promise<ChatSession[]> => {
  const sessions: ChatSessionWithMessages[] = await prisma.chatSession.findMany(
    {
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            sender: true,
          },
        },
      },
    }
  );

  return sessions.map((session) => transformChatSession(userId, session));
};

const transformChatSession = (
  userId: string,
  { id, users, messages, lastMessagedAt }: ChatSessionWithMessages
): ChatSession => {
  return {
    id,
    users: users
      .filter((user) => user.userId != userId)
      .map((user) => user.user),
    messages: messages.map((message) => ({
      id: message.id,
      fromId: message.sender.userId,
      message: message.content,
      createdAt: message.createdAt.getTime(),
    })),
    lastMessagedAt: lastMessagedAt.getTime(),
  };
};

const getChatSession = async (
  userId: string,
  otherUserId: string
): Promise<ChatSession | null> => {
  if (
    userId == otherUserId ||
    (await getUser({ id: userId })) == null ||
    (await getUser({ id: otherUserId })) == null
  ) {
    return null;
  }

  let session = await prisma.chatSession.findFirst({
    where: {
      users: {
        every: {
          userId: {
            in: [userId, otherUserId],
          },
        },
      },
    },
    include: {
      users: {
        include: {
          user: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          sender: true,
        },
      },
    },
  });

  if (!session) {
    session = await prisma.chatSession.create({
      data: {
        users: {
          createMany: {
            data: [{ userId: userId }, { userId: otherUserId }],
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            sender: true,
          },
        },
      },
    });
  }

  return transformChatSession(userId, session);
};

const addChatMessage = async (
  message: string,
  sessionId: string,
  senderId: string,
  receiverId: string
): Promise<ChatMessage | null> => {
  if (!message || !sessionId) {
    return null;
  }

  const session = await getChatSession(senderId, receiverId);

  if (!session) {
    return null;
  }

  // console.log(`Sender ID: ${senderId}`);

  const chatSessionUser = await prisma.chatSessionUser.findFirst({
    where: {
      userId: senderId,
    },
  });

  // console.log(`Chat Session User`);
  // console.log(chatSessionUser);

  if (!chatSessionUser) {
    return null;
  }

  try {
    const chatMessage = await prisma.chatMessage.create({
      data: {
        content: message,
        sender: {
          connect: {
            id: chatSessionUser.id,
          },
        },
        session: {
          connect: {
            id: session.id,
          },
        },
      },
      include: {
        sender: true,
      },
    });

    await prisma.chatSession.update({
      where: {
        id: session.id,
      },
      data: {
        lastMessagedAt: chatMessage.createdAt,
      },
    });

    // console.log(chatMessage);

    return {
      id: chatMessage.id,
      fromId: chatMessage.sender.userId,
      message: chatMessage.content,
      createdAt: chatMessage.createdAt.getTime(),
      chatSessionId: chatMessage.sessionId,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export { getChatSessionsForUser, getChatSession, addChatMessage };
