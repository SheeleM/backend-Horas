import { Controller, Get, SetMetadata } from '@nestjs/common';
import { Public } from 'src/login/login.controller';


@Controller('HelloWord')
export class HelloWordController {

      constructor() {}

  @Public()
  @Get()
  findAll(): string {    
    console.log("Hello World");
    return "Hello World";
  }
}
