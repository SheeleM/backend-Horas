import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from "src/user/entities/user.entity";



@Entity()
export class Pregunta {

    @PrimaryGeneratedColumn() // O @PrimaryColumn() si defines el ID manualmente
    id: number;

    @Column()
    pregunta:string;
    
    @OneToMany(() =>User, usuario =>usuario.preguntas)
    usuarioPreguntas: User;

 

}
