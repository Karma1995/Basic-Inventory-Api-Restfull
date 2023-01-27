import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WareHouse } from '../../data/warehouse/wareHouse.entity';
import { WareHouseCreate } from '../../application/DTO/wareHouse/wareHouseCreate.dto';
import { WareHouseShow } from '../../application/DTO/wareHouse/wareHouseShow.dto';
import { WareHouseUpdate } from '../../application/DTO/wareHouse/wareHouseUpdate.dto';
import * as moment from 'moment';

@Injectable()
export class WareHouseCRUDService {
  constructor(
    @InjectRepository(WareHouse)
    private wareHouseRepository: Repository<WareHouse>,
  ) {}

  public async list() {
    return this.listWareHouseToDTO(
      await this.wareHouseRepository.find({
        where: {
          isActive: true,
        },
        relations: {
          typeStockManagement: true,
        },
      }),
    );
  }

  public async show(id: number) {
    return this.wareHouseToDTO(
      await this.wareHouseRepository.findOne({
        where: {
          id,
          isActive: true,
        },
        relations: {
          typeStockManagement: true,
        },
      }),
    );
  }

  public async create(model: WareHouseCreate) {
    if (!model.name) {
      throw new Error('El nombre del almacen es obligatorio');
    }
    if (model.name.trim() == '') {
      throw new Error('El nombre del almacen es obligatorio');
    }
    if (!model.address) {
      throw new Error('La direccion del almacen es obligatorio');
    }
    if (model.address.trim() == '') {
      throw new Error('La direccion del almacen es obligatorio');
    }
    if (!model.typeStockManagementId) {
      throw new Error('El tipo de manejo de stock del almacen es obligatorio');
    }
    if (model.typeStockManagementId <= 0) {
      throw new Error('El tipo de manejo de stock del almacen es invalido');
    }

    return this.wareHouseToDTO(
      await this.wareHouseRepository.save(this.wareHouseFromDTO(model)),
    );
  }

  public async update(id: number, model: WareHouseUpdate) {
    const wareHouse = await this.wareHouseRepository.findOne({
      where: {
        id,
        isActive: true,
      },
      relations: {
        typeStockManagement: true,
      },
    });
    if (!wareHouse) {
      throw new Error('El almacen solicitado ya no existe');
    }
    if (model.name) {
      if (model.name.trim() == '') {
        throw new Error('El nombre es invalido');
      } else {
        wareHouse.name = model.name;
      }
    }
    if (model.address) {
      if (model.address.trim() == '') {
        throw new Error('La direccion es invalida');
      } else {
        wareHouse.address = model.address;
      }
    }
    wareHouse.description = model.description;
    return this.wareHouseToDTO(
      await this.wareHouseRepository.save(
        await this.wareHouseRepository.preload(wareHouse),
      ),
    );
  }

  public async delete(id: number) {
    const wareHouse = await this.wareHouseRepository.findOneBy({
      id,
      isActive: true,
    });

    wareHouse.isActive = false;

    return this.wareHouseToDTO(
      await this.wareHouseRepository.save(
        await this.wareHouseRepository.preload(wareHouse),
      ),
    );
  }

  private wareHouseFromDTO(model: WareHouseCreate): WareHouse {
    return this.wareHouseRepository.create({
      description: model.description,
      name: model.name,
      address: model.address,
      openingDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      isActive: true,
      typeStockManagement: { id: model.typeStockManagementId },
      main: !model.isMain ? false : true,
    });
  }
  private wareHouseToDTO(wareHouse: WareHouse): WareHouseShow {
    return {
      id: wareHouse.id,
      description: wareHouse.description,
      name: wareHouse.name,
      address: wareHouse.address,
      openingDate: wareHouse.openingDate,
      typeStockManagement: {
        id: wareHouse.typeStockManagement.id,
        name: wareHouse.typeStockManagement.description,
      },
    } as WareHouseShow;
  }
  private listWareHouseToDTO(products: WareHouse[]): WareHouseShow[] {
    const list: WareHouseShow[] = [];
    products.forEach((p) => {
      list.push(this.wareHouseToDTO(p));
    });
    return list;
  }
}
