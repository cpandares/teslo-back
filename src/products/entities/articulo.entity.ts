import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'articulos', schema: 'dbo' })
export class Articulo {
  @PrimaryColumn('int')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  departamento: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  categoria: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  codigo: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descripcion: string | null;

  @Column({ type: 'float', nullable: true })
  cantidad: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cod_departamento: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  unidad_compra: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  empaque: string | null;

  @Column({ type: 'float', nullable: true })
  precio: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cod_barra: string | null;

  @Column({ type: 'float', nullable: true, name: 'PorcImpuesto' })
  porcImpuesto: number | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  composicion: string | null;
}
