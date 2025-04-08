import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity({
    name:'products'
})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique:true,
        nullable:false,
    })
    title:string;

    @Column('float',{
        default:0,        
    })
    price:number;

    @Column('text',{
        nullable:true,
    })
    description:string;

    @Column('text', {
        unique:true,

    })
    slug:string;

    @Column('int', {
        default:0,        
    })
    stock:number;

    @Column('text', {
        array:true,
        default:[],        
    })
    sizes: string[];

    @Column('text')
    gender:string;

    
    @Column('text', {
        array:true,
        default:[],        
    })
    tags:string[];


    @OneToMany(
        ()=> ProductImage,
        (productImage) => productImage.product,
        {cascade:true, eager:true} // Eager loading to fetch images with product
    )
    images?: ProductImage[];


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
