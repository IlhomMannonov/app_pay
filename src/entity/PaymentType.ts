import {Column, Entity} from 'typeorm';
import {BaseEntityFull} from "./template/BaseEntityFull";

@Entity('payment_type')
export class PaymentType extends BaseEntityFull {


    @Column({type: 'varchar', nullable: true})
    name!: string;

    @Column({type: 'varchar', nullable: true})
    type!: string;


    @Column({type: 'text', nullable: true})
    image_url!: string;

    @Column({type: 'text', nullable: true})
    redirect_url!: string;





}
