import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

import { 
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";


@Entity({ name: 'product_images' })
export class ProductImage {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('text')
    url: string

    @ManyToOne(
        () => Product,
        product => product.images,
        { onDelete: 'CASCADE' }
    )
    product: Product
}