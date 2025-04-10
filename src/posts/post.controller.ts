import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Request } from 'express';
import { CreatePostDTO } from './create-posts.dto';
import { Posts } from './post.entity';
import { jwtPayload } from '../auth/dto/jwt-payload.dto';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  async create(@Req() request: Request, @Body() dto: CreatePostDTO) {
    const userJwt: jwtPayload = request['user'];
    const post = new Posts();
    post.content = dto.content;
    post.image_url = dto.image_url;
    post.title = dto.title;
    post.user_id = userJwt.sub;
    return await this.postService.save(post);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Req() request: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
      return await this.postService.findByUserId(
        request['user'].sub,
        page,
        limit,
      );
    }
  }   
   
