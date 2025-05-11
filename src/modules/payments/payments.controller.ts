import { Controller, Get, Post, Body, Param, UseGuards, ParseUUIDPipe, Query, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RecordPaymentDto } from './dto/record-payment.dto'; // To be created if manual recording is needed
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/role.constants';
import { AuthenticatedRequest } from '../auth/types/authenticated-request.interface';
import { BillingPaymentStatus } from './entities/billing-payment.entity';

@ApiTags('Billing Payments')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/record')
  @Roles(Role.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Manually record a payment (Admin only)' })
  @ApiResponse({ status: 201, description: 'Payment recorded successfully.', type: PaymentResponseDto })
  async recordPayment(@Body() recordPaymentDto: RecordPaymentDto, @Req() req: AuthenticatedRequest): Promise<PaymentResponseDto> {
    const actingUserId = req.user.userId;
    return this.paymentsService.recordPayment(recordPaymentDto, actingUserId);
  }

  @Get()
  @Roles(Role.PLATFORM_ADMIN, Role.PLATFORM_SUPPORT)
  @ApiOperation({ summary: 'Get all payments (paginated, Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'tenantId', required: false, type: String, format: 'uuid' })
  @ApiQuery({ name: 'status', required: false, enum: BillingPaymentStatus })
  @ApiQuery({ name: 'invoiceId', required: false, type: String, format: 'uuid' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('tenantId') tenantId?: string,
    @Query('status') status?: string,
    @Query('invoiceId') invoiceId?: string,
  ) {
    return this.paymentsService.findAll({ page, limit, tenantId, status, invoiceId });
  }

  @Get('/my')
  @Roles(Role.TENANT_ADMIN, Role.TENANT_USER)
  @ApiOperation({ summary: 'Get payments for the authenticated tenant (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: BillingPaymentStatus })
  async findMyTenantPayments(
    @Req() req: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    const tenantId = req.user.tenantId;
    if (!tenantId) throw new Error('Tenant context not found for user.');
    return this.paymentsService.findAll({ page, limit, tenantId, status });
  }

  @Get(':id')
  @Roles(Role.PLATFORM_ADMIN, Role.PLATFORM_SUPPORT, Role.TENANT_ADMIN)
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment details.', type: PaymentResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest): Promise<PaymentResponseDto> {
    const requestingTenantId = req.user.tenantId;
    return this.paymentsService.findOne(id, requestingTenantId, req.user.roles.includes(Role.PLATFORM_ADMIN));
  }
}