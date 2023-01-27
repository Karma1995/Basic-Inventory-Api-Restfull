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
import { ProductService } from '../../business-rule/product/product.service';
import { ProductCreate } from '../DTO/product/productCreate.dto';
import { ProductUpdate } from '../DTO/product/productUpdate.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('list')
  list() {
    return this.productService.list();
  }

  @Get(':id')
  find(@Param('id', new ParseIntPipe()) id: number) {
    return this.productService.show(id);
  }
  @Post()
  create(@Body() data: ProductCreate) {
    return this.productService.create(data);
  }
  @Put(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: ProductUpdate,
  ) {
    return this.productService.update(id, data);
  }
  @Delete(':id')
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.productService.delete(id);
  }
}
