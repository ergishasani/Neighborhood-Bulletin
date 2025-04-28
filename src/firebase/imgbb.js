// src/firebase/imgbb.js

/**
 * Uploads an image File to imgbb.com.
 * Returns a promise resolving to { success: boolean, url?: string, error?: string }.
 */
export async function uploadImage(imageFile) {
    // Quick validation
    if (!imageFile) {
        return { success: false, error: "No image file provided" };
    }

    // 📌 Your imgbb API key (move to env for production)
    const apiKey = "5e5585b6c1ba805310ef78e5d3cf73ca";

    try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            return {
                success: false,
                error: `Upload failed (status ${response.status})`,
            };
        }

        const data = await response.json();
        if (!data.success) {
            return {
                success: false,
                error: data.error?.message || "Unknown imgbb error",
            };
        }

        return {
            success: true,
            url: data.data.url,           // your hosted image URL
        };
    } catch (err) {
        console.error("Error uploading image:", err);
        return { success: false, error: err.message };
    }
}
