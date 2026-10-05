import { ImageResponse } from '@takumi-rs/image-response';
import { generate as DefaultImage } from 'fumadocs-ui/og/takumi';
import { siteConfig } from '@/lib/site';

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <DefaultImage
      title={siteConfig.name}
      description={siteConfig.description}
      site={siteConfig.name}
    />,
    { ...size, format: 'png' },
  );
}
