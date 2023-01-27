import { Injectable } from '@nestjs/common';
import { Sell } from '../../data/sell/sell.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SellCreate } from '../../application/DTO/sell/sell-create.dto';
import * as moment from 'moment';
import { SellDetail } from '../../data/sell/sell-detail.entity';
import { WareHouseProcessService } from '../warehouse/ware-house-process.service';
import { WareHouse } from '../../data/warehouse/wareHouse.entity';
import { WareHouseRetire_Detail } from '../../application/DTO/wareHouse/wareHouseRetire.dto';

@Injectable()
export class SellService {
  constructor(
    @InjectRepository(Sell)
    private sellRepo: Repository<Sell>,
    @InjectRepository(WareHouse)
    private wareHouseRepo: Repository<WareHouse>,
    private wareHouseService: WareHouseProcessService,
    private dataSource: DataSource,
  ) {}

  async registerSell(model: SellCreate) {
    const querryRunner = this.dataSource.createQueryRunner();
    await querryRunner.connect();
    await querryRunner.startTransaction();
    try {
      const sell = this.sellRepo.create({
        addicionalDiscount: model.addicionalDiscount,
        currencyId: model.currencyId,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        paymentTypeId: model.paymentTypeId,
        details: [],
      });

      let total = 0;
      model.details.forEach((d) => {
        const subTotal = d.count * d.unitPrice - d.discountAmount;
        sell.details.push({
          count: d.count,
          discountAmount: d.discountAmount,
          productId: d.productId,
          unitPrice: d.unitPrice,
          subTotalAmount: subTotal,
        } as SellDetail);
        total += subTotal;
      });

      sell.totalAmount = total;
      sell.ivaCharge = (total - sell.addicionalDiscount) * 0.13;
      sell.totalPaymentAmount =
        total - sell.addicionalDiscount + sell.ivaCharge;
      await querryRunner.manager.save(sell);
      const wareHouse = await this.wareHouseRepo.findOneBy({ main: true });

      await this.wareHouseService.retireProduct(
        {
          wareHouseId: wareHouse.id,
          details: sell.details.map((d) => {
            return {
              count: d.count,
              productId: d.productId,
            } as WareHouseRetire_Detail;
          }),
        },
        false,
        null,
        querryRunner,
      );
      await querryRunner.commitTransaction();
      await querryRunner.release();

      return sell;
    } catch (error) {
      querryRunner.rollbackTransaction();
      querryRunner.release();
      throw error;
    }
  }
}
