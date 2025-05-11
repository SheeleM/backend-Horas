import { Module } from '@nestjs/common';

import { HelloWordController } from './HelloWord..controller';

@Module({

  controllers: [HelloWordController],

})
export class HelloWordModule {}