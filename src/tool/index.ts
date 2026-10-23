// 工具声明：图片批量压缩 / 转格式（在本机用浏览器引擎完成，不联网）。
import type { BatchTool } from '../kit/types';
import { MIME, fitSize, outputName, sizeChange, type OutFormat } from './core';

const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif'];

/** 用页面里的画布重新编码（兼容 macOS 11 起的系统网页引擎与 Windows WebView2） */
export async function encode(bytes: Uint8Array, format: OutFormat, quality: number, maxSide: number, bg: string) {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart]));
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode().catch(() => {
      throw new Error('无法识别这张图片，可能已损坏或格式不受支持');
    });
    const [w, h] = fitSize(img.naturalWidth, img.naturalHeight, maxSide);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const g = canvas.getContext('2d')!;
    if (format === 'jpg') {
      g.fillStyle = bg;
      g.fillRect(0, 0, w, h);
    }
    g.imageSmoothingQuality = 'high';
    g.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, MIME[format], format === 'png' ? undefined : quality / 100));
    if (!blob) throw new Error('编码失败，图片可能太大');
    return { data: new Uint8Array(await blob.arrayBuffer()), w, h };
  } finally {
    URL.revokeObjectURL(url);
  }
}

const tool: BatchTool = {
  id: 'o13',
  name: '图片批量压缩',
  tagline: '把一批图片压小、转成 JPG / PNG / WebP，可限制最长边，不联网、不上传。',
  category: '办公提效',
  type: 'media',
  mode: 'batch',
  resultView: 'list',
  concurrency: 3,
  accept: { label: '图片', extensions: IMAGE_EXT },
  params: [
    { key: 'format', label: '输出格式', type: 'segment', options: [['jpg', 'JPG'], ['webp', 'WebP'], ['png', 'PNG']], default: 'jpg' },
    { key: 'quality', label: '质量', type: 'number', default: 82, min: 30, max: 100, unit: '%', help: '80 左右肉眼几乎看不出差别；PNG 不受影响' },
    { key: 'maxSide', label: '最长边不超过', type: 'select', options: [['0', '不限制'], ['800', '800 像素'], ['1200', '1200 像素'], ['1920', '1920 像素'], ['2560', '2560 像素']], default: '1920' },
    { key: 'bg', label: '透明区域填充（转 JPG 时）', type: 'segment', options: [['#FFFFFF', '白色'], ['#000000', '黑色']], default: '#FFFFFF' },
    { key: 'out', label: '保存到', type: 'folder', default: '' },
  ],
  check: (item) => (item.size != null && item.size > 200 * 1024 * 1024 ? '文件超过 200 MB' : null),
  async run(item, ctx) {
    const format = ctx.params.format as OutFormat;
    const src = await ctx.readFile(item.path!);
    ctx.progress(0.3);
    const { data, w, h } = await encode(src, format, Number(ctx.params.quality), Number(ctx.params.maxSide), String(ctx.params.bg));
    ctx.progress(0.8);
    const outputPath = await ctx.join(ctx.outputDir, outputName(item.name, format));
    await ctx.writeFile(outputPath, data);
    return { outputPath, preview: outputPath, summary: `${w}×${h} · ${sizeChange(src.length, data.length)}` };
  },
};

export default tool;
