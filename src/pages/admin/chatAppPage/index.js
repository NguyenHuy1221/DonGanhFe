import React, { useEffect, useState } from "react";
import "./style.scss";
import { FaPaperPlane, FaSmile, FaImage } from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Kết nối với server Socket.IO khi component được mount
  useEffect(() => {
    const newSocket = io("https://peacock-wealthy-vaguely.ngrok-free.app");

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server"); // Log khi kết nối thành công
    });

    setSocket(newSocket);

    return () => {
      newSocket.close(); // Đóng kết nối khi component unmount
    };
  }, []);

  // Gọi API lấy danh sách người dùng khi component được render
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user/showAllUser");
        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    };

    fetchUsers();
  }, []);

  // Lắng nghe sự kiện tin nhắn từ server
  useEffect(() => {
    if (!socket) return;

    socket.on("chat message", (msg) => {
      console.log("Received message:", msg); // Log tin nhắn nhận được
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message"); // Hủy lắng nghe khi component unmount
    };
  }, [socket]);

  // Xử lý chọn người dùng và lấy cuộc hội thoại
  const handleUserSelect = async (user) => {
    try {
      setSelectedUser(user);
      const response = await axios.post("/api/chatsocket/Createconversation", {
        sender_id: "66e25844ba1b7282d0163d33", // Thay bằng ID của người dùng hiện tại
        receiver_id: user.id,
      });

      const conversation = response.data;
      console.log("Cuộc hội thoại:", conversation); // Log cuộc hội thoại

      if (conversation.messages) {
        setMessages(conversation.messages);
      } else {
        setMessages([]);
      }
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tạo cuộc hội thoại:", err);
      setError("Không thể tạo hoặc tìm cuộc hội thoại.");
    }

    await fetchConversations(user._id);
  };

  // Gọi API lấy danh sách cuộc hội thoại
  const fetchConversations = async (sender_id) => {
    try {
      const response = await axios.get(
        `/api/chatsocket/getlistconversation12/${sender_id}`
      );
      console.log("Dữ liệu cuộc hội thoại:", response.data); // Log dữ liệu cuộc hội thoại

      if (response.data.length > 0) {
        const conversationMessages = response.data[0].messages;
        setMessages(conversationMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cuộc hội thoại:", error);
    }
  };

  // Xử lý gửi tin nhắn
  const handleSend = () => {
    if (input.trim() === "" || !selectedUser) return;

    const message = { text: input, sender: "You", receiver: selectedUser.id };

    // Gửi tin nhắn tới server
    socket.emit("chat message", message);

    // Cập nhật tin nhắn vào state
    setMessages([...messages, message]);
    setInput("");

    // Mô phỏng phản hồi sau 1 giây
    setTimeout(() => {
      const responseMessage = {
        text: "Xin chào! Bạn khỏe không?",
        sender: "Other",
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  return (
    <div className="fb-chat-container">
      <div className="fb-user-list">
        <h3>Danh sách người dùng</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id} onClick={() => handleUserSelect(user)}>
              <img src="https://via.placeholder.com/40" alt={user.anhDaiDien} />
              <span>{user.tenNguoiDung}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="fb-chat-box">
        <div className="fb-message-list">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`fb-message ${
                msg.sender === "You" ? "right" : "left"
              }`}
            >
              {msg.text && <span>{msg.text}</span>}
              {msg.imageUrl && <img src={msg.imageUrl} alt="Message" />}
              {msg.videoUrl && (
                <video controls>
                  <source src={msg.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>

        <div className="fb-input-container">
          <button className="icon-btn">
            <FaSmile />
          </button>
          <button className="icon-btn">
            <FaImage />
          </button>
          <input
            type="text"
            placeholder="Aa"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
