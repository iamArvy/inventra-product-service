import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { mockCategoryRepo, mockProductRepo } from 'src/common/mocks';
import { CategoryRepository } from './category.repository';
import { ProductRepository } from 'src/product/product.repository';

describe('CategoryService', () => {
  let service: CategoryService;
  let repo: jest.Mocked<CategoryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepo,
        },
        {
          provide: ProductRepository,
          useValue: mockProductRepo,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repo = module.get(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });
});
