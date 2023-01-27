import { Controller, Post, Body } from '@nestjs/common';
import { SellCreate } from '../DTO/sell/sell-create.dto';
import { SellService } from '../../business-rule/sell/sell.service';

@Controller('sell')
export class SellController {
  constructor(private sellService: SellService) {}

  @Post()
  register(@Body() sell: SellCreate) {
    return this.sellService.registerSell(sell);
  }
}
