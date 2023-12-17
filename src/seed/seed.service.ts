import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const querryBuilder = this.userRepository.createQueryBuilder();
    await querryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const users = initialData.users;
    // const insertPromises = users.map((user) => this.userRepository.save(user));
    // await Promise.all(insertPromises);

    const insertUsers = users.map((user) =>
      this.userRepository.create({
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      }),
    );
    await this.userRepository.save(insertUsers);
    return insertUsers[0];
  }

  private async insertProducts(user: User) {
    const products = initialData.products;
    const insertPromises = products.map((product) =>
      this.productsService.create(product, user),
    );

    await Promise.all(insertPromises);
  }

  async executeSeed() {
    await this.deleteTables();
    const user = await this.insertUsers();
    await this.insertProducts(user);

    return 'Seed completed';
  }
}
