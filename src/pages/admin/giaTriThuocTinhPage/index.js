import React, { useState, useEffect, memo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  layDanhSachThuocTinhGiaTri,
  themThuocTinhGiaTri,
  suaThuocTinhGiaTri,
  xoaThuocTinhGiaTri,
} from "../../../api/giaTriThuocTinhService";
import { layDanhSachThuocTinh } from "../../../api/thuocTinhService";
const GiaTriThuocTinhPage = () => {
  const [duLieu, setDuLieu] = useState([]);
  const [thuocTinhList, setThuocTinhList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, thuocTinhData] = await Promise.all([
          layDanhSachThuocTinhGiaTri(),
          layDanhSachThuocTinh(),
        ]);
        setDuLieu(data);
        setThuocTinhList(thuocTinhData);
      } catch (error) {
        console.error(error.message);
        message.error(
          "Lấy danh sách thuộc tính giá trị và thuộc tính thất bại"
        );
      }
    };

    fetchData();
  }, []);

  const themGiaTriHandler = () => {
    setIsEditing(false);
    form.resetFields();
    form.setFieldsValue({
      ThuocTinhID: thuocTinhList.length > 0 ? thuocTinhList[0]._id : "",
    });
    setIsModalVisible(true);
  };

  const suaGiaTriHandler = (record) => {
    setIsEditing(true);
    setEditRecord(record);
    form.setFieldsValue({
      ...record,
      ThuocTinhID: record.ThuocTinhID._id,
    });
    setIsModalVisible(true);
  };

  const xoaGiaTriHandler = async (id) => {
    try {
      await xoaThuocTinhGiaTri(id);
      const data = await layDanhSachThuocTinhGiaTri();
      setDuLieu(data);
      message.success("Xóa thuộc tính giá trị thành công");
    } catch (error) {
      console.error(error.message);
      message.error("Xóa thuộc tính giá trị thất bại");
    }
  };

  const xacNhanHandler = async () => {
    try {
      const values = await form.validateFields();

      // Kiểm tra trùng ID
      const isIDTrung = duLieu.some(
        (item) =>
          item.IDGiaTriThuocTinh === values.IDGiaTriThuocTinh &&
          (!isEditing ||
            item.IDGiaTriThuocTinh !== editRecord.IDGiaTriThuocTinh)
      );

      if (isIDTrung) {
        message.error("ID Giá trị thuộc tính đã tồn tại!");
        return; // Ngăn không thực hiện tiếp nếu ID bị trùng
      }

      if (isEditing) {
        await suaThuocTinhGiaTri({
          ...values,
          IDGiaTriThuocTinh: editRecord.IDGiaTriThuocTinh,
        });
        message.success("Cập nhật thuộc tính giá trị thành công");
      } else {
        await themThuocTinhGiaTri(values);
        message.success("Thêm thuộc tính giá trị thành công");
      }

      setIsModalVisible(false);
      const data = await layDanhSachThuocTinhGiaTri();
      setDuLieu(data);
    } catch (error) {
      console.log("Xác thực không thành công:", error);
    }
  };

  const huyHandler = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "ID Giá trị thuộc tính",
      dataIndex: "IDGiaTriThuocTinh",
      key: "IDGiaTriThuocTinh",
    },
    {
      title: "Thuộc tính",
      dataIndex: "ThuocTinhID",
      key: "ThuocTinhID",
      render: (text) => (text ? text.TenThuocTinh : "Chưa có"),
    },
    {
      title: "Giá trị",
      dataIndex: "GiaTri",
      key: "GiaTri",
    },
    {
      title: "Hành động",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => suaGiaTriHandler(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa giá trị này không?"
            onConfirm={() => xoaGiaTriHandler(record.IDGiaTriThuocTinh)}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1>Quản lý giá trị thuộc tính</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={themGiaTriHandler}
        style={{ marginBottom: 16 }}
      >
        Thêm giá trị thuộc tính
      </Button>
      <Table
        columns={columns}
        dataSource={duLieu}
        pagination={true} // Tùy chọn: Tắt phân trang để đơn giản hóa
      />

      <Modal
        title={isEditing ? "Sửa giá trị thuộc tính" : "Thêm giá trị thuộc tính"}
        visible={isModalVisible}
        onOk={xacNhanHandler}
        onCancel={huyHandler}
        okText={isEditing ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" name="gia_tri_thuoc_tinh_form">
          <Form.Item
            name="IDGiaTriThuocTinh"
            label="ID Giá trị thuộc tính"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập ID giá trị thuộc tính!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ThuocTinhID"
            label="Thuộc tính"
            rules={[
              { required: true, message: "Vui lòng chọn ID thuộc tính!" },
            ]}
          >
            <Select>
              {thuocTinhList.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.TenThuocTinh} {/* Hiển thị tên thuộc tính */}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="GiaTri"
            label="Giá trị"
            rules={[{ required: true, message: "Vui lòng nhập giá trị!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(GiaTriThuocTinhPage);
