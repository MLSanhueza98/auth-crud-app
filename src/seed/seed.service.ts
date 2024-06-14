import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  
  constructor(
    private readonly productService: ProductsService,
    
    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ) {}
  

  async runSeed() {
    await this.deleteTables()
    const adminUsers  = await this.insertNewUsers()
    await this.insertNewProducts( adminUsers )
    return 'Seed Executed'
  }

  private async deleteTables() {

    await this.productService.deleteAllProducts()

    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder
      .delete()
      .where({})
      .execute()
  }


  private async insertNewUsers() {
    
    const seedUsers = initialData.users
    const users: User[] = []

    seedUsers.forEach( user => {
      users.push( this.userRepository.create( user ))
    })

    const dbUsers = await this.userRepository.save( seedUsers )
    return dbUsers[0]
  }


  private async insertNewProducts( user: User ) {

    await this.productService.deleteAllProducts()

    const products = initialData.products
    const insertPromises = []

    products.forEach( product => {
      insertPromises.push(this.productService.create( product, user ))
    })

    await Promise.all( insertPromises )
    return true
  }
}
