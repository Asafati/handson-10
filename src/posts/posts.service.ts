import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
  ) {}

  async save(post: Posts): Promise<Posts> {
    return await this.postsRepository.save(post);
  }

  async findByUserId(userId: number, page = 1, limit = 10): Promise<Posts[]> {
    return await this.postsRepository.find({
      where: { user_id: userId },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findByUserIdAndPostId(userId: number, postId: number): Promise<Posts> {
    const post = await this.postsRepository.findOne({
      where: { user_id: userId, id: postId },
    });
    if (!post) {
      throw new Error(`Post with ID ${postId} not found for user ID ${userId}`);
    }
    return post;
  }

  async deleteById(id: number): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
