import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock all the modules before importing the service
vi.mock('../../database/data-source', () => {
  const mockMessageRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    save: vi.fn(),
  };

  const mockImageRepository = {
    create: vi.fn(),
    save: vi.fn(),
  };

  return {
    dataSource: {
      getRepository: vi.fn().mockImplementation((entity) => {
        if (entity?.name === 'Message' || entity === 'Message') {
          return mockMessageRepository;
        }
        if (entity?.name === 'Image' || entity === 'Image') {
          return mockImageRepository;
        }
        return mockMessageRepository;
      }),
    },
  };
});

vi.mock('../../channels/channels.service', () => ({
  getGeneralChannel: vi.fn(),
  getChannelMembers: vi.fn(),
}));

vi.mock('../../pub-sub/pub-sub.service', () => ({
  publish: vi.fn(),
}));

vi.mock('../../common/common.utils', () => ({
  sanitizeText: vi.fn((text?: string) => text?.trim() || ''),
}));

vi.mock('../message.entity', () => ({
  Message: function Message() {},
}));

vi.mock('../../images/models/image.entity', () => ({
  Image: function Image() {},
}));

vi.mock('../../users/user.entity', () => ({
  User: function User() {},
}));

// Import the service after mocks
import * as channelsService from '../../channels/channels.service';
import { sanitizeText } from '../../common/common.utils';
import { dataSource } from '../../database/data-source';
import * as pubSubService from '../../pub-sub/pub-sub.service';
import * as messagesService from '../messages.service';

// Mock data constants
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
  displayName: 'Test User',
  email: 'test@example.com',
  password: null,
  bio: null,
  anonymous: false,
  locked: false,
  proposals: [],
  votes: [],
  messages: [],
  channelMembers: [],
  roles: [],
  invites: [],
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
} as any;

describe('Messages Service', () => {
  let mockMessageRepository: any;
  let mockImageRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Get the mocked repositories
    mockMessageRepository = vi.mocked(dataSource.getRepository)('Message');
    mockImageRepository = vi.mocked(dataSource.getRepository)('Image');
  });

  describe('getMessages', () => {
    it('should fetch messages for a channel and format them correctly', async () => {
      const mockMessages = [
        {
          ...mockMessage,
          user: { id: 'user-1', name: 'Test User' },
          images: [
            {
              id: 'image-1',
              filename: 'test.jpg',
              createdAt: new Date('2023-01-01'),
            },
            {
              id: 'image-2',
              filename: null,
              createdAt: new Date('2023-01-01'),
            },
          ],
        },
      ];

      mockMessageRepository.find.mockResolvedValue(mockMessages);

      const result = await messagesService.getMessages('channel-1', 10, 20);

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
        skip: 10,
        take: 20,
      });

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

  describe('createMessage', () => {
    it('should create a message with image placeholders and publish to channel members', async () => {
      const messageData = {
        body: '  Test message  ',
        channelId: 'channel-1',
        imageCount: 2,
      };

      const savedMessage = {
        ...mockMessage,
        body: 'Test message',
      };

      const mockImagePlaceholders = [
        { id: 'image-1', createdAt: new Date('2023-01-01') },
        { id: 'image-2', createdAt: new Date('2023-01-01') },
      ];

      mockMessageRepository.save.mockResolvedValue(savedMessage);
      mockImageRepository.create.mockImplementation((data: any) => ({
        messageId: data.messageId,
      }));
      mockImageRepository.save.mockResolvedValue(mockImagePlaceholders);
      vi.mocked(sanitizeText).mockReturnValue('Test message');
      vi.mocked(channelsService.getChannelMembers).mockResolvedValue([
        {
          id: 'member-1',
          userId: 'user-1',
          channelId: 'channel-1',
          lastMessageReadId: null,
          user: mockUser,
          channel: {} as any,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        } as any,
        {
          id: 'member-2',
          userId: 'user-2',
          channelId: 'channel-1',
          lastMessageReadId: null,
          user: {} as any,
          channel: {} as any,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        } as any,
      ]);

      const result = await messagesService.createMessage(messageData, mockUser);

      expect(sanitizeText).toHaveBeenCalledWith('  Test message  ');
      expect(mockMessageRepository.save).toHaveBeenCalledWith({
        body: 'Test message',
        userId: 'user-1',
        channelId: 'channel-1',
      });

      expect(mockImageRepository.create).toHaveBeenCalledTimes(2);
      expect(result.images).toHaveLength(2);
      expect(result.images[0].isPlaceholder).toBe(true);

      expect(pubSubService.publish).toHaveBeenCalledWith(
        'new-message-channel-1-user-2',
        {
          type: 'message',
          message: expect.objectContaining({
            body: 'Test message',
            user: { id: 'user-1', name: 'Test User' },
          }),
        },
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
      vi.mocked(channelsService.getChannelMembers).mockResolvedValue([
        {
          id: 'member-1',
          userId: 'user-1',
          channelId: 'channel-1',
          lastMessageReadId: null,
          user: mockUser,
          channel: {} as any,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        } as any,
        {
          id: 'member-2',
          userId: 'user-2',
          channelId: 'channel-1',
          lastMessageReadId: null,
          user: {} as any,
          channel: {} as any,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        } as any,
      ]);

      const result = await messagesService.saveMessageImage(
        messageId,
        imageId,
        filename,
        mockUser,
      );

      expect(mockMessageRepository.findOne).toHaveBeenCalledWith({
        where: { id: messageId },
      });

      expect(mockImageRepository.save).toHaveBeenCalledWith({
        id: imageId,
        filename,
      });

      expect(pubSubService.publish).toHaveBeenCalledWith(
        'new-message-channel-1-user-2',
        {
          type: 'image',
          isPlaceholder: false,
          messageId,
          imageId,
        },
      );

      expect(result).toEqual(mockSavedImage);
    });
  });
});
