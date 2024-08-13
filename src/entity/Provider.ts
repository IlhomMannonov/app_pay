import {Column, Entity} from 'typeorm';
import {BaseEntityFull} from "./template/BaseEntityFull";

@Entity('provider')
export class Provider extends BaseEntityFull {


    @Column({type: 'varchar', nullable: true})
    name!: string;

    @Column({type: 'text', nullable: true})
    get_data_url!: string;

    @Column({type: 'text', nullable: true})
    post_data_url!: string;

    @Column({type: 'decimal', precision: 10, scale: 2, default: 0})
    min_amount!: number;

    @Column({type: 'decimal', precision: 10, scale: 2, default: 0})
    max_amount!: number;

    @Column({type: 'varchar', length: 255, nullable: true})
    currency!: string;

    @Column({type: 'text', nullable: true})
    image_url!: string;


}
