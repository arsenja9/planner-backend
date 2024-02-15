import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { TaskDto } from './dto/task.dto'

@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) {}

	async getAll(userId: string) {
		return this.prisma.task.findMany({
			where: {
				userId
			}
		})
	}

	async create(dto: TaskDto, userId: string) {
		return this.prisma.task.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId
					}
				},
				name: dto.name
			}
		})
	}

	async update(dto: Partial<TaskDto>, taskId: string) {
		return this.prisma.task.update({
			where: {
				id: taskId,
			},
			data: dto
		});
	}
	async delete(taskId: string) {
		return this.prisma.task.delete({
			where: {
				id: taskId
			}
		})
	}
}
