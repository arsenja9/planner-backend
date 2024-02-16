import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { PomodoroSessionDto } from './dto/pomodoro.dto'

@Injectable()
export class PomodoroService {
	constructor(private prisma: PrismaService) {}

	async getTodaySession(userId: string) {
		const today = new Date().toISOString().split('T')[0]

		return this.prisma.pomodoroSession.findFirst({
			where: {
				createdAt: {
					gte: new Date(today)
				},
				userId
			},
			include: {
				rounds: {
					orderBy: {
						id: 'asc'
					}
				}
			}
		})
	}

	async create(userId: string) {
		const todaySession = await this.getTodaySession(userId)

		if (todaySession) return todaySession

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				intervalCount: true
			}
		})

		if (!user) throw new NotFoundException('User not found')

		return this.prisma.pomodoroSession.create({
			data: {
				rounds: {
					createMany: {
						data: Array.from({ length: user.intervalCount }, () => ({
							totalSeconds: 0
						}))
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			},
			include: {
				rounds: true
			}
		})
	}

	async update(dto: Partial<PomodoroSessionDto>, pomodoroId: string) {
		return this.prisma.pomodoroSession.update({
			where: {
				id: pomodoroId
			},
			data: dto
		})
	}

	async updateRound(dto: Partial<PomodoroSessionDto>, pomodoroId: string) {
		return this.prisma.pomodoroRound.update({
			where: {
				id: pomodoroId
			},
			data: dto
		})
	}

	async deleteSession(sessionId: string) {
		return this.prisma.pomodoroSession.delete({
			where: {
				id: sessionId
			},
		})
	}
}
