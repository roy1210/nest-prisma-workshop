import { ApiPageResponse } from './../page/api-page-response.decorator';
import { ProductEntity } from './entities/product.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConnectionArgs } from 'src/page/connection-args.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // 🔐
  @ApiCreatedResponse({ type: ProductEntity })
  async create(@Body() createProductDto: CreateProductDto) {
    return new ProductEntity(
      await this.productsService.create(createProductDto),
    );
  }

  @Get()
  @ApiOkResponse({ type: [ProductEntity] })
  async findAll() {
    const products = await this.productsService.findAll();
    return products.map((product) => new ProductEntity(product));
  }

  @Get('drafts')
  @UseGuards(JwtAuthGuard) // 🔐
  @ApiBearerAuth()
  @ApiOkResponse({ type: [ProductEntity] })
  async findDrafts() {
    const products = await this.productsService.findDrafts();
    return products.map((product) => new ProductEntity(product));
  }

  @Get('page')
  @ApiPageResponse(ProductEntity)
  async findPage(@Query() connectionArgs: ConnectionArgs) {
    return this.productsService.findPage(connectionArgs);
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductEntity })
  async findOne(@Param('id') id: string) {
    return new ProductEntity(await this.productsService.findOne(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // 🔐
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ProductEntity })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await new ProductEntity(
      await this.productsService.update(id, updateProductDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // 🔐
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProductEntity })
  async remove(@Param('id') id: string) {
    return new ProductEntity(await this.productsService.remove(id));
  }
}
