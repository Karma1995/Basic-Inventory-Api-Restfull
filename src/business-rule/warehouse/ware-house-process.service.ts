import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WareHouse } from '../../data/warehouse/wareHouse.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import {
  WareHouseEntry,
  WareHouseEntry_Lot,
} from '../../application/DTO/wareHouse/wareHouseEntry.dto';
import { Product } from '../../data/product/product.entity';
import { WareHouseLotProduct } from '../../data/warehouse/wareHouseLotProduct.entity';
import * as moment from 'moment';
import { WareHouseMovement } from '../../data/warehouse/wareHouseMovement.entity';
import { WareHouseMovementType } from '../../data/classifiers/wareHouseMovementType.entity';
import { WareHouseStockManagement } from '../../data/classifiers/wareHouseStockManagement.entity';
import { WareHouseMovementGroup } from '../../data/warehouse/wareHouseMovmentGroup.entity';
import { WareHouseTransfer } from '../../application/DTO/wareHouse/wareHouseTransfer.dto';
import { WareHouseStock } from '../../data/warehouse/wareHouseStock';
import {
  WareHouseRetire,
  WareHouseRetire_Detail,
} from '../../application/DTO/wareHouse/wareHouseRetire.dto';

@Injectable()
export class WareHouseProcessService {
  constructor(
    @InjectRepository(WareHouse)
    private wareHouseRepository: Repository<WareHouse>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(WareHouseLotProduct)
    private wareHouseLotRepository: Repository<WareHouseLotProduct>,
    @InjectRepository(WareHouseMovementGroup)
    private wareHouseMovementGroupRepo: Repository<WareHouseMovementGroup>,
    @InjectRepository(WareHouseMovement)
    private wareHouseMovementRepo: Repository<WareHouseMovement>,
    @InjectRepository(WareHouseStock)
    private wareHouseStockRepo: Repository<WareHouseStock>,
    private dataSource: DataSource,
  ) {}

  public async entryProduct(
    model: WareHouseEntry,
    isTransfer = false,
    group: WareHouseMovementGroup = null,
    queryRunner: QueryRunner = null,
  ) {
    const wareHouse = await this.wareHouseRepository.findOne({
      where: {
        id: model.wareHouseId,
        isActive: true,
      },
    });
    const usedQuery = queryRunner != null;
    if (!wareHouse) {
      throw new Error('El almacen solicitado no existe');
    }
    const grupedLot = new Map<number, WareHouseEntry_Lot>([]);
    model.Lots.forEach((l) => {
      if (grupedLot.has(l.productId)) {
        throw new Error('Por favor agrege un solo lote por producto');
      } else {
        grupedLot.set(l.productId, l);
      }
    });
    if (queryRunner == null) {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }
    try {
      if (group == null) {
        group = this.wareHouseMovementGroupRepo.create({
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
          wareHouse: { id: wareHouse.id },
        });
        group = await queryRunner.manager.save(group);
      }

      for (const [key, l] of grupedLot) {
        const product = await this.productRepository.findOneBy({
          id: l.productId,
          isActive: true,
        });
        if (!product) {
          throw new Error('No se encuentra el producto solicitado ' + key);
        }
        const stock = await this.getWareHouseStock(
          wareHouse.id,
          product.id,
          queryRunner,
        );
        const lot = this.wareHouseLotRepository.create({
          code: `W${wareHouse.id}-${l.productId}-${Date.now().toString()}`,
          initialCount: l.count,
          currentCount: l.count,
          lastCount: 0,
          unitPrice: l.unitPrice,
          totalValue: l.unitPrice * l.count,
          isActive: true,
          entryDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          exitDate: null,
          productId: l.productId,
          unitMeasuramentId: product.unitMeasuramentId,
          wareHouse,
        });
        const mov = this.wareHouseMovementRepo.create({
          type: {
            id: isTransfer
              ? WareHouseMovementType.values.TRANSFERENCIA_INGRESO
              : WareHouseMovementType.values.INGRESO,
          },
          beforeCount: Number(stock.amount),
          afterCount: Number(stock.amount) + Number(l.count),
          moveCount: l.count,
          unitPrice: l.unitPrice,
          totalPrice: l.unitPrice * l.count,
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
          productId: l.productId,
          unitMeasuramentId: product.unitMeasuramentId,
          wareHouseMovementGroupId: group.id,
          wareHouse,
        });
        stock.amount = Number(stock.amount) + Number(l.count);
        await queryRunner.manager.save(lot);
        await queryRunner.manager.save(mov);
        await queryRunner.manager.save(stock);
      }
      if (!usedQuery) {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }
      const lots = await this.wareHouseLotRepository
        .createQueryBuilder()
        .where(`nWareHouseId = ${wareHouse.id}`)
        .limit(grupedLot.size)
        .orderBy('nWareHouseLotProductId', 'DESC')
        .getMany();

      return lots;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  public async retireProduct(
    model: WareHouseRetire,
    isTransfer = false,
    group: WareHouseMovementGroup = null,
    queryRunner: QueryRunner = null,
  ) {
    const wareHouse = await this.wareHouseRepository.findOne({
      where: {
        id: model.wareHouseId,
        isActive: true,
      },
    });
    const usedQuery = queryRunner != null;
    if (!wareHouse) {
      throw new Error('El alamcen solicitado no existe');
    }
    const grupedLot = new Map<number, WareHouseRetire_Detail>([]);
    model.details.forEach((l) => {
      if (grupedLot.has(l.productId)) {
        throw new Error('Por favor agrege un solo lote por producto');
      } else {
        grupedLot.set(l.productId, l);
      }
    });
    if (queryRunner == null) {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }
    const allLots: WareHouseLotProduct[] = [];

    try {
      if (group == null) {
        group = this.wareHouseMovementGroupRepo.create({
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
          wareHouse: { id: wareHouse.id },
        });
        group = await queryRunner.manager.save(group);
      }
      for (const [key, l] of grupedLot) {
        const product = await this.productRepository.findOneBy({
          id: l.productId,
          isActive: true,
        });
        if (!product) {
          throw new Error('El producto solicitado ya no existe');
        }
        const stock = await this.getWareHouseStock(
          wareHouse.id,
          product.id,
          queryRunner,
        );
        if (stock.amount < l.count) {
          throw new Error(
            `La cantidad a retirar de ${product.name} es mayor a la que hay en stock`,
          );
        }
        let lots: WareHouseLotProduct[] = [];
        if (
          wareHouse.typeStockManagementId ==
          WareHouseStockManagement.values.FIFO
        ) {
          lots = await this.wareHouseLotRepository.find({
            where: {
              productId: l.productId,
              exitDate: null,
            },
            order: {
              entryDate: 'ASC',
            },
          });
        } else {
          lots = await this.wareHouseLotRepository.find({
            where: {
              productId: l.productId,
              exitDate: null,
            },
            order: {
              entryDate: 'DESC',
            },
          });
        }
        let unitPriceGlobal = 0;
        const invariantCount = l.count;
        lots.forEach((lt) => {
          let finish = false;
          allLots.push(lt);
          let removeCount = 0;
          if (lt.currentCount < l.count) {
            l.count -= lt.currentCount;
            removeCount = lt.currentCount;
            lt.lastCount = lt.currentCount;
            lt.currentCount = 0;
            lt.exitDate = moment().format('YYYY-MM-DD HH:mm:ss');
            lt.isActive = false;
          } else {
            const auxtCount = l.count;
            removeCount = auxtCount;
            lt.lastCount = lt.currentCount;
            lt.currentCount -= auxtCount;
            lt.totalValue = lt.currentCount * lt.unitPrice;
            l.count -= auxtCount;
            finish = true;
          }
          unitPriceGlobal +=
            ((removeCount * 100) / invariantCount / 100) * lt.unitPrice;
          if (finish) {
            return false;
          }
        });
        if (l.count > 0) {
          throw new Error(
            `La cantidad a retirar de ${product.name} es mayor a la que hay en stock`,
          );
        }
        const moves = this.wareHouseMovementRepo.create({
          type: {
            id: isTransfer
              ? WareHouseMovementType.values.TRANSFERENCIA_RETIRO
              : WareHouseMovementType.values.RETIRO,
          },
          beforeCount: Number(stock.amount),
          afterCount: Number(stock.amount) - Number(invariantCount),
          moveCount: invariantCount,
          unitPrice: unitPriceGlobal,
          totalPrice: unitPriceGlobal * invariantCount,
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
          productId: l.productId,
          unitMeasuramentId: product.unitMeasuramentId,
          wareHouseMovementGroupId: group.id,
          wareHouse,
        });
        stock.amount -= invariantCount;
        await queryRunner.manager.save(lots);
        await queryRunner.manager.save(moves);
        await queryRunner.manager.save(stock);
      }
      if (!usedQuery) {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }

    return allLots;
  }
  public async transferProduct(model: WareHouseTransfer) {
    const sourceWareHouse = await this.wareHouseRepository.findOneBy({
      id: model.sourceWareHouseId,
      isActive: true,
    });
    const destinationWareHouse = await this.wareHouseRepository.findOneBy({
      id: model.destinationWareHouseId,
      isActive: true,
    });
    if (!sourceWareHouse) {
      throw new Error('Almacen origen no encontrado');
    }
    if (!destinationWareHouse) {
      throw new Error('Almacen destino no encontrado');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let group = this.wareHouseMovementGroupRepo.create({
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        wareHouse: { id: sourceWareHouse.id },
        wareHouseDestinationId: destinationWareHouse.id,
      });
      group = await queryRunner.manager.save(group);

      const details: WareHouseRetire_Detail[] = [];
      model.details.forEach((d) => {
        details.push({
          count: d.count,
          productId: d.productId,
        });
      });
      const lots = await this.retireProduct(
        {
          wareHouseId: sourceWareHouse.id,
          details,
        },
        true,
        group,
        queryRunner,
      );
      const newLots: WareHouseEntry_Lot[] = [];
      model.details.forEach((d) => {
        const auxDetail = lots.filter((l) => l.productId == d.productId);
        let unitPrice = 0;
        auxDetail.forEach((ele) => {
          const rest = ele.lastCount - ele.currentCount;
          const por = (rest * 100) / d.count;
          unitPrice += ele.unitPrice * (por / 100);
        });
        newLots.push({
          count: d.count,
          productId: d.productId,
          unitPrice,
        });
      });
      await this.entryProduct(
        {
          wareHouseId: destinationWareHouse.id,
          Lots: newLots,
        },
        true,
        group,
        queryRunner,
      );
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return true;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
      throw error;
    }
  }

  private async getWareHouseStock(
    wareHouseId: number,
    productId: number,
    querryRunner: QueryRunner = null,
  ): Promise<WareHouseStock> {
    let wareHouseStock = await this.wareHouseStockRepo.findOne({
      where: {
        productId,
        wareHouse: { id: wareHouseId },
      },
    });
    if (!wareHouseStock) {
      const newStock = this.wareHouseStockRepo.create({
        amount: 0,
        productId: productId,
        wareHouse: { id: wareHouseId },
      });
      wareHouseStock = querryRunner
        ? await querryRunner.manager.save(newStock)
        : await this.wareHouseStockRepo.save(newStock);
    }

    return wareHouseStock;
  }
}
