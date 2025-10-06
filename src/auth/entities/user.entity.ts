import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: 'varchar',
        length: 255,
        unique:true,
        nullable:false,
    })
    email: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable:false,
        select: false,
    })
    password: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable:false,
    })
    fullName: string

    @Column({
        type: 'bit',
        default: true
    })
    isActive: boolean;

    @Column('simple-array', {
        nullable: true,
    })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user,
        
    )
    product: Product;



    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
        if (!this.roles || this.roles.length === 0) {
            this.roles = ['user'];
        }
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}
