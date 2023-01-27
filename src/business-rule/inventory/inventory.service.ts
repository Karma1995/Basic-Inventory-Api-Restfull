import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '../../data/inventory/inventory.entity';
import { Repository, DataSource, In, Between } from 'typeorm';
import { InventoryCreate } from '../../application/DTO/inventory/inventory-create.dto';
import * as moment from 'moment';
import { ProductType } from '../../data/classifiers/productType.entity';
import { Product } from '../../data/product/product.entity';
import { WareHouseMovement } from '../../data/warehouse/wareHouseMovement.entity';
import { WareHouseMovementType } from '../../data/classifiers/wareHouseMovementType.entity';
import {
  InventoryShow,
  InventoryShow_Detail,
} from '../../application/DTO/inventory/inventory-show.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
    @InjectRepository(ProductType)
    private porductTypeRepo: Repository<ProductType>,
    @InjectRepository(Product)
    private porductRepo: Repository<Product>,
    @InjectRepository(WareHouseMovement)
    private wareHouseMovementRepo: Repository<WareHouseMovement>,
  ) {}

  async makeInventory(model: InventoryCreate) {
    if (!model.stratDate || !model.endDate) {
      model.stratDate = moment().format('YYYY-MM-DD') + ' 00:00:00';
      model.endDate = moment().format('YYYY-MM-DD HH:mm:ss');
    } else {
      if (!moment(model.stratDate, 'YYYY-MM-DD HH:mm:ss').isValid()) {
        throw new Error('Fecha de inicio invalida');
      }
      if (!moment(model.endDate, 'YYYY-MM-DD HH:mm:ss').isValid()) {
        throw new Error('Fecha de fin invalida');
      }
    }
    if (!model.typesOfProduct) {
      const types = await this.porductTypeRepo.find();
      model.typesOfProduct = [];
      types.forEach((t) => {
        model.typesOfProduct.push(t.id);
      });
    } else {
      model.typesOfProduct.forEach((t) => {
        const product = this.porductTypeRepo.findOneBy({
          id: t,
          isActive: true,
        });
        if (!product) {
          throw new Error('Uno o varios productos seleccionados no existen');
        }
      });
    }

    const inventory = this.inventoryRepo.create({
      initialDate: model.stratDate,
      endDate: model.endDate,
      description: model.description,
      productType: JSON.stringify(model.typesOfProduct),
      details: [],
    });

    const products = await this.porductRepo.findBy({
      type: { id: In(model.typesOfProduct) },
      isActive: true,
    });
    let totalAddedPrice = 0;
    let totalRemovedPrice = 0;
    for (const p of products) {
      const movements = await this.wareHouseMovementRepo.find({
        where: {
          productId: p.id,
          date: Between(model.stratDate, model.endDate),
          wareHouse: { id: model.wareHouseId },
        },
      });
      let added = 0;
      let removed = 0;
      let priceAdded = 0;
      let priceRemoved = 0;
      for (const m of movements) {
        if (
          m.typeId == WareHouseMovementType.values.INGRESO ||
          m.typeId == WareHouseMovementType.values.TRANSFERENCIA_INGRESO
        ) {
          added += Number(m.moveCount);
          priceAdded += Number(m.unitPrice);
        } else {
          removed += Number(m.moveCount);
          priceRemoved += Number(m.unitPrice);
        }
      }
      inventory.details.push({
        productId: p.id,
        totalAmountAdded: added,
        totalAmountRemoved: removed,
        totalAmount: added - removed,
        subTotalValueAdded: priceAdded,
        subTotalValueRemoved: priceRemoved,
        subTotalValue: priceAdded - priceRemoved,
        unitMeasuramentId: p.unitMeasuramentId,
        id: null,
        inventory: null,
      });
      totalAddedPrice += priceAdded;
      totalRemovedPrice += priceRemoved;
    }
    inventory.totalValueAdded = totalAddedPrice;
    inventory.totalValueRemoved = totalRemovedPrice;
    inventory.totalValue = totalAddedPrice - totalRemovedPrice;
    this.inventoryRepo.save(inventory);

    return this.entityToDTO(inventory);
  }

  private async entityToDTO(inventory: Inventory) {
    const details: InventoryShow_Detail[] = [];
    const types: string[] = [];
    for (const d of inventory.details) {
      const product = await this.porductRepo.findOne({
        where: {
          id: d.productId,
        },
        relations: {
          unitMeasurament: true,
          type: true,
        },
      });
      if (!types.find((t) => t == product.type.description)) {
        types.push(product.type.description);
      }
      details.push({
        product: {
          name: product.name,
          id: product.id,
        },
        unitMeasurament: {
          name: product.unitMeasurament.simbol,
          id: product.unitMeasurament.id,
        },
        subTotalValue: d.subTotalValue,
        subTotalValueAdded: d.subTotalValueAdded,
        subTotalValueRemoved: d.subTotalValueRemoved,
        totalAmount: d.totalAmount,
        totalAmountAdded: d.totalAmountAdded,
        totalAmountRemoved: d.totalAmountRemoved,
      });
    }

    return {
      description: inventory.description,
      endDate: inventory.endDate,
      startDate: inventory.initialDate,
      productTypesNames: types,
      totalValue: inventory.totalValue,
      totalValueAdded: inventory.totalValueAdded,
      totalValueRemoved: inventory.totalValueRemoved,
      id: inventory.id,
      details,
    } as InventoryShow;
  }
}
