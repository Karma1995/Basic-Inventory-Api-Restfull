import { Controller, Post, Body } from '@nestjs/common';
import { InventoryService } from 'src/business-rule/inventory/inventory.service';
import { InventoryCreate } from '../DTO/inventory/inventory-create.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  getInventory(@Body() inventory: InventoryCreate) {
    return this.inventoryService.makeInventory(inventory);
  }
}
