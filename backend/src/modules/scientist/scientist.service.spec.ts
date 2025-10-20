import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ScientistService } from './scientist.service';

describe('ScientistService', () => {
  let service: ScientistService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScientistService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ScientistService>(ScientistService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseMonth', () => {
    it('should parse month names correctly', () => {
      expect(service['parseMonth']('Jan')).toBe(1);
      expect(service['parseMonth']('December')).toBe(12);
      expect(service['parseMonth']('May')).toBe(5);
      expect(service['parseMonth'](5)).toBe(5);
      expect(service['parseMonth']('13')).toBe(13);
      expect(service['parseMonth']('invalid')).toBe(0);
    });
  });
});
