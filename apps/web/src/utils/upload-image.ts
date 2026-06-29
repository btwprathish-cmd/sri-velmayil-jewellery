export async function uploadImage(file: File, type: "collection" | "category" | "product" = "product"): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`/api/admin/upload?type=${type}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "File upload failed. Only JPG, PNG, and WEBP under 5MB are allowed.");
  }

  const data = await res.json();
  return data.imageUrl;
}
