import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
export class PaginationDto {
  page: number;
  limit: number;
}
let count: number = 0;
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('all')
  async findAll(@Query() pagination: PaginationDto): Promise<any> {
    
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    return await this.taskService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Task> {
    return await this.taskService.findOne(id);
  }

  @Post('add')
  async create(@Body() task: Task): Promise<any> {
    count++;
    
    
    const taskid=await this.taskService.taskidgenerator(count)
    task.taskId = taskid;
    const data = await this.taskService.create(task);
    
    return { data: data, message: 'success', status: 'success' };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() task: Task): Promise<Task> {
    return await this.taskService.update(id, task);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<object> {
    return await this.taskService.remove(id);
  }
}
