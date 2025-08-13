import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { mockCategoryRepo, mockProductRepo } from 'src/common/mocks';
import { ProductRepository } from './product.repository';
import { CategoryRepository } from 'src/category/category.repository';

describe('ProductService', () => {
  let service: ProductService;
  let repo: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockProductRepo,
        },
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepo,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get(ProductRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });
});
