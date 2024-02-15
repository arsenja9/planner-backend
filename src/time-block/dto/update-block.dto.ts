import { IsArray, IsString } from 'class-validator'

export class UpdateBlockDto {
	@IsArray()
	@IsString({ each: true })
	ids: string[]
}


