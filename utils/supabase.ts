import { createClient } from "@supabase/supabase-js";

const bucket = "nestquest";

// supabase client
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

// function to upload image to supabase storage and return the public url
export const uploadImage = async (image: File) => {
  const timestamp = Date.now();
  const newName = `${timestamp}-${image.name}`;

  const { data } = await supabase.storage.from(bucket).upload(newName, image, {
    cacheControl: "3600",
  });

  if (!data) {
    throw new Error("Failed to upload image");
  }

  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};
