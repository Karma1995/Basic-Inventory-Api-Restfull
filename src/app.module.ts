import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductService } from './business-rule/product/product.service';
import { WareHouseCRUDService } from './business-rule/warehouse/warehouse-crud.service';
import { WareHouseProcessService } from './business-rule/warehouse/ware-house-process.service';
import { InventoryService } from './business-rule/inventory/inventory.service';
import { ProductController } from './application/product/product.controller';
import { WareHouseController } from './application/ware-house/ware-house.controller';
import { Product } from './data/product/product.entity';
import { WareHouse } from './data/warehouse/wareHouse.entity';
import { WareHouseLotProduct } from './data/warehouse/wareHouseLotProduct.entity';
import { WareHouseMovementGroup } from './data/warehouse/wareHouseMovmentGroup.entity';
import { WareHouseStock } from './data/warehouse/wareHouseStock';
import { Inventory } from './data/inventory/inventory.entity';
import { InventoryController } from './application/inventory/inventory.controller';
import { SellService } from './business-rule/sell/sell.service';
import { Sell } from './data/sell/sell.entity';
import { ProductType } from './data/classifiers/productType.entity';
import { WareHouseMovement } from './data/warehouse/wareHouseMovement.entity';
import { SellController } from './application/sell/sell.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'test-inventory-db',
      entities: [__dirname + '/data/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([
      Product,
      WareHouse,
      WareHouseLotProduct,
      WareHouseMovement,
      WareHouseMovementGroup,
      WareHouseStock,
      Inventory,
      ProductType,
      Sell,
    ]),
  ],
  controllers: [
    AppController,
    ProductController,
    WareHouseController,
    InventoryController,
    SellController,
  ],
  providers: [
    AppService,
    ProductService,
    WareHouseCRUDService,
    WareHouseProcessService,
    InventoryService,
    SellService,
  ],
})
export class AppModule {}
