import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Để xem trước ảnh
  const [form] = Form.useForm();

  // Lấy danh sách banner từ API
  const fetchBanners = async () => {
    try {
      const response = await axios.get("/api/banner/banners");
      setBanners(response.data);
    } catch (error) {
      message.error("Lấy danh sách banner thất bại");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Mở modal thêm hoặc chỉnh sửa banner
  const showModal = (banner = null) => {
    if (banner) {
      setIsEditing(true);
      setCurrentBannerId(banner._id);
      form.setFieldsValue({
        hinhAnh: banner.hinhAnh,
      });
      setImagePreview(banner.hinhAnh); // Xem trước ảnh khi chỉnh sửa
    } else {
      setIsEditing(false);
      form.resetFields();
      setImagePreview(null); // Xóa xem trước ảnh khi thêm mới
    }
    setIsModalVisible(true);
  };

  // Xử lý submit form
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("hinhAnh", values.hinhAnh);

      // Nếu có file được chọn, thêm vào formData
      if (values.file && values.file.fileList.length > 0) {
        formData.append("file", values.file.fileList[0].originFileObj);
      }

      if (isEditing) {
        await axios.put(`/api/banner/banners/${currentBannerId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Cập nhật banner thành công");
      } else {
        await axios.post("/api/banner/banners", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Thêm banner thành công");
      }

      fetchBanners();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Lưu banner thất bại");
    }
  };

  // Xóa banner
  const handleDelete = async (bannerId) => {
    try {
      await axios.delete(`/api/banner/banners/${bannerId}`);
      message.success("Xóa banner thành công");
      fetchBanners();
    } catch (error) {
      message.error("Xóa banner thất bại");
    }
  };

  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "hinhAnh",
      render: (text) => (
        <img
          src={text}
          alt="Banner"
          style={{
            width: 250,
            height: 100,
            objectFit: "contain",
          }}
        />
      ),
    },
    {
      title: "Hành Động",
      align: "right",
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa banner này không?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Thêm Banner
      </Button>
      <Table columns={columns} dataSource={banners} rowKey="_id" />

      <Modal
        title={isEditing ? "Chỉnh Sửa Banner" : "Thêm Banner"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="file"
            label="Ảnh Banner"
            rules={[{ required: !isEditing, message: "Vui lòng chọn ảnh!" }]}
          >
            <Upload
              beforeUpload={() => false}
              accept="image/*"
              onChange={({ fileList }) => {
                form.setFieldsValue({ file: { fileList } });
                if (fileList.length > 0) {
                  const file = fileList[0].originFileObj;
                  const imageUrl = URL.createObjectURL(file);
                  setImagePreview(imageUrl); // Cập nhật xem trước ảnh
                } else {
                  setImagePreview(null); // Xóa xem trước nếu không có file
                }
              }}
            >
              <Button>Chọn Ảnh</Button>
            </Upload>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Ảnh xem trước"
                style={{
                  marginTop: 10,
                  // maxWidth: "100px",
                  maxHeight: "100px",
                  objectFit: "cover",
                }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BannerManagement;
