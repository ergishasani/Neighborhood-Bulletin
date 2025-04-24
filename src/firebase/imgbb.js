export const uploadImage = async (imageFile, path) => {
    try {
        const apiKey = "5e5585b6c1ba805310ef78e5d3cf73ca";

        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            return { success: true, url: data.data.url }; // Returning the image URL
        } else {
            return { success: false, error: data.error.message };
        }
    } catch (err) {
        console.error("Error uploading image:", err);
        return { success: false, error: err.message };
    }
};
