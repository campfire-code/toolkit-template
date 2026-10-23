import { describe, expect, it } from 'vitest';
import { fitSize, formatBytes, outputName, sizeChange } from './core';

describe('outputName', () => {
  it('换扩展名', () => expect(outputName('主图-01.PNG', 'webp')).toBe('主图-01.webp'));
  it('没有扩展名也能处理', () => expect(outputName('README', 'jpg')).toBe('README.jpg'));
  it('以点开头的文件名不截断', () => expect(outputName('.hidden', 'png')).toBe('.hidden.png'));
  it('加后缀', () => expect(outputName('a.b.jpg', 'jpg', '-压缩')).toBe('a.b-压缩.jpg'));
});

describe('fitSize', () => {
  it('不缩放', () => expect(fitSize(800, 600, 0)).toEqual([800, 600]));
  it('小图不放大', () => expect(fitSize(800, 600, 1200)).toEqual([800, 600]));
  it('按最长边等比缩小', () => expect(fitSize(4000, 3000, 1200)).toEqual([1200, 900]));
  it('竖图', () => expect(fitSize(1080, 1920, 960)).toEqual([540, 960]));
});

describe('大小显示', () => {
  it('单位', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2 KB');
    expect(formatBytes(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });
  it('变化', () => {
    expect(sizeChange(1024 * 1024, 256 * 1024)).toBe('1.0 MB → 256 KB（小了 75%）');
    expect(sizeChange(1000, 1200)).toBe('1000 B → 1 KB（大了 20%）');
  });
});
