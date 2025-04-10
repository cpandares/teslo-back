import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

@Entity({
    name:'products'
})
export class Product {

    @ApiProperty({
        example:'12345678-1234-1234-1234-123456789012',
        description:'Unique identifier for the product',
        uniqueItems:true,
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty({
        example:'T-Shirt with cool design',
        description:'Title of the product',
        uniqueItems:true,
    })
    @Column('text',{
        unique:true,
        nullable:false,
    })
    title:string;

    @ApiProperty({
        example:100,
        description:'Price of the product',
        default:0,
    })
    @Column('float',{
        default:0,        
    })
    price:number;

    @ApiProperty({
        example:'This is a cool t-shirt with a unique design',
        description:'Description of the product',
        nullable:true,
    })
    @Column('text',{
        nullable:true,
    })
    description:string;

    @ApiProperty({
        example:'cool_tshirt',
        description:'Slug for the product, used for SEO and URL purposes',
        uniqueItems:true,
    })
    @Column('text', {
        unique:true,

    })
    slug:string;

    @ApiProperty({
        example:10,
        description:'Stock quantity of the product',
        default:0,
    })
    @Column('int', {
        default:0,        
    })
    stock:number;

    @ApiProperty({
        example:'M',
        description:'Sizes available for the product',
        default:[],
        isArray:true,
    })
    @Column('text', {
        array:true,
        default:[],        
    })
    sizes: string[];

    @ApiProperty({
        example:'M',

    })
    @Column('text')
    gender:string;

    @ApiProperty({
        example:'tshirt, cool, fashion',
        description:'Tags for the product, used for SEO and filtering',
        default:[],
        isArray:true,
    })
    @Column('text', {
        array:true,
        default:[],        
    })
    tags:string[];


    @ApiProperty()
    @OneToMany(
        ()=> ProductImage,
        (productImage) => productImage.product,
        {cascade:true, eager:true} // Eager loading to fetch images with product
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager:true, onDelete:'SET NULL' } // Eager loading to fetch user with product
    )
    user: User;


    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug || this.slug.length === 0){
            this.slug = this.title;
        }

        this.slug = this.slug.toLowerCase()
                            .replaceAll(' ', '_')
                            .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        if(!this.slug || this.slug.length === 0){
            this.slug = this.title;
        }

        this.slug = this.slug.toLowerCase()
                            .replaceAll(' ', '_')
                            .replaceAll("'", '');
    }

}
