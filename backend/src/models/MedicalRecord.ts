// src/models/MedicalRecord.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Doctor } from './Doctor';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @ManyToOne(() => Doctor, { nullable: false })
  doctor!: Doctor;

  @Column({ nullable: true })
  arvRegimen?: string;

  @Column({ nullable: true, type: 'int' })
  cd4?: number;

  @Column({ nullable: true, type: 'int' })
  hivViralLoad?: number;

  @Column({ nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
export {};
