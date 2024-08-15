import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {BaseEntityFull} from "./template/BaseEntityFull";
import {User} from "./User";
import {PaymentType} from "./PaymentType";
import {Provider} from "./Provider";
import {Card} from "./Card";

@Entity('transaction')
export class Transaction extends BaseEntityFull {


    @Column({type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true})
    amount!: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    user!: User;

    @Column({name: 'user_id', nullable: true})
    user_id!: number; // Foreign key sifatida saqlanadi


    @ManyToOne(() => PaymentType, payment_type => payment_type.id)
    @JoinColumn({name: 'payment_type_id'})
    payment_type!: PaymentType;

    @Column({name: 'payment_type_id', nullable: true})
    payment_type_id!: number; // Foreign key sifatida saqlanadi


    @ManyToOne(() => Provider, provider => provider.id)
    @JoinColumn({name: 'provider_id'})
    provider!: Provider;

    @Column({name: 'provider_id', nullable: true})
    provider_id!: number;

    @ManyToOne(() => Card, card => card.id)
    @JoinColumn({name: 'card_id'})
    card!: Card;

    @Column({name: 'card_id', nullable: true})
    card_id!: number;

    @Column({name: 'account_id', nullable: true})
    account_id!: number;


}
