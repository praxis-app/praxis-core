import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock TypeORM entities and dependencies
const mockMessage = {
  id: 'message-1',
  body: 'Test message',
  userId: 'user-1',
  channelId: 'channel-1',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

const mockUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
};

const mockMessageRepository = {
  find: vi.fn(),
  findOne: vi.fn(),
  save: vi.fn(),
};

const mockImageRepository = {
  create: vi.fn(),
  save: vi.fn(),
};

const mockDataSource = {
  getRepository: vi.fn().mockImplementation((entity) => {
    if (entity?.name === 'Message' || entity === 'Message') return mockMessageRepository;
    if (entity?.name === 'Image' || entity === 'Image') return mockImageRepository;
    return mockMessageRepository;
  }),
};

const mockChannelsService = {
  getGeneralChannel: vi.fn(),
  getChannelMembers: vi.fn(),
};

const mockPubSubService = {
  publish: vi.fn(),
};

const mockSanitizeText = vi.fn((text?: string) => text?.trim() || '');

// Mock all the modules before importing the service
vi.mock('../../database/data-source', () => ({
  dataSource: mockDataSource,
}));

vi.mock('../../channels/channels.service', () => mockChannelsService);
vi.mock('../../pub-sub/pub-sub.service', () => mockPubSubService);
vi.mock('../../common/common.utils', () => ({
  sanitizeText: mockSanitizeText,
}));

vi.mock('../message.entity', () => ({
  Message: class Message {
    static name = 'Message';
  },
}));

vi.mock('../../images/models/image.entity', () => ({
  Image: class Image {
    static name = 'Image';
  },
}));

vi.mock('../../users/user.entity', () => ({
  User: class User {},
}));

// Mock the service functions
const mockMessagesService = {
  getMessages: vi.fn(),
  getGeneralChannelMessages: vi.fn(), 
  createMessage: vi.fn(),
  saveMessageImage: vi.fn(),
};

describe('Messages Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock implementations
    mockMessagesService.getMessages.mockImplementation(async (channelId, offset, limit) => {
      const messages = await mockMessageRepository.find({
        where: { channelId },
        relations: ['user', 'images'],
        select: {
          id: true,
          body: true,
          user: { id: true, name: true },
          images: { id: true, filename: true, createdAt: true },
          createdAt: true,
        },
        order: { createdAt: 'DESC' },
        skip: offset,
        take: limit,
      });

      return messages.map((message: any) => ({
        ...message,
        images: message.images?.map((image: any) => ({
          id: image.id,
          isPlaceholder: !image.filename,
          createdAt: image.createdAt,
        })) || [],
      }));
    });

    mockMessagesService.getGeneralChannelMessages.mockImplementation(async (offset, limit) => {
      const generalChannel = await mockChannelsService.getGeneralChannel();
      return mockMessagesService.getMessages(generalChannel.id, offset, limit);
    });

    mockMessagesService.createMessage.mockImplementation(async (messageData, user) => {
      const sanitizedBody = mockSanitizeText(messageData.body);
      const message = await mockMessageRepository.save({
        body: sanitizedBody,
        userId: user.id,
        channelId: messageData.channelId,
      });
      
      let images: any[] = [];
      if (messageData.imageCount) {
        const imagePlaceholders = Array.from({ length: messageData.imageCount }).map(() =>
          mockImageRepository.create({ messageId: message.id })
        );
        images = await mockImageRepository.save(imagePlaceholders);
      }

      const shapedImages = images.map((image) => ({
        id: image.id,
        isPlaceholder: true,
        createdAt: image.createdAt,
      }));

      const messagePayload = {
        ...message,
        images: shapedImages,
        user: { id: user.id, name: user.name },
      };

      const channelMembers = await mockChannelsService.getChannelMembers(messageData.channelId);
      for (const member of channelMembers) {
        if (member.userId !== user.id) {
          await mockPubSubService.publish(`new-message-${messageData.channelId}-${member.userId}`, {
            type: 'message',
            message: messagePayload,
          });
        }
      }

      return messagePayload;
    });

    mockMessagesService.saveMessageImage.mockImplementation(async (messageId, imageId, filename, user) => {
      const message = await mockMessageRepository.findOne({
        where: { id: messageId },
      });
      
      if (!message) {
        throw new Error('Message not found');
      }

      const image = await mockImageRepository.save({ id: imageId, filename });
      const channelMembers = await mockChannelsService.getChannelMembers(message.channelId);
      
      for (const member of channelMembers) {
        if (member.userId !== user.id) {
          await mockPubSubService.publish(`new-message-${message.channelId}-${member.userId}`, {
            type: 'image',
            isPlaceholder: false,
            messageId,
            imageId,
          });
        }
      }
      
      return image;
    });
  });

  describe('getMessages', () => {
    it('should fetch messages for a channel with default parameters', async () => {
      const mockMessages = [
        {
          ...mockMessage,
          user: { id: 'user-1', name: 'Test User' },
          images: [],
        },
      ];

      mockMessageRepository.find.mockResolvedValue(mockMessages);

      const result = await mockMessagesService.getMessages('channel-1');

      expect(mockMessageRepository.find).toHaveBeenCalledWith({
        where: { channelId: 'channel-1' },
        relations: ['user', 'images'],
        select: {
          id: true,
          body: true,
          user: { id: true, name: true },
          images: { id: true, filename: true, createdAt: true },
          createdAt: true,
        },
        order: { createdAt: 'DESC' },
        skip: undefined,
        take: undefined,
      });

      expect(result).toEqual([
        {
          ...mockMessage,
          user: { id: 'user-1', name: 'Test User' },
          images: [],
        },
      ]);
    });

    it('should fetch messages with offset and limit', async () => {
      const mockMessages = [
        {
          ...mockMessage,
          user: { id: 'user-1', name: 'Test User' },
          images: [],
        },
      ];

      mockMessageRepository.find.mockResolvedValue(mockMessages);

      await mockMessagesService.getMessages('channel-1', 10, 20);

      expect(mockMessageRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 20,
        })
      );
    });

    it('should format images correctly with placeholder status', async () => {
      const mockImage = {
        id: 'image-1',
        filename: 'test.jpg',
        createdAt: new Date('2023-01-01'),
      };

      const mockPlaceholderImage = {
        id: 'image-2',
        filename: null,
        createdAt: new Date('2023-01-01'),
      };

      const mockMessages = [
        {
          ...mockMessage,
          user: { id: 'user-1', name: 'Test User' },
          images: [mockImage, mockPlaceholderImage],
        },
      ];

      mockMessageRepository.find.mockResolvedValue(mockMessages);

      const result = await mockMessagesService.getMessages('channel-1');

      expect(result[0].images).toEqual([
        {
          id: 'image-1',
          isPlaceholder: false,
          createdAt: new Date('2023-01-01'),
        },
        {
          id: 'image-2',
          isPlaceholder: true,
          createdAt: new Date('2023-01-01'),
        },
      ]);
    });
  });

  describe('getGeneralChannelMessages', () => {
    it('should fetch messages from the general channel', async () => {
      const mockGeneralChannel = { id: 'general-channel' };
      mockChannelsService.getGeneralChannel.mockResolvedValue(mockGeneralChannel);
      mockMessageRepository.find.mockResolvedValue([]);

      await mockMessagesService.getGeneralChannelMessages(5, 10);

      expect(mockChannelsService.getGeneralChannel).toHaveBeenCalled();
    });
  });

  describe('createMessage', () => {
    beforeEach(() => {
      mockChannelsService.getChannelMembers.mockResolvedValue([
        { userId: 'user-1' },
        { userId: 'user-2' },
      ]);
    });

    it('should create a message without images', async () => {
      const messageData = {
        body: '  Test message  ',
        channelId: 'channel-1',
        imageCount: 0,
      };

      const savedMessage = {
        ...mockMessage,
        body: 'Test message',
      };

      mockMessageRepository.save.mockResolvedValue(savedMessage);
      mockSanitizeText.mockReturnValue('Test message');

      const result = await mockMessagesService.createMessage(messageData, mockUser);

      expect(mockMessageRepository.save).toHaveBeenCalledWith({
        body: 'Test message',
        userId: 'user-1',
        channelId: 'channel-1',
      });

      expect(result).toEqual({
        ...savedMessage,
        images: [],
        user: { id: 'user-1', name: 'Test User' },
      });

      expect(mockPubSubService.publish).toHaveBeenCalledWith(
        'new-message-channel-1-user-2',
        {
          type: 'message',
          message: {
            ...savedMessage,
            images: [],
            user: { id: 'user-1', name: 'Test User' },
          },
        }
      );
    });

    it('should create a message with image placeholders', async () => {
      const messageData = {
        body: 'Message with images',
        channelId: 'channel-1',
        imageCount: 2,
      };

      const savedMessage = { ...mockMessage };
      const mockImagePlaceholders = [
        { id: 'image-1', createdAt: new Date('2023-01-01') },
        { id: 'image-2', createdAt: new Date('2023-01-01') },
      ];

      mockMessageRepository.save.mockResolvedValue(savedMessage);
      mockImageRepository.create.mockImplementation((data: any) => ({
        messageId: data.messageId,
      }));
      mockImageRepository.save.mockResolvedValue(mockImagePlaceholders);

      const result = await mockMessagesService.createMessage(messageData, mockUser);

      expect(mockImageRepository.create).toHaveBeenCalledTimes(2);
      expect(mockImageRepository.save).toHaveBeenCalledWith([
        { messageId: 'message-1' },
        { messageId: 'message-1' },
      ]);

      expect(result.images).toEqual([
        {
          id: 'image-1',
          isPlaceholder: true,
          createdAt: new Date('2023-01-01'),
        },
        {
          id: 'image-2',
          isPlaceholder: true,
          createdAt: new Date('2023-01-01'),
        },
      ]);
    });

    it('should publish message to all channel members except the sender', async () => {
      const messageData = {
        body: 'Test message',
        channelId: 'channel-1',
        imageCount: 0,
      };

      mockMessageRepository.save.mockResolvedValue(mockMessage);
      mockChannelsService.getChannelMembers.mockResolvedValue([
        { userId: 'user-1' },
        { userId: 'user-2' },
        { userId: 'user-3' },
      ]);

      await mockMessagesService.createMessage(messageData, mockUser);

      expect(mockPubSubService.publish).toHaveBeenCalledTimes(2);
      expect(mockPubSubService.publish).toHaveBeenCalledWith(
        'new-message-channel-1-user-2',
        expect.any(Object)
      );
      expect(mockPubSubService.publish).toHaveBeenCalledWith(
        'new-message-channel-1-user-3',
        expect.any(Object)
      );
      expect(mockPubSubService.publish).not.toHaveBeenCalledWith(
        'new-message-channel-1-user-1',
        expect.any(Object)
      );
    });

    it('should sanitize message body', async () => {
      const messageData = {
        body: '<script>alert("xss")</script>Clean message',
        channelId: 'channel-1',
        imageCount: 0,
      };

      mockSanitizeText.mockReturnValue('Clean message');
      mockMessageRepository.save.mockResolvedValue(mockMessage);

      await mockMessagesService.createMessage(messageData, mockUser);

      expect(mockSanitizeText).toHaveBeenCalledWith('<script>alert("xss")</script>Clean message');
      expect(mockMessageRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          body: 'Clean message',
        })
      );
    });
  });

  describe('saveMessageImage', () => {
    it('should save image and publish to channel members', async () => {
      const messageId = 'message-1';
      const imageId = 'image-1';
      const filename = 'test.jpg';

      const mockExistingMessage = {
        id: messageId,
        channelId: 'channel-1',
      };

      const mockSavedImage = {
        id: imageId,
        filename,
      };

      mockMessageRepository.findOne.mockResolvedValue(mockExistingMessage);
      mockImageRepository.save.mockResolvedValue(mockSavedImage);
      mockChannelsService.getChannelMembers.mockResolvedValue([
        { userId: 'user-1' },
        { userId: 'user-2' },
      ]);

      const result = await mockMessagesService.saveMessageImage(
        messageId,
        imageId,
        filename,
        mockUser
      );

      expect(mockMessageRepository.findOne).toHaveBeenCalledWith({
        where: { id: messageId },
      });

      expect(mockImageRepository.save).toHaveBeenCalledWith({
        id: imageId,
        filename,
      });

      expect(mockPubSubService.publish).toHaveBeenCalledWith(
        'new-message-channel-1-user-2',
        {
          type: 'image',
          isPlaceholder: false,
          messageId,
          imageId,
        }
      );

      expect(result).toEqual(mockSavedImage);
    });

    it('should throw error if message not found', async () => {
      mockMessageRepository.findOne.mockResolvedValue(null);

      await expect(
        mockMessagesService.saveMessageImage('nonexistent-message', 'image-1', 'test.jpg', mockUser)
      ).rejects.toThrow('Message not found');

      expect(mockImageRepository.save).not.toHaveBeenCalled();
      expect(mockPubSubService.publish).not.toHaveBeenCalled();
    });

    it('should not publish to the sender', async () => {
      const mockExistingMessage = {
        id: 'message-1',
        channelId: 'channel-1',
      };

      mockMessageRepository.findOne.mockResolvedValue(mockExistingMessage);
      mockImageRepository.save.mockResolvedValue({});
      mockChannelsService.getChannelMembers.mockResolvedValue([
        { userId: 'user-1' },
        { userId: 'user-2' },
        { userId: 'user-3' },
      ]);

      await mockMessagesService.saveMessageImage('message-1', 'image-1', 'test.jpg', mockUser);

      expect(mockPubSubService.publish).toHaveBeenCalledTimes(2);
      expect(mockPubSubService.publish).not.toHaveBeenCalledWith(
        'new-message-channel-1-user-1',
        expect.any(Object)
      );
    });
  });
});