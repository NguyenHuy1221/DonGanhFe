import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Space,
  Image,
  Form,
  Input,
  Upload,
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LikeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  getListBaiViet,
  deleteBaiViet,
  createBaiViet,
  updateBaiViet,
} from "../../../api/baiVietService";
import axios from "axios";

const BaiVietManager = () => {
  const [baiVietList, setBaiVietList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleConTents, setIsModalVisibleConTents] = useState(false);

  const [editingId, setEditingId] = useState(null); // ID của bài viết đang chỉnh sửa
  const [modalContent, setModalContent] = useState({ type: "", data: null });

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const fetchBaiVietList = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      message.error("Bạn chưa đăng nhập");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const data = await getListBaiViet(userId,token);
      setBaiVietList(data);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaiVietList();
  }, []);

  const handleCreateBaiViet = () => {
    setFileList([]);
    form.resetFields();
    setEditingId(null); // Đặt ID thành null để xác định là tạo mới
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record._id); // Đặt ID của bài viết đang chỉnh sửa
    form.setFieldsValue({
      tieude: record.tieude,
      noidung: record.noidung,
      tags: record.tags,
    });

    // Định dạng lại `fileList` cho `Upload`
    const formattedFileList =
      record.image?.map((url, index) => ({
        uid: `${record._id}-${index}`, // Tạo UID duy nhất
        name: `image-${index}`, // Tên của ảnh
        status: "done", // Trạng thái đã tải lên thành công
        url: url, // URL của ảnh
      })) || [];

    setFileList(formattedFileList); // Đặt lại `fileList` cho Upload
    setIsModalVisible(true); // Mở modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  // const handleCreateSubmit = async (values) => {
  //   console.log("dcmmmm");
  //   const userId = localStorage.getItem("userId");
  //   const formData = new FormData();
  //   formData.append("userId", userId);
  //   formData.append("tieude", values.tieude);
  //   formData.append("noidung", values.noidung);
  //   formData.append("tags", values.tags || "");

  //   // Tải ảnh cũ từ URL và thêm vào FormData
  //   const oldFilesPromises = fileList
  //     .filter((file) => file.url) // Chỉ lấy ảnh cũ (có URL)
  //     .map(async (file) => {
  //       const response = await fetch(file.url); // Tải ảnh từ URL
  //       const blob = await response.blob(); // Chuyển ảnh thành Blob
  //       const fileName = file.url.split("/").pop(); // Lấy tên file từ URL
  //       return new File([blob], fileName, { type: blob.type }); // Tạo file từ Blob
  //     });

  //   // Chờ tải xong toàn bộ ảnh cũ
  //   const oldFiles = await Promise.all(oldFilesPromises);

  //   // Thêm ảnh cũ vào FormData
  //   oldFiles.forEach((file) => {
  //     formData.append("files", file);
  //   });

  //   // Thêm ảnh mới vào FormData
  //   fileList
  //     .filter((file) => file.originFileObj) // Chỉ lấy ảnh mới (File object)
  //     .forEach((file) => {
  //       formData.append("files", file.originFileObj);
  //     });

  //   // Log kiểm tra dữ liệu FormData
  //   for (let pair of formData.entries()) {
  //     console.log(pair[0], pair[1]);
  //   }

  //   try {
  //     // const response = editingId
  //     //   ? await axios.put(`/api/baiviet/updateBaiViet/${editingId}`, formData)
  //     //   : await axios.post("/api/baiviet/createBaiViet", formData);

  //     const response = editingId
  //       ? await updateBaiViet(editingId, formData) // Sử dụng API cập nhật
  //       : await createBaiViet(formData); // Sử dụng API tạo mới

  //     message.success(response.message);
  //     fetchBaiVietList(); // Tải lại danh sách bài viết sau khi tạo hoặc cập nhật
  //     handleCancel(); // Đóng modal
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     message.error("Lỗi khi tạo hoặc cập nhật bài viết");
  //   }
  // };

  const handleCreateSubmit = async (values) => {
    console.log("dcmmmm");
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("tieude", values.tieude);
    formData.append("noidung", values.noidung);
    formData.append("tags", values.tags || "");
  
    // Tải ảnh cũ từ URL và thêm vào FormData
    const oldFilesPromises = fileList
      .filter((file) => file.url) // Chỉ lấy ảnh cũ (có URL)
      .map(async (file) => {
        try {
          const response = await fetch(file.url); // Tải ảnh từ URL
          if (!response.ok) {
            throw new Error(`Failed to fetch ${file.url}`);
          }
          const blob = await response.blob(); // Chuyển ảnh thành Blob
          const fileName = file.url.split("/").pop(); // Lấy tên file từ URL
          return new File([blob], fileName, { type: blob.type }); // Tạo file từ Blob
        } catch (error) {
          console.error("Error fetching old image:", error);
          message.error(`Lỗi khi tải ảnh cũ: ${file.url}`);
          return null; // Trả về null nếu không tải được ảnh
        }
      });
  
    // Chờ tải xong toàn bộ ảnh cũ
    const oldFiles = await Promise.all(oldFilesPromises);
    
    // Lọc các ảnh tải thành công (không phải null)
    const validOldFiles = oldFiles.filter((file) => file !== null);
  
    // Thêm ảnh cũ vào FormData
    validOldFiles.forEach((file) => {
      formData.append("files", file);
    });
  
    // Thêm ảnh mới vào FormData
    fileList
      .filter((file) => file.originFileObj) // Chỉ lấy ảnh mới (File object)
      .forEach((file) => {
        formData.append("files", file.originFileObj);
      });
  
    // Log kiểm tra dữ liệu FormData
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      // Cập nhật hoặc tạo mới bài viết
      const response = editingId
        ? await updateBaiViet(editingId, formData) // Sử dụng API cập nhật
        : await createBaiViet(formData); // Sử dụng API tạo mới
  
      message.success(response.message);
      fetchBaiVietList(); // Tải lại danh sách bài viết sau khi tạo hoặc cập nhật
      handleCancel(); // Đóng modal
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Lỗi khi tạo hoặc cập nhật bài viết");
    }
  };

  
  const handleDelete = (id) => {
    deleteBaiViet(id)
      .then(() => {
        setBaiVietList(baiVietList.filter((item) => item._id !== id));
        message.success("Xóa bài viết thành công");
      })
      .catch(() => {
        message.error("Lỗi khi xóa bài viết");
      });
  };

  const handleLike = (id) => {
    console.log("Thích bài viết: ", id);
  };

  const handleViewMore = (type, data) => {
    setModalContent({ type, data });
    setIsModalVisibleConTents(true);
  };

  const handleCloseModal = () => {
    setIsModalVisibleConTents(false);
    setModalContent({ type: "", data: null });
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "tieude",
      key: "tieude",
    },
    {
      title: "Nội dung",
      dataIndex: "noidung",
      key: "noidung",
      render: (text) => {
        const MAX_LENGTH = 20; // Độ dài nội dung tối đa trước khi ẩn bớt
        return (
          <div>
            {text.length > MAX_LENGTH ? (
              <>
                {`${text.slice(0, MAX_LENGTH)}... `}
                <Button
                  type="link"
                  onClick={() => handleViewMore("content", text)}
                  style={{ padding: 0 }}
                >
                  Xem thêm
                </Button>
              </>
            ) : (
              text
            )}
          </div>
        );
      },
    },
    {
      title: "Tác giả",
      dataIndex: ["userId", "tenNguoiDung"],
      key: "tacgia",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "ngaytao",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Số lượt thích",
      dataIndex: "likes",
      key: "likes",
      render: (likes) => (Array.isArray(likes) ? likes.length : 0),
    },
    {
      title: "Số bình luận",
      dataIndex: "binhluan",
      key: "binhluan",
      render: (binhluan) => (Array.isArray(binhluan) ? binhluan.length : 0),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (images) => {
        const MAX_IMAGES = 3; // Số lượng ảnh tối đa trước khi ẩn bớt
        return (
          <div>
            <Space size="middle">
              {images.slice(0, MAX_IMAGES).map((imgUrl, index) => (
                <Image
                  key={index}
                  width={50}
                  height={50}
                  src={imgUrl}
                  style={{
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              ))}
            </Space>
            {images.length > MAX_IMAGES && (
              <Button
                type="link"
                onClick={() => handleViewMore("images", images)}
                style={{ padding: 0 }}
              >
                Xem thêm
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            icon={<LikeOutlined />}
            onClick={() => handleLike(record._id)}
          />
        </Space>
      ),
    },
  ];

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList); // Cập nhật `fileList`
  };

  return (
    <div>
      <h1>Quản lý Bài Viết</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateBaiViet}
      >
        Thêm bài viết
      </Button>
      <Table
        columns={columns}
        dataSource={baiVietList}
        loading={loading}
        rowKey="_id"
        pagination={true}
      />

      <Modal
        title={editingId ? "Chỉnh sửa Bài Viết" : "Tạo Bài Viết Mới"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateSubmit} layout="vertical">
          <Form.Item
            label="Tiêu đề"
            name="tieude"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="noidung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Tags" name="tags">
            <Input />
          </Form.Item>

          {editingId && ( // Chỉ hiển thị phần ảnh cũ khi đang chỉnh sửa
            <Form.Item
              label="Hình ảnh"
              valuePropName="fileList"
              getValueFromEvent={handleUploadChange}
            >
              <Upload
                listType="picture"
                multiple
                beforeUpload={() => false} // Ngăn chặn tải lên tự động
                onChange={handleUploadChange}
                fileList={fileList} // Luôn sử dụng `fileList` để hiển thị
              >
                <Button icon={<PlusOutlined />}>Chọn Hình Ảnh</Button>
              </Upload>

              {/* Hiển thị ảnh cũ nếu có */}
              {fileList.length === 0 &&
                baiVietList.some((item) => item._id === editingId) && (
                  <div style={{ marginTop: 16 }}>
                    <Space size="middle">
                      {baiVietList
                        .find((item) => item._id === editingId)
                        .image.map((imgUrl, index) => (
                          <Image
                            key={index}
                            width={50}
                            height={50}
                            src={imgUrl}
                            style={{ objectFit: "cover", borderRadius: "5px" }}
                          />
                        ))}
                    </Space>
                  </div>
                )}
            </Form.Item>
          )}

          {/* Phần chọn ảnh mới */}
          {!editingId && (
            <Form.Item
              label="Hình ảnh"
              valuePropName="fileList"
              getValueFromEvent={handleUploadChange}
            >
              <Upload
                key={fileList.length}
                listType="picture"
                multiple
                beforeUpload={() => false} // Ngăn chặn tải lên tự động
                onChange={handleUploadChange}
                defaultFileList={fileList} // Đặt `fileList` mặc định để hiển thị ảnh
              >
                <Button icon={<PlusOutlined />}>Chọn Hình Ảnh</Button>
              </Upload>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? "Cập Nhật" : "Tạo Bài Viết"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          modalContent.type === "content"
            ? "Chi tiết Nội dung"
            : modalContent.type === "images"
            ? "Danh sách Hình ảnh"
            : ""
        }
        visible={isModalVisibleConTents}
        onCancel={handleCloseModal}
        footer={null}
      >
        {modalContent.type === "content" && (
          <div>
            <p>{modalContent.data}</p>
          </div>
        )}

        {modalContent.type === "images" && (
          <div>
            <Space wrap>
              {modalContent.data.map((imgUrl, index) => (
                <Image
                  key={index}
                  width={100}
                  height={100}
                  src={imgUrl}
                  style={{ objectFit: "cover", borderRadius: "5px" }}
                />
              ))}
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BaiVietManager;
