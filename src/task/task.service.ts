import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await this.taskRepository.findAndCount({
      skip,
      take,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
 
  async taskidgenerator(count: number): Promise<string> {
    const taskid = `task-${count}`;
    return taskid;
  
  }
  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } })
    console.log('id', id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(task: Task): Promise<Task> {
    return this.taskRepository.save(task);
  }

  async update(id: number, task: Task): Promise<Task> {
    await this.taskRepository.update(id, task);
    return this.findOne(id);
  }

  async remove(id: number): Promise<object> {
    await this.taskRepository.delete(id);
    return {};
  }
}
