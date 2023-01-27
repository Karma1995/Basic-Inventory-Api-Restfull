import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../data/product/product.entity';
import { ProductUpdate } from '../../application/DTO/product/productUpdate.dto';
import { ProductCreate } from '../../application/DTO/product/productCreate.dto';
import { ProductShow } from '../../application/DTO/product/productShow.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  public async list() {
    return this.listProductToDTO(
      await this.productRepository.find({
        where: {
          isActive: true,
        },
        relations: {
          unitMeasurament: true,
          type: true,
        },
      }),
    );
  }

  public async show(id: number) {
    return this.productToDTO(
      await this.productRepository.findOne({
        where: {
          id,
          isActive: true,
        },
        relations: {
          unitMeasurament: true,
          type: true,
        },
      }),
    );
  }

  public async create(model: ProductCreate) {
    if (!model.name) {
      throw new Error('El nombre del producto es obligatorio');
    }
    if (model.name.trim() == '') {
      throw new Error('El nombre del producto es obligatorio');
    }
    if (!model.typeId) {
      throw new Error('El tipo del producto es obligatorio');
    }
    if (model.typeId <= 0) {
      throw new Error('El tipo del producto es invalido');
    }
    if (!model.unitMeasuramentId) {
      throw new Error('La unidad de medida del producto es obligatorio');
    }
    if (model.unitMeasuramentId <= 0) {
      throw new Error('La unidad de medida del producto es invalido');
    }

    return this.productToDTO(
      await this.productRepository.save(this.productoFromDTO(model)),
    );
  }

  public async update(id: number, model: ProductUpdate) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        isActive: true,
      },
      relations: {
        type: true,
        unitMeasurament: true,
      },
    });
    if (!product) {
      throw new Error('El producto solicitado ya no existe');
    }
    if (model.name) {
      if (model.name.trim() == '') {
        throw new Error('El nombre es invalido');
      } else {
        product.name = model.name;
      }
    }
    product.description = model.description;
    return this.productToDTO(
      await this.productRepository.save(
        await this.productRepository.preload(product),
      ),
    );
  }

  public async delete(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        isActive: true,
      },
      relations: {
        type: true,
        unitMeasurament: true,
      },
    });
    if (!product) throw new Error('Producto no encontrado');

    product.isActive = false;

    return this.productToDTO(
      await this.productRepository.save(
        await this.productRepository.preload(product),
      ),
    );
  }

  private productoFromDTO(model: ProductCreate): Product {
    return this.productRepository.create({
      description: model.description,
      name: model.name,
      type: { id: model.typeId },
      isActive: true,
      unitMeasurament: { id: model.unitMeasuramentId },
    });
  }
  private productToDTO(product: Product) {
    return {
      id: product.id,
      description: product.description,
      name: product.name,
      type: {
        id: product.type.id,
        name: product.type.description,
      },
      unitMeasurament: {
        id: product.unitMeasurament.id,
        name: product.unitMeasurament.name,
        simbol: product.unitMeasurament.simbol,
      },
    } as ProductShow;
  }
  private listProductToDTO(products: Product[]) {
    const list: ProductShow[] = [];
    products.forEach((p) => {
      list.push(this.productToDTO(p));
    });
    return list;
  }
}
