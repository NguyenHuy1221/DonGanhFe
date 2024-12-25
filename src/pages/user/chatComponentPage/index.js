import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import { FaPaperPlane } from "react-icons/fa"; // Sử dụng icon gửi tin nhắn
import axios from "axios";
import { io } from "socket.io-client";
import {
  getListConversations,
  createConversation,
  getListConversationsForCurrentUser,
  uploadFile,
} from "../../../api/chatSocket";

function ChatComponent({ isChatMo, toggleChatMo }) {
  const [isChatOpen, setIsChatOpen] = useState(false); // Quản lý trạng thái mở chat
  const [newMessage, setNewMessage] = useState("");
  const [notification, setNotification] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const messageEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

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
    // const newSocket = io("http://localhost:5000", {
      const newSocket = io("http://61.14.233.64:5000", {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("token") },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket đã kết nối thành công");
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/chatsocket/Createconversation", {
        sender_id: senderId,
        receiver_id: receiverId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token vào headers
        },
      });
      console.log("Cuộc trò chuyện mới:", response.data);

      return response.data;
      // const conversation = await createConversation(senderId, receiverId);
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

  const toggleChat = async () => {
    console.log("Toggling chat...");
    setIsChatOpen(!isChatOpen);
    toggleChatMo && toggleChatMo(!isChatMo); // Đồng bộ với trạng thái từ props
    console.log("Trạng thái chat mới:", !isChatOpen);

    const currentUserId = getUserIdFromToken(); // Lấy currentUserId từ token
    const chatUserId = localStorage.getItem("userIdChat"); // Lấy chatUserId từ localStorage
    // const chatUserId = localStorage.getItem("userId"); // Lấy chatUserId từ localStorage

    console.log("currentUserId:", currentUserId);
    console.log("chatUserId:", chatUserId);

    if (chatUserId) {
      // Nếu có chatUserId trong localStorage, tìm cuộc trò chuyện
      console.log("Đang tìm cuộc trò chuyện cho chatUserId:", chatUserId);

      fetchConversations(currentUserId)
        .then((conversations = []) => {
          console.log("Danh sách cuộc trò chuyện:", conversations);

          const existingConversation = conversations.find(
            (conv) =>
              (conv.sender_id._id === currentUserId &&
                conv.receiver_id._id === chatUserId) ||
              (conv.receiver_id._id === currentUserId &&
                conv.sender_id._id === chatUserId)
          );

          console.log("existingConversation:", existingConversation);

          if (existingConversation) {
            // Nếu cuộc trò chuyện đã tồn tại, chọn cuộc trò chuyện
            console.log("Cuộc trò chuyện đã tồn tại:", existingConversation);
            setSelectedConversationId(existingConversation._id); // Cập nhật trạng thái cuộc trò chuyện
            setMessages(existingConversation.messages); // Cập nhật tin nhắn
          } else {
            // Nếu không có cuộc trò chuyện, tạo mới
            console.log("Không tìm thấy cuộc trò chuyện, tạo mới...");
            createConversation(currentUserId, chatUserId).then(() => {
              fetchConversations(currentUserId); // Cập nhật lại danh sách cuộc trò chuyện
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy cuộc trò chuyện:", error);
        });
    } else {
      // Nếu không có chatUserId, log thông báo và lấy danh sách các cuộc trò chuyện
      console.log(
        "Không có chatUserId trong localStorage, lấy danh sách cuộc trò chuyện."
      );
      fetchConversations(currentUserId)
        .then((conversations) => {
          console.log(
            "Danh sách cuộc trò chuyện khi không có chatUserId:",
            conversations
          );
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", error);
        });
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    toggleChatMo && toggleChatMo(false); // Đảm bảo trạng thái bên ngoài cũng được tắt
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
    <div>
      {/* Biểu tượng chat */}
      <div className="chat-icon" onClick={toggleChat}>
        <FaPaperPlane />
      </div>

      {/* Chat box nếu isChatOpen là true */}
      {(isChatOpen || isChatMo) && (
        <div className="chat-box">
          <div className="chat-header">
            <span>Chat với chúng tôi</span>
            <button onClick={closeChat}>X</button>
          </div>

          <div className="row cuon">
            <div className="col-4 avatar-user">
              {users.map((user, index) => (
                <div
                  className="avatar-container"
                  key={`${user._id}-${index}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <img
                    src={user.anhDaiDien || "https://via.placeholder.com/150"}
                    alt={user.name}
                    className="avatar-image"
                  />
                  <p className="user-name">{user.tenNguoiDung}</p>
                </div>
              ))}
            </div>
            <div className="col-8 content-user">
              {selectedUser && (
                <div className="chat-header-info">
                  <img
                    src={
                      selectedUser.anhDaiDien ||
                      "https://via.placeholder.com/150"
                    }
                    alt={selectedUser.tenNguoiDung}
                    className="chat-header-avatar"
                  />
                  <span className="chat-header-name">
                    {selectedUser.tenNguoiDung}
                  </span>
                </div>
              )}
              <div className="messages">
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
                {/* Thêm phần tử này vào cuối danh sách tin nhắn */}
                <div ref={messageEndRef} />
              </div>

              <div className="chat-footer">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  onKeyDown={handleKeyDown} // Thêm sự kiện ở đây
                />
                <button className="send-button" onClick={handleSend}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatComponent;
