import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
// @Auth(ValidRoles.ADMIN) // Here we are using the Auth decorator to protect all routes in controller
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Seed executed' })
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
