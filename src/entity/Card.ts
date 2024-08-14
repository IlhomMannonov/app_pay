import {Column, Entity} from 'typeorm';
import {BaseEntityFull} from "./template/BaseEntityFull";

@Entity('cards')
export class Card extends BaseEntityFull {


    @Column({type: 'varchar', length: 255, nullable: true})
    card_number!: string;

    @Column({type: 'varchar', nullable: true})
    type!: string;


    @Column({type: 'varchar', length: 255, nullable: true})
    card_name!: string;

    @Column({type: 'decimal', precision: 20, scale: 2, default: 0})
    limit!: number;

    @Column({type: 'decimal', precision: 20, scale: 2, default: 0})
    available_limit!: number;


}
