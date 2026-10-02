import sharp from "sharp";

const source = "public/brand/logo.png";

const trimmed = await sharp(source).trim({ background: "#ffffff", threshold: 18 }).toBuffer();
const { data, info } = await sharp(trimmed).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const transparent = Buffer.alloc(data.length);
const light = Buffer.alloc(data.length);

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const alpha = Math.min(1, Math.max(0, (250 - Math.min(r, g, b)) / 70));

  const unmix = (c) => (alpha > 0 ? Math.min(255, Math.max(0, (c - 255 * (1 - alpha)) / alpha)) : 0);
  const cr = unmix(r);
  const cg = unmix(g);
  const cb = unmix(b);

  transparent[i] = cr;
  transparent[i + 1] = cg;
  transparent[i + 2] = cb;
  transparent[i + 3] = Math.round(alpha * 255);

  const isBlue = cb > cr + 12 && cb > cg;
  if (isBlue) {
    const shade = 225 + Math.round((cb / 255) * 30);
    light[i] = shade;
    light[i + 1] = shade;
    light[i + 2] = Math.min(255, shade + 6);
  } else {
    light[i] = cr;
    light[i + 1] = cg;
    light[i + 2] = cb;
  }
  light[i + 3] = Math.round(alpha * 255);
}

const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
await sharp(transparent, raw).png().toFile("public/brand/logo-transparent.png");
await sharp(light, raw).png().toFile("public/brand/logo-light.png");

console.log(`logo ${info.width}x${info.height}`);
