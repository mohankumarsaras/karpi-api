import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'API Health status check' })
  check() {
    return {
      status: 'ok',
      service: 'karpi-api',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}

