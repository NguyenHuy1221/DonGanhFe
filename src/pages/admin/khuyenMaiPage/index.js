import React, { useState, useEffect, memo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Space,
  Popconfirm,
  message,
  Card,
  Col,
  Row,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./style.scss";
import {
  layDanhSachKhuyenMai,
  layDanhSachLoaiKhuyenMai,
  addKhuyenMai,
  updateKhuyenMai,
  deleteKhuyenMai,
} from "../../../api/khuyenMaiService";
import { formatter, numberFormatter } from "../../../utils/fomater";
import Meta from "antd/es/card/Meta";

const KhuyenMaiPage = () => {
  const [duLieu, setDuLieu] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [loaiKhuyenMaiList, setLoaiKhuyenMaiList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchKhuyenMaiList();
    fetchLoaiKhuyenMaiList();
  }, []);

  const fetchKhuyenMaiList = async () => {
    try {
      const data = await layDanhSachKhuyenMai();
      setDuLieu(data);
      console.log("km" , data);
    } catch (error) {
      console.error(error.message);
      message.error("Lấy danh sách khuyến mãi thất bại");
    }
  };

  const fetchLoaiKhuyenMaiList = async () => {
    try {
      const data = await layDanhSachLoaiKhuyenMai();
      setLoaiKhuyenMaiList(data);
    } catch (error) {
      console.error(error.message);
      message.error("Lấy danh sách loại khuyến mãi thất bại");
    }
  };

  const themKhuyenMaiHandler = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const suaKhuyenMaiHandler = (record) => {
    console.log("Sửa khuyến mãi:", record); // Thêm dòng log để kiểm tra
    setIsEditing(true);
    setEditRecord(record);
    // form.setFieldsValue({
    //   ...record,
    //   NgayBatDau: moment(record.NgayBatDau, "YYYYMMDD"),
    //   NgayKetThuc: moment(record.NgayKetThuc, "YYYYMMDD"),
    //   LoaiKhuyenMai: record.IDLoaiKhuyenMai?._id,
    // });
    form.setFieldsValue({
      ...record,
      NgayBatDau: moment(record.NgayBatDau, ["YYYYMMDD", "YYYY-MM-DD"]),
      NgayKetThuc: moment(record.NgayKetThuc, ["YYYYMMDD", "YYYY-MM-DD"]),
      LoaiKhuyenMai: record.IDLoaiKhuyenMai?._id,
    });
    setIsModalVisible(true);
  };

  const xoaKhuyenMaiHandler = async (id) => {
    try {
      await deleteKhuyenMai(id);
      await fetchKhuyenMaiList();
      message.success("Xóa khuyến mãi thành công");
    } catch (error) {
      console.error(error.message);
      message.error("Xóa khuyến mãi thất bại");
    }
  };

  const xacNhanHandler = async () => {
    try {
      const values = await form.validateFields();

      // Kiểm tra xem ngày có hợp lệ không
      if (values.NgayBatDau && values.NgayKetThuc) {
        // values.NgayBatDau = values.NgayBatDau.format("YYYYMMDD");
        // values.NgayKetThuc = values.NgayKetThuc.format("YYYYMMDD");
        values.NgayBatDau = values.NgayBatDau.format("YYYY-MM-DD");
        values.NgayKetThuc = values.NgayKetThuc.format("YYYY-MM-DD");
      }

      // Đổi tên trường LoaiKhuyenMai thành IDLoaiKhuyenMai
      values.IDLoaiKhuyenMai = values.LoaiKhuyenMai;
      delete values.LoaiKhuyenMai;

      console.log("Dữ liệu sửa:", values); // Kiểm tra dữ liệu sửa trước khi gửi đi

      let response;
      if (isEditing) {
        response = await updateKhuyenMai({ ...values, _id: editRecord._id });
        if (response) {
          message.success("Cập nhật khuyến mãi thành công");
          setIsModalVisible(false);
          await fetchKhuyenMaiList();
        } else {
          message.error("Cập nhật khuyến mãi thất bại");
        }
      } else {
        response = await addKhuyenMai(values);
        if (response) {
          message.success("Thêm khuyến mãi thành công");
          setIsModalVisible(false);
          await fetchKhuyenMaiList();
        } else {
          message.error("Thêm khuyến mãi thất bại");
        }
      }
    } catch (error) {
      console.error("Lỗi xác thực:", error); // Log lỗi nếu có
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const huyHandler = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Tên khuyến mãi",
      dataIndex: "TenKhuyenMai",
      key: "TenKhuyenMai",
      className: "km-ten-khuyen-mai",
    },
    {
      title: "Loại khuyến mãi",
      dataIndex: ["IDLoaiKhuyenMai", "TenLoaiKhuyenMai"],
      key: "TenLoaiKhuyenMai",
    },
    {
      title: "Mô tả",
      dataIndex: "MoTa",
      key: "MoTa",
    },
    {
      title: "Giá trị khuyến mãi",
      dataIndex: "GiaTriKhuyenMai",
      key: "GiaTriKhuyenMai",
      render: (value) => formatter(value),
    },
    // {
    //   title: "Giá trị khuyến mãi",
    //   dataIndex: "GiaTriKhuyenMai",
    //   key: "GiaTriKhuyenMai",
    //   render: (value, record) => {
    //     // Kiểm tra loại khuyến mãi
    //     const loaiKhuyenMai = loaiKhuyenMaiList.find(
    //       (item) => item._id === record.IDLoaiKhuyenMai
    //     );
    //     if (loaiKhuyenMai && loaiKhuyenMai.TenLoaiKhuyenMai === "Khuyến mãi theo Phần trăm giỏ hàng") {
    //       return `${value}%`; // Hiển thị phần trăm nếu là loại giảm giá phần trăm
    //     }
    //     return formatter(value); // Hiển thị giá trị tiền nếu không phải phần trăm
    //   },
    // },
    {
      title: "Tổng số lượng",
      dataIndex: "TongSoLuongDuocTao",
      key: "TongSoLuongDuocTao",
      render: (value) => numberFormatter(value),
    },
    {
      title: "Số lượng hiện tại",
      dataIndex: "SoLuongHienTai",
      key: "SoLuongHienTai",
      render: (value) => numberFormatter(value),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "NgayBatDau",
      key: "NgayBatDau",
      render: (text) =>
        moment(text, ["YYYYMMDD", "YYYY-MM-DD"]).format("YYYY-MM-DD"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "NgayKetThuc",
      key: "NgayKetThuc",
      render: (text) =>
        moment(text, ["YYYYMMDD", "YYYY-MM-DD"]).format("YYYY-MM-DD"),
    },

    {
      title: "Hành động",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="km-action-button"
            icon={<EditOutlined />}
            onClick={() => suaKhuyenMaiHandler(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khuyến mãi này không?"
            onConfirm={() => xoaKhuyenMaiHandler(record._id)}
          >
            <Button className="km-action-button" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1 className="km-title">Quản lý khuyến mãi</h1>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={themKhuyenMaiHandler}
        style={{ marginBottom: 16 }}
        className="km-add-button"
      >
        Thêm khuyến mãi
      </Button>

      <div className="km-card-container">
        {duLieu.map((item) => (
          <Card
            key={item._id}
            className="km-card"
            title={`${item.GiaTriKhuyenMai}đ`}
           
            extra={
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => suaKhuyenMaiHandler(item)}
                />
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa?"
                  onConfirm={() => xoaKhuyenMaiHandler(item._id)}
                >
                  <Button icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </Space>
            }
          >
            <Meta
              title={item.TenKhuyenMai}
              description={`Hiệu lực: ${moment(item.NgayBatDau).format(
                "DD/MM/YYYY"
              )} - ${moment(item.NgayKetThuc).format("DD/MM/YYYY")}`}
            />
            <p>Số lượng: {item.TongSoLuongDuocTao}</p>
          </Card>
        ))}
      </div>

      {/* <Table
        className="km-table"
        columns={columns}
        dataSource={duLieu}
        pagination={true}
      /> */}

      <Modal
        title={isEditing ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}
        visible={isModalVisible}
        onOk={xacNhanHandler}
        onCancel={huyHandler}
        okText={isEditing ? "Cập nhật" : "Thêm"}
        className="km-modal"
      >
        <Form
          form={form}
          layout="vertical"
          name="khuyen_mai_form"
          className="km-form"
        >
          <Form.Item
            name="TenKhuyenMai"
            label="Tên khuyến mãi"
            className="km-form-item"
            rules={[
              { required: true, message: "Vui lòng nhập tên khuyến mãi!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="LoaiKhuyenMai"
            label="Loại khuyến mãi"
            className="km-form-item"
            rules={[
              { required: true, message: "Vui lòng chọn loại khuyến mãi!" },
            ]}
          >
            <Select>
              {loaiKhuyenMaiList.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.TenLoaiKhuyenMai}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="GioiHanGiaTriDuocApDung"
            label="Giới hạn giá trị được áp dụng"
            className="km-form-item"
            rules={[
              { required: true, message: "Vui lòng nhập giới hạn giá trị!" },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Giới hạn giá trị"
              formatter={
                (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Thêm dấu phẩy mà không làm thay đổi giá trị gốc
              }
            />
          </Form.Item>

          <Form.Item
            name="GioiHanGiaTriGiamToiDa"
            label="Giới hạn giá trị giảm tối đa (chỉ áp dụng cho loại giảm giá theo %)"
            className="km-form-item"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giới hạn giá trị giảm!",
              },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Giới hạn giá trị giảm"
              formatter={
                (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Thêm dấu phẩy mà không làm thay đổi giá trị gốc
              }
            />
          </Form.Item>
          <Form.Item
            name="MoTa"
            label="Mô tả"
            className="km-form-item"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="GiaTriKhuyenMai"
            label="Giá trị khuyến mãi"
            className="km-form-item"
            rules={[
              { required: true, message: "Vui lòng nhập giá trị khuyến mãi!" },
              {
                type: "number",
                min: 0,
                message: "Giá trị khuyến mãi phải là số và không âm!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const gioiHanGiaTri = getFieldValue("GioiHanGiaTriDuocApDung");
                  if (value && gioiHanGiaTri && value > gioiHanGiaTri) {
                    return Promise.reject(new Error("Giá trị khuyến mãi phải nhỏ hơn giới hạn giá trị được áp dụng"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={
                (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Thêm dấu phẩy mà không làm thay đổi giá trị gốc
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")} // Loại bỏ các dấu phẩy khi parse giá trị
            />
          </Form.Item>
          <Form.Item
            name="TongSoLuongDuocTao"
            label="Tổng số lượng"
            className="km-form-item"
            rules={[
              { required: true, message: "Vui lòng nhập tổng số lượng!" },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={
                (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Thêm dấu phẩy mà không làm thay đổi giá trị gốc
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")} // Loại bỏ các dấu phẩy khi parse giá trị
            />
          </Form.Item>
          <Form.Item
            name="SoLuongHienTai"
            label="Số lượng hiện tại"
            className="km-form-item"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng hiện tại!" },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={
                (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Thêm dấu phẩy mà không làm thay đổi giá trị gốc
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")} // Loại bỏ các dấu phẩy khi parse giá trị
            />
          </Form.Item>
          <Form.Item
            name="NgayBatDau"
            label="Ngày bắt đầu"
            className="km-form-item"
            rules={[
              { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value.isBefore(moment())) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Ngày bắt đầu không thể là ngày trong quá khứ")
                  );
                },
              }),
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="NgayKetThuc"
            label="Ngày kết thúc"
            className="km-form-item"
            rules={[
              { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value.isAfter(getFieldValue("NgayBatDau"))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Ngày kết thúc phải sau ngày bắt đầu")
                  );
                },
              }),
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            className="km-form-item"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Select.Option value={0}>Hoạt động</Select.Option>
              <Select.Option value={1}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(KhuyenMaiPage);
