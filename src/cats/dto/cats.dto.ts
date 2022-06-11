import { IsNotEmpty } from "class-validator";

export class CatsDto {
  @IsNotEmpty()
  name: string

  age: number
}