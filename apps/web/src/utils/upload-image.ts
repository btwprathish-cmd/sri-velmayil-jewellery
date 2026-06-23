import { supabase } from "@/lib/supabase";

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || "png";
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  
  // Upload to the 'jewellery-images' bucket
  const { error } = await supabase.storage
    .from('jewellery-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error("Error uploading image to Supabase:", error);
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  // Retrieve the public URL
  const { data: publicUrlData } = supabase.storage
    .from('jewellery-images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
