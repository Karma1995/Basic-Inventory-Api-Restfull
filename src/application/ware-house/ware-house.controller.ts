import { WareHouseCRUDService } from '../../business-rule/warehouse/warehouse-crud.service';
import { WareHouseCreate } from '../DTO/wareHouse/wareHouseCreate.dto';
import { WareHouseUpdate } from '../DTO/wareHouse/wareHouseUpdate.dto';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { WareHouseEntry } from '../DTO/wareHouse/wareHouseEntry.dto';
import { WareHouseProcessService } from '../../business-rule/warehouse/ware-house-process.service';
import { WareHouseRetire } from '../DTO/wareHouse/wareHouseRetire.dto';
import { WareHouseTransfer } from '../DTO/wareHouse/wareHouseTransfer.dto';

@Controller('ware-house')
export class WareHouseController {
  constructor(
    private warehouseCrudService: WareHouseCRUDService,
    private wareHouseProcessService: WareHouseProcessService,
  ) {}

  @Get('list')
  list() {
    return this.warehouseCrudService.list();
  }

  @Get(':id')
  find(@Param('id') id: number) {
    return this.warehouseCrudService.show(id);
  }

  @Post()
  create(@Body() wareHouse: WareHouseCreate) {
    return this.warehouseCrudService.create(wareHouse);
  }
  @Put(':id')
  update(@Param('id') id: number, @Body() wareHouse: WareHouseUpdate) {
    return this.warehouseCrudService.update(id, wareHouse);
  }

  @Post('transaction/entry')
  entryProduct(@Body() entry: WareHouseEntry) {
    return this.wareHouseProcessService.entryProduct(entry);
  }

  @Put('transaction/retire')
  retireProduct(@Body() retire: WareHouseRetire) {
    return this.wareHouseProcessService.retireProduct(retire);
  }
  @Put('transaction/transfer')
  transferProduct(@Body() transfer: WareHouseTransfer) {
    return this.wareHouseProcessService.transferProduct(transfer);
  }
}
