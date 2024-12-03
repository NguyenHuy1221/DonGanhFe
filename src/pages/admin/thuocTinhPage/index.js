import React, { useState, useEffect, memo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  layDanhSachThuocTinh,
  themThuocTinh,
  suaThuocTinh,
  xoaThuocTinh,
} from "../../../api/thuocTinhService";

const ThuocTinhPage = () => {
  const [duLieu, setDuLieu] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form] = Form.useForm();

  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const data = await layDanhSachThuocTinh(userId);
      const filteredData = data.filter((item) => !item.isDeleted); 
      setDuLieu(filteredData);
    } catch (error) {
      message.error("Lấy thuộc tính thất bại");
      console.error("Error during data fetch:", error);
    }
  };
  

  const themThuocTinhHandler = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const suaThuocTinhHandler = (record) => {
    setIsEditing(true);
    setEditRecord(record);
    form.setFieldsValue({ ...record, ThuocTinhID: record.ThuocTinhID });
    setIsModalVisible(true);
  };

  const xoaThuocTinhHandler = async (id) => {
    try {
      await xoaThuocTinh(id);
      fetchData();
      message.success("Xóa thuộc tính thành công");
    } catch (error) {
      message.error("Xóa thuộc tính thất bại");
    }
  };

  const xacNhanHandler = async () => {
    try {
      const values = await form.validateFields();

      // Kiểm tra trùng ID
      const isIDTrung = duLieu.some(
        (item) =>
          item.ThuocTinhID === values.ThuocTinhID &&
          (!isEditing || item.ThuocTinhID !== editRecord.ThuocTinhID)
      );

      if (isIDTrung) {
        message.error("Mã thuộc tính đã tồn tại!");
        return;
      }
      const userId = localStorage.getItem("userId");

      if (isEditing) {
        await suaThuocTinh({
          _id: editRecord._id, // Truyền _id
          ThuocTinhID: values.ThuocTinhID, // Truyền cả ThuocTinhID
          TenThuocTinh: values.TenThuocTinh,
        },userId);
        message.success("Cập nhật thuộc tính thành công");
      } else {
        await themThuocTinh(values,userId);
        message.success("Thêm thuộc tính thành công");
      }
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      console.log("Xác thực không thành công:", error);
      message.error("Thuộc tính đã tồn tại.");

    }
  };

  const huyHandler = () => {
    setIsModalVisible(false);
  };

  const cotDuLieu = [
    {
      title: "Mã thuộc tính",
      dataIndex: "ThuocTinhID",
      key: "ThuocTinhID",
      onCell: (record) => ({
        onClick: () => {
          console.log("Đã nhấp chuột vào Mã thuộc tính:", record.ThuocTinhID);
        },
      }),
    },
    {
      title: "Tên thuộc tính",
      dataIndex: "TenThuocTinh",
      key: "TenThuocTinh",
      onCell: (record) => ({
        onClick: () => {
          console.log("Đã nhấp chuột vào Tên thuộc tính:", record.TenThuocTinh);
        },
      }),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "right",

      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => suaThuocTinhHandler(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thuộc tính này không?"
            onConfirm={() => xoaThuocTinhHandler(record._id)}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1>Quản lý thuộc tính</h1>

      {/* Add button */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={themThuocTinhHandler}
        style={{ marginBottom: 16 }}
      >
        Thêm thuộc tính
      </Button>

      {/* Table */}
      <Table
        columns={cotDuLieu}
        dataSource={duLieu} // Đây là dữ liệu tìm kiếm
        pagination={false} // Tùy chọn: Tắt phân trang để đơn giản hóa
      />

      {/* Modal */}
      <Modal
        title={isEditing ? "Sửa thuộc tính" : "Thêm thuộc tính"}
        visible={isModalVisible}
        onOk={xacNhanHandler}
        onCancel={huyHandler}
        okText={isEditing ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" name="thuoc_tinh_form">
          <Form.Item
            name="ThuocTinhID"
            label="Mã thuộc tính"
            rules={[
              { required: true, message: "Vui lòng nhập mã thuộc tính!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="TenThuocTinh"
            label="Tên thuộc tính"
            rules={[
              { required: true, message: "Vui lòng nhập tên thuộc tính!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(ThuocTinhPage);
