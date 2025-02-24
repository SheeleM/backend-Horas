import { userInfo } from "node:os";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Rol {
 
    
@PrimaryGeneratedColumn()
  idRol:number;

@Column()
  nombre:string;

  @Column()
  descripcion:string;

  @Column()
  creacion:string;

  @Column()
  actualizado:string;

  @OneToMany(() =>User, user =>user.rol)
  rolUser:User;
  
}
