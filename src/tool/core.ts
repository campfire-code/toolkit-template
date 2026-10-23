// 纯函数：不依赖界面和本机能力，便于单元测试。

export type OutFormat = 'jpg' | 'png' | 'webp';
export const MIME: Record<OutFormat, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

/** 输出文件名：换扩展名，可加后缀 */
export function outputName(name: string, format: OutFormat, suffix = '') {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  return `${base}${suffix}.${format}`;
}

/** 等比缩放到最长边不超过 maxSide（0 表示不缩放），不放大 */
export function fitSize(w: number, h: number, maxSide: number): [number, number] {
  if (!maxSide || Math.max(w, h) <= maxSide) return [w, h];
  const k = maxSide / Math.max(w, h);
  return [Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k))];
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** 「1.2 MB → 320 KB（小了 73%）」 */
export function sizeChange(before: number, after: number) {
  const diff = before ? Math.round((1 - after / before) * 100) : 0;
  const tail = diff > 0 ? `小了 ${diff}%` : diff < 0 ? `大了 ${-diff}%` : '大小不变';
  return `${formatBytes(before)} → ${formatBytes(after)}（${tail}）`;
}
