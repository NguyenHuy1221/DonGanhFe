import axios from "axios";

// Hàm lấy danh sách cuộc trò chuyện
export const getListConversations = async (userId) => {
  try {
    const response = await axios.get(
      `/api/chatsocket/getlistconversation12/${userId}`
    );
    return response.data || []; // Trả về dữ liệu nếu có hoặc mảng rỗng
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", error);
    throw error;
  }
};

// Hàm tạo cuộc trò chuyện mới
export const createConversation = async (senderId, receiverId) => {
  try {
    const response = await axios.post("/api/chatsocket/Createconversation", {
      sender_id: senderId,
      receiver_id: receiverId,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo cuộc trò chuyện:", error);
    throw error;
  }
};

// Hàm lấy danh sách cuộc trò chuyện cho người dùng hiện tại
export const getListConversationsForCurrentUser = async (currentUserId) => {
  try {
    const response = await axios.get(
      `/api/chatsocket/getlistconversation12/${currentUserId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy cuộc trò chuyện của người dùng hiện tại:",
      error
    );
    throw error;
  }
};

// Hàm tải lên hình ảnh hoặc video
export const uploadFile = async (file) => {
  const formData = new FormData();

  // Kiểm tra loại file và thêm vào formData
  if (file.type.startsWith("image/")) {
    formData.append("image", file);
  } else if (file.type.startsWith("video/")) {
    formData.append("video", file);
  }

  try {
    const response = await axios.post(
      "/api/user/upload_ImageOrVideo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // Trả về dữ liệu response từ server
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Ném lỗi nếu tải lên thất bại
  }
};
