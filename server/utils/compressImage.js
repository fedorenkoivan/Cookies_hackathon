import sharp from "sharp";

export const compressImage = async (base64String) => {
  if (!base64String) return "";

  const idx = base64String.indexOf(',');
  const base64Data = idx !== -1 ? base64String.slice(idx + 1) : base64String;

  const buffer = Buffer.from(base64Data, "base64");

  const resizedBuffer = await sharp(buffer)
    .resize(null, 500, { fit: "cover" })
    .toFormat("jpeg")
    .jpeg({ quality: 70 })
    .toBuffer();

  const result = `data:image/jpeg;base64,${resizedBuffer.toString("base64")}`;

  return result;
};