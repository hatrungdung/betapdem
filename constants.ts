import { Option } from './types';

export const LIMIT_OPTIONS: Option<number>[] = [
  { label: 'Trăm', value: 100 },
  { label: 'Ngàn', value: 1000 },
  { label: 'Triệu', value: 1000000 },
  { label: 'Tỷ', value: 1000000000 },
];

export const STEP_OPTIONS: Option<number>[] = [
  { label: '1', value: 1 },
  { label: '10', value: 10 },
  { label: '100', value: 100 },
  { label: '1,000', value: 1000 },
  { label: '10,000', value: 10000 },
];

export const FONT_OPTIONS: Option<string>[] = [
  { label: 'Vui Vẻ', value: 'font-fredoka' },
  { label: 'Đồng Hồ', value: 'font-orbitron' },
  { label: 'Hoạt Họa', value: 'font-luckiest-guy' },
];