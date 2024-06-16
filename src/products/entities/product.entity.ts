import { 
    Column,
    Entity,
    OneToMany,
    ManyToOne,
    BeforeUpdate,
    BeforeInsert,
    PrimaryGeneratedColumn
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";


import { ProductImage } from "./productImage.entity";
import { User } from "../../auth/entities/user.entity";



@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: "9b30987e-c252-437c-8142-8943650d214e",
            description: "Product iD",
            uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:  "Product title",
        description: "Product title",
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example:  "$666",
        description: "Product price",
    })
    @Column('float', {
        default:0
    })
    price: number;

    @ApiProperty({
        example: "Anim reprehenderit nulla in anim mollit minim irure commodo",
        description: "Product description",
        default: null
    })
    @Column({
        type:'text',
        nullable: true
    })
    description: string;


    @ApiProperty({
        example: "slug_product_title",
        description: "Product slug",
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string
    
    @ApiProperty({
        example: "10",
        description: "Product stock",
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number

    @ApiProperty({
        example: "['M', 'XL']",
        description: "Product sizes",
    })
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: "Female",
        description: "Product gender",
    })
    @Column('text')
    gender: string

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @ManyToOne(
        () => User,
        user => user.product,
        { eager: true }
    )
    user: User

    @BeforeInsert()
    checkSlugInsert() {
        if ( !this.slug ){
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",' ')          
    }

    @BeforeUpdate()
    checkSlugUpdate() {

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",' ')          
    }

    @OneToMany( 
        () => ProductImage,
        productImage => productImage.product,
        { cascade: true, eager: true }
     )
    images?: ProductImage[]

}
