import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import { FaPaperPlane, FaSmile, FaImage } from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";
import {
  getListConversations,
  createConversation,
  getListConversationsForCurrentUser,
  uploadFile,
} from "../../../api/chatSocket";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [notification, setNotification] = useState("");
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.data;
    }
    return null;
  };

  const currentUserId = getUserIdFromToken();

  useEffect(() => {
    const chatUserId = localStorage.getItem("userIdChatAdmin");
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("token") },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket đã kết nối thành công");

      if (chatUserId) {
        // Kiểm tra nếu cuộc trò chuyện với người dùng này đã tồn tại
        fetchConversations(currentUserId).then((conversations = []) => {
          const existingConversation = conversations.find(
            (conv) =>
              (conv.sender_id._id === currentUserId &&
                conv.receiver_id._id === chatUserId) ||
              (conv.receiver_id._id === currentUserId &&
                conv.sender_id._id === chatUserId)
          );

          if (!existingConversation) {
            // Tạo cuộc trò chuyện nếu chưa có
            createConversation(currentUserId, chatUserId).then(() => {
              fetchConversations(currentUserId); // Cập nhật lại danh sách người dùng sau khi tạo
            });
          } else {
            // Đã tồn tại cuộc trò chuyện, chỉ cần cập nhật danh sách người dùng
            fetchConversations(currentUserId);
          }
        });
      } else {
        // Lấy danh sách cuộc trò chuyện nếu không có userId
        fetchConversations(currentUserId);
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const fetchConversations = async (userId) => {
    try {
      // const response = await axios.get(
      //   `/api/chatsocket/getlistconversation12/${userId}`
      // );
      // const conversations = response.data || [];

      const conversations = await getListConversations(userId);

      if (Array.isArray(conversations)) {
        setNotification(
          conversations.length === 0 ? "Không có cuộc hội thoại nào." : ""
        );

        const uniqueUsers = conversations
          .map((conv) =>
            conv.sender_id._id === userId ? conv.receiver_id : conv.sender_id
          )
          .filter(
            (user, index, self) =>
              user._id !== userId &&
              index === self.findIndex((u) => u._id === user._id)
          );

        setUsers(uniqueUsers); // Cập nhật danh sách người dùng
      } else {
        console.error("Dữ liệu hội thoại không phải là mảng");
        setNotification("Chưa có hội thoại nào.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy hội thoại:", error);
      setNotification("Chưa có hội thoại nào.");
    }
  };

  const createConversation = async (senderId, receiverId) => {
    try {
      const response = await axios.post("/api/chatsocket/Createconversation", {
        sender_id: senderId,
        receiver_id: receiverId,
      });
      return response.data;
      // const conversation = await createConversation(senderId, receiverId);
      // console.log("Cuộc trò chuyện mới:", conversation);
    } catch (error) {
      console.error("Lỗi khi tạo hội thoại:", error);
    }
  };

  const handleUserSelect = async (user) => {
    const token = localStorage.getItem("token");
    if (selectedUser && selectedUser._id === user._id) return;

    console.log("Người dùng được chọn:", user);
    setSelectedUser(user);

    console.log("ID người dùng hiện tại:", currentUserId);

    try {
      // const response = await axios.get(
      //   `/api/chatsocket/getlistconversation12/${currentUserId}`
      // );
      // console.log("Phản hồi từ API:", response.data);

      // const conversation = response.data.find(
      //   (conv) =>
      //     (conv.sender_id._id === currentUserId &&
      //       conv.receiver_id._id === user._id) ||
      //     (conv.receiver_id._id === currentUserId &&
      //       conv.sender_id._id === user._id)
      // );

      const conversations = await getListConversationsForCurrentUser(
        currentUserId
      );
      const conversation = conversations.find(
        (conv) =>
          (conv.sender_id._id === currentUserId &&
            conv.receiver_id._id === user._id) ||
          (conv.receiver_id._id === currentUserId &&
            conv.sender_id._id === user._id)
      );

      if (conversation) {
        console.log("Hội thoại tìm thấy:", conversation);
        setSelectedConversationId(conversation._id);
        setMessages(conversation.messages);

        // Kiểm tra nếu socket đã được kết nối
        if (socket && socket.connected) {
          socket.emit("join", { conversationId: conversation._id, token });
        } else {
          console.error("Socket chưa được kết nối.");
        }
      } else {
        console.log("Không tìm thấy hội thoại với người này, tạo mới...");
        await createConversation(currentUserId, user._id);
        await fetchConversations(currentUserId); // Cập nhật lại danh sách người dùng
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm hội thoại:", error);
    }
  };

  const handleSend = async () => {
    if (input.trim() === "" && !selectedFile) return;

    let message = {
      text: input,
      msgByUserId: currentUserId,
      receiver: selectedUser,
      createdAt: new Date().toISOString(),
    };

    if (selectedFile) {
      const formData = new FormData();
      if (selectedFile.type.startsWith("image/")) {
        formData.append("image", selectedFile);
      } else if (selectedFile.type.startsWith("video/")) {
        formData.append("video", selectedFile);
      }

      try {
        // const uploadResponse = await axios.post(
        //   "/api/user/upload_ImageOrVideo",
        //   formData,
        //   {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
        // );

        // const { imageUrl, videoUrl } = uploadResponse.data;

        const uploadResponse = await uploadFile(selectedFile);
        const { imageUrl, videoUrl } = uploadResponse;

        if (imageUrl) {
          message.imageUrl = imageUrl;
        }
        if (videoUrl) {
          message.videoUrl = videoUrl;
        }

        setSelectedFile(null);
        setFilePreview(null);
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    }

    const token = localStorage.getItem("token");

    socket.emit(
      "sendMessage",
      {
        conversationId: selectedConversationId,
        ...message,
        token, // Truyền thêm token vào dữ liệu gửi đi
      },
      (response) => {
        if (response.success) {
          setMessages((prevMessages) => [...prevMessages, message]);
        } else {
          console.error("Gửi tin nhắn không thành công:", response.message);
        }
      }
    );

    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (!socket || !selectedConversationId) return;
    const handleMessage = (msg) => {
      console.log("Tin nhắn nhận được:", msg);
      if (msg.conversationId === selectedConversationId) {
        setMessages((prevMessages) => [...prevMessages, msg.message]);
      }
    };
    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket, selectedConversationId]);

  return (
    <div className="fb-chat-container">
      <div className="fb-user-list">
        <h3>Danh sách người dùng</h3>
        {notification && <p className="notification">{notification}</p>}{" "}
        {/* Hiển thị thông báo */}
        <ul>
          {users.map((user, index) => (
            <li
              key={`${user._id}-${index}`}
              onClick={() => handleUserSelect(user)}
            >
              <img
                src={
                  user.anhDaiDien
                    ? user.anhDaiDien
                    : "https://via.placeholder.com/40"
                }
                alt={user.tenNguoiDung || "Người dùng không có tên"}
              />
              <span>{user.tenNguoiDung || "Người dùng không xác định"}</span>{" "}
            </li>
          ))}
        </ul>
      </div>

      <div className="fb-chat-box">
        {selectedUser && (
          <div className="fb-user-info">
            <img
              src={
                selectedUser.anhDaiDien
                  ? selectedUser.anhDaiDien
                  : "https://via.placeholder.com/40"
              }
              alt={selectedUser.tenNguoiDung || "Người dùng không xác định"}
            />
            <h4>{selectedUser.tenNguoiDung || "Người dùng không xác định"}</h4>
            {selectedUser.soDienThoai && (
              <>
                <span className="separator">|</span>
                <p className="user-phone">{selectedUser.soDienThoai}</p>
              </>
            )}
          </div>
        )}

        <div className="fb-message-list">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`fb-message ${
                msg.msgByUserId === currentUserId ? "right" : "left"
              }`}
            >
              {msg.text && <span>{msg.text}</span>}
              {msg.imageUrl && <img src={msg.imageUrl} alt="Message" />}
              {msg.videoUrl && (
                <video controls>
                  <source src={msg.videoUrl} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
              )}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="fb-input-container">
          {filePreview && (
            <div className="file-preview">
              <img src={filePreview} alt="File Preview" />
              <button onClick={() => setSelectedFile(null)}>Xóa</button>
            </div>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            onKeyDown={handleKeyDown} // Thêm sự kiện ở đây
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button onClick={handleImageClick}>
            <FaImage />
          </button>
          <button onClick={handleSend}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
