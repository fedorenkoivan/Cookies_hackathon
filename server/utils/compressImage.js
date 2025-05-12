import sharp from "sharp";

export const compressImage = async (base64String) => {
  if (!base64String) return "";
  const matches = base64String.match(/^data:.+\/(.+);base64,(.*)$/);
  const buffer = matches
    ? Buffer.from(matches[2], "base64")
    : Buffer.from(base64String, "base64");

  const resizedBuffer = await sharp(buffer)
    .resize(null, 500, { fit: "cover" })
    .toFormat("jpeg")
    .jpeg({ quality: 70 })
    .toBuffer();

  return `data:image/jpeg;base64,${resizedBuffer.toString("base64")}`;
};