import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enquiry } from './enquiry.entity';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Injectable()
export class EnquiriesService {
  constructor(
    @InjectRepository(Enquiry)
    private readonly enquiryRepository: Repository<Enquiry>,
  ) {}

  async create(dto: CreateEnquiryDto): Promise<Enquiry> {
    const enquiry = this.enquiryRepository.create(dto);
    return this.enquiryRepository.save(enquiry);
  }

  async findAll(): Promise<Enquiry[]> {
    return this.enquiryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}

