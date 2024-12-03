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
  Select,
  Row,
  Col,
  InputNumber,
} from "antd";

import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  layDanhSachSanPham,
  layDanhSachBienThe,
  themBienThe,
  suaBienThe,
  xoaBienThe,
} from "../../../api/bienTheService";
import axios from "axios";
import { layDanhSachThuocTinh } from "../../../api/thuocTinhService";
import { formatter, numberFormatter } from "../../../utils/fomater";
import { updateThuocTinh, addThuocTinh } from "../../../api/productService";
const BienThePage = () => {
  const { Option } = Select;
  const [duLieu, setDuLieu] = useState([]);
  const [duLieuSanPham, setDuLieuSanPham] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form] = Form.useForm();
  const [giaTriThuocTinh, setGiaTriThuocTinh] = useState({});
  const [thuocTinhList, setThuocTinhList] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([
    { thuocTinhSKU: null, giaTri: null },
  ]);
  const [thuocTinhGiaTri, setThuocTinhGiaTri] = useState([]);
  const [isAttributeModalVisible, setIsAttributeModalVisible] = useState(false);
  const [attributeForm] = Form.useForm();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    fetchData();
    fetchThuocTinh();
  }, []);

  useEffect(() => {
    if (!isAttributeModalVisible) {
      attributeForm.resetFields();
    }
  }, [isAttributeModalVisible]);

  useEffect(() => {
    if (duLieuSanPham) {
      // Lặp qua danh sách thuộc tính để gọi fetchGiaTriThuocTinh cho mỗi thuộc tính
      duLieuSanPham.DanhSachThuocTinh.forEach(async (thuocTinh) => {
        const giaTri = await fetchGiaTriThuocTinh(thuocTinh.thuocTinh._id);
        setGiaTriThuocTinh((prev) => ({
          ...prev,
          [thuocTinh.thuocTinh._id]: giaTri,
        }));
      });
    }
  }, [duLieuSanPham]);

  const fetchData = async () => {
    try {
      const productId = localStorage.getItem("productId");
      const data = await layDanhSachBienThe(productId);
      const sanPham = await layDanhSachSanPham(productId);
      setDuLieu(data);
      setDuLieuSanPham(sanPham);

      console.log("dâtt", data);
      console.log("sản phẩm", sanPham);
    } catch (error) {
      message.error("Lấy danh sách biến thể thất bại");
    }
  };

  const onThuocTinhSelect = async (value, index) => {
    // Cập nhật thuộc tính đã chọn
    const updatedAttributes = [...selectedAttributes];
    updatedAttributes[index].thuocTinhSKU = value;
    setSelectedAttributes(updatedAttributes);
    setThuocTinhGiaTri([]); // Reset giá trị thuộc tính

    // Gọi hàm để lấy giá trị thuộc tính tương ứng
    await fetchGiaTriThuocTinh(value);
  };

  const handleAddAttribute = async () => {
    try {
      const values = await attributeForm.validateFields();

      // Format dữ liệu thành object đúng định dạng
      const formattedAttributes = {
        thuocTinhId: values[`thuocTinhSKU_0`], // Lấy ID thuộc tính đầu tiên
        giaTriThuocTinhIds: values[`giaTri_0`], // Lấy giá trị thuộc tính
      };

      console.log("Dữ liệu gửi đi:", formattedAttributes);

      // Gửi API để cập nhật hoặc thêm thuộc tính
      const response = isEditing
        ? await updateThuocTinh(duLieuSanPham._id, formattedAttributes) // Gọi API cập nhật
        : await addThuocTinh(duLieuSanPham._id, formattedAttributes); // Gọi API thêm mới

      // Kiểm tra phản hồi từ API
      if (response) {
        message.success("Thêm thuộc tính thành công");
        setIsAttributeModalVisible(false);
        fetchData();
        attributeForm.resetFields();
      } else {
        message.error("Thêm thuộc tính thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm thuộc tính:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // const handleAddAttribute = async () => {
  //   try {
  //     const values = await attributeForm.validateFields();

  //     // Format dữ liệu thành object đúng định dạng
  //     const formattedAttributes = {
  //       thuocTinhId: values[`thuocTinhSKU_0`], // Lấy ID thuộc tính đầu tiên
  //       giaTriThuocTinhIds: values[`giaTri_0`], // Lấy giá trị thuộc tính
  //     };

  //     console.log("Dữ liệu gửi đi:", formattedAttributes);

  //     // Gửi API để cập nhật hoặc thêm thuộc tính
  //     const response = isEditing
  //       ? await axios.put(
  //           `/api/sanpham/updateThuocTinhForSanPham/${duLieuSanPham._id}`,
  //           formattedAttributes
  //         )
  //       : await axios.post(
  //           `/api/sanpham/addThuocTinhForSanPham/${duLieuSanPham._id}`,
  //           formattedAttributes
  //         );

  //     if (response.status === 200) {
  //       message.success("Cập nhật thuộc tính thành công");
  //       setIsAttributeModalVisible(false);
  //       fetchData();
  //       attributeForm.resetFields();
  //     } else {
  //       message.error("Thêm thuộc tính thất bại.");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi thêm thuộc tính:", error);
  //     message.error("Có lỗi xảy ra, vui lòng thử lại!");
  //   }
  // };

  const fetchThuocTinh = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const data = await layDanhSachThuocTinh(userId);
      // Lọc bỏ các thuộc tính bị xóa (isDeleted === true)
      // const filteredData = data.filter((item) => !item.isDeleted);
      setThuocTinhList(data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách thuộc tính");
    }
  };

  const fetchGiaTriThuocTinh = async (id) => {
    try {
      const response = await axios.get(
        `/api/thuoctinhgiatri/findThuocTinhGiaTri/${id}`
      );
      // Lọc bỏ các giá trị thuộc tính bị xóa (isDeleted === true)
      // const filteredData = response.data.filter((item) => !item.isDeleted);
      setThuocTinhGiaTri(response.data);
      return response.data;
    } catch (error) {
      message.error("Lỗi khi tải giá trị thuộc tính!");
    }
  };

  const getAvailableAttributes = (currentIndex) => {
    // Lọc thuộc tính đã được chọn
    return thuocTinhList.filter((thuocTinh, index) =>
      selectedAttributes.every(
        (attribute, i) =>
          i === currentIndex || attribute.thuocTinhSKU !== thuocTinh._id
      )
    );
  };

  const handleAttributeChange = (index, thuocTinhSKU, values) => {
    const newSelectedAttributes = [...selectedAttributes];
    newSelectedAttributes[index] = {
      ...newSelectedAttributes[index],
      thuocTinhSKU,
      giaTri: values,
    };
    setSelectedAttributes(newSelectedAttributes);
  };

  const themBienTheHandler = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const suaBienTheHandler = (record) => {
    setIsEditing(true);
    setEditRecord(record);

    // Lấy dữ liệu của các thuộc tính đã chọn và chuẩn bị cho form
    const giaTriThuocTinhValues = {};
    record.KetHopThuocTinh.forEach((item, index) => {
      giaTriThuocTinhValues[`giaTriThuocTinh${index}`] =
        item.IDGiaTriThuocTinh._id; // Đặt ID giá trị thuộc tính
    });

    form.setFieldsValue({
      ...record,
      ...giaTriThuocTinhValues, // Đổ dữ liệu thuộc tính vào form
    });

    setIsModalVisible(true);
  };

  const xoaBienTheHandler = async (id) => {
    try {
      await xoaBienThe(id);
      fetchData();
      message.success("Xóa biến thể thành công");
    } catch (error) {
      message.error("Xóa biến thể thất bại");
    }
  };

  const xacNhanHandler = async () => {
    try {
      // Xác thực và lấy giá trị từ form
      const values = await form.validateFields();
      console.log("Giá trị từ form:", values); // Ghi lại giá trị từ form

      // Tạo mảng KetHopThuocTinh từ các giá trị thuộc tính
      const ketHopThuocTinh = [];
      duLieuSanPham.DanhSachThuocTinh.forEach((thuocTinh, index) => {
        const giaTri = values[`giaTriThuocTinh${index}`]; // Lấy giá trị từ form
        console.log(`Giá trị thuộc tính ${index}:`, giaTri); // Log giá trị thuộc tính

        // Kiểm tra xem giaTri có phải là một mảng không
        if (Array.isArray(giaTri)) {
          giaTri.forEach((idGiaTri) => {
            ketHopThuocTinh.push({ IDGiaTriThuocTinh: idGiaTri }); // Thêm vào mảng
          });
        } else if (giaTri) {
          // Nếu giaTri không phải là mảng nhưng vẫn có giá trị
          ketHopThuocTinh.push({ IDGiaTriThuocTinh: giaTri }); // Thêm vào mảng
        }
      });

      const dataToSend = {
        sku: values.sku,
        gia: values.gia,
        soLuong: values.soLuong,
        KetHopThuocTinh: ketHopThuocTinh, // Đưa mảng vào đối tượng cuối cùng
      };

      console.log("Dữ liệu gửi đi:", dataToSend); // Log dữ liệu sẽ được gửi đi

      if (isEditing) {
        console.log("Cập nhật biến thể với ID:", editRecord._id); // Ghi lại ID biến thể đang sửa
        await suaBienThe({ ...dataToSend, id: editRecord._id }); // Gọi hàm cập nhật với ID biến thể
        message.success("Cập nhật biến thể thành công");
      } else {
        const IDSanPham = localStorage.getItem("productId");
        if (!IDSanPham) {
          message.error("Không tìm thấy ID sản phẩm.");
          return;
        }
        console.log("Thêm biến thể với dữ liệu:", dataToSend); // Ghi lại dữ liệu thêm
        await themBienThe(IDSanPham, dataToSend); // Gọi hàm thêm với ID sản phẩm
        message.success("Thêm biến thể thành công");
      }

      setIsModalVisible(false);
      fetchData(); // Lấy lại dữ liệu sau khi thêm
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật biến thể:", error); // Log lỗi nếu có
      message.error("Biến thể đã tồn tại!");
    }
  };

  const huyHandler = () => {
    setIsModalVisible(false);
    attributeForm.resetFields();
  };

  const xoaThuocTinhHandler = async (record) => {
    try {
      const parentId = record.key.split("-")[0];

      await axios.delete(
        `/api/sanpham/deleteThuocTinhForSanPham/${duLieuSanPham._id}/${parentId}/${record._id}`
      ); // Gọi API xóa thuộc tính
      message.success("Xóa thuộc tính thành công");
      fetchData(); // Lấy lại dữ liệu sau khi xóa
      console.log("xóa này ", record);
    } catch (error) {
      message.error("Xóa thuộc tính thất bại");
      console.log("xóa này ", record);
    }
  };

  const cotDuLieu = [
    { title: "Mã biến thể", dataIndex: "sku", key: "sku" },
    {
      title: "Giá",
      dataIndex: "gia",
      key: "gia",
      render: (text) => formatPrice(text),
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      render: (value) => numberFormatter(value),
    },
    {
      title: "Thuộc tính",
      key: "thuocTinh",
      render: (_, record) => (
        <span>
          {record.KetHopThuocTinh?.map((item) => (
            <span key={item?._id}>
              {item?.IDGiaTriThuocTinh?.GiaTri || "Không có giá trị"}{" "}
            </span>
          )) || <span>Không có thuộc tính</span>}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => suaBienTheHandler(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa biến thể này không?"
            onConfirm={() => xoaBienTheHandler(record._id)}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1>Quản lý biến thể sản phẩm</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={themBienTheHandler}
        style={{ marginBottom: 16 }}
      >
        Thêm biến thể
      </Button>
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() => setIsAttributeModalVisible(true)}
      >
        Thêm thuộc tính
      </Button>
      {duLieuSanPham && (
        <div style={{ marginBottom: "16px" }}>
          {/* Hiển thị danh sách thuộc tính */}
          <h3>
            Sản phẩm:{" "}
            <span style={{ fontWeight: "bold" }}>
              {duLieuSanPham.TenSanPham}
            </span>
          </h3>
          <Table
            columns={[
              {
                title: <span>Tên thuộc tính</span>,
                dataIndex: "TenThuocTinh",
                key: "TenThuocTinh",
              },
              {
                title: <span>Giá trị</span>,
                dataIndex: "GiaTri",
                key: "GiaTri",
              },
              {
                title: <span style={{ textAlign: "right" }}>Hành động</span>,
                key: "actions",
                render: (_, record) => (
                  <Space size="middle" style={{ float: "right" }}>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa thuộc tính này?"
                      onConfirm={() => xoaThuocTinhHandler(record)} // Hàm xóa thuộc tính
                    >
                      <Button icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                ),
                align: "right", // Căn phải cho cột hành động
              },
            ]}
            dataSource={duLieuSanPham.DanhSachThuocTinh.flatMap((thuocTinh) =>
              thuocTinh.giaTriThuocTinh.map((giaTri) => ({
                key: `${thuocTinh.thuocTinh._id}-${giaTri._id}`,
                TenThuocTinh: thuocTinh.thuocTinh.TenThuocTinh,
                GiaTri: giaTri.GiaTri,
                _id: giaTri._id, // Giữ lại ID để dùng khi xóa
              }))
            )}
            pagination={false}
            bordered
            size="small"
          />
        </div>
      )}

      <Table columns={cotDuLieu} dataSource={duLieu} pagination={false} />
      <Modal
        title={isEditing ? "Sửa biến thể" : "Thêm biến thể"}
        visible={isModalVisible}
        onOk={xacNhanHandler}
        onCancel={huyHandler}
        okText={isEditing ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" name="bien_the_form">
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: "Vui lòng nhập mã biến thể!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gia"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={numberFormatter}
              parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            name="soLuong"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={numberFormatter}
              parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
            />
          </Form.Item>

          {duLieuSanPham?.DanhSachThuocTinh?.map((thuocTinh, index) => (
            <Form.Item key={thuocTinh.thuocTinh._id}>
              <Row gutter={16} justify="center" align="middle">
                <Col span={12}>
                  <Form.Item label="Thuộc tính">
                    <Input value={thuocTinh.thuocTinh.TenThuocTinh} readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={`giaTriThuocTinh${index}`}
                    label={`Giá trị của ${thuocTinh.thuocTinh.TenThuocTinh}`}
                    rules={[
                      { required: true, message: "Vui lòng chọn giá trị!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn giá trị"
                      onFocus={async () => {
                        const giaTri = await fetchGiaTriThuocTinh(
                          thuocTinh.thuocTinh._id
                        );
                        setGiaTriThuocTinh((prev) => ({
                          ...prev,
                          [thuocTinh.thuocTinh._id]: giaTri,
                        }));
                      }}
                    >
                      {(giaTriThuocTinh[thuocTinh.thuocTinh._id] || []).map(
                        (giaTri) => (
                          <Select.Option key={giaTri._id} value={giaTri._id}>
                            {giaTri.GiaTri}
                          </Select.Option>
                        )
                      )}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          ))}
        </Form>
      </Modal>

      <Modal
        title="Thêm thuộc tính"
        visible={isAttributeModalVisible}
        onCancel={() => setIsAttributeModalVisible(false)}
        onOk={handleAddAttribute}
      >
        <Form form={attributeForm} layout="vertical">
          {selectedAttributes.map((attribute, index) => (
            <Row gutter={16} key={index}>
              <Col span={11}>
                <Form.Item
                  label="Chọn Thuộc Tính"
                  name={`thuocTinhSKU_${index}`}
                  rules={[
                    { required: true, message: "Vui lòng chọn thuộc tính!" },
                  ]}
                >
                  <Select
                    value={attribute.thuocTinhSKU}
                    onChange={(value) => onThuocTinhSelect(value, index)}
                  >
                    {getAvailableAttributes(index).map((thuocTinh) => (
                      <Option key={thuocTinh._id} value={thuocTinh._id}>
                        {thuocTinh.TenThuocTinh}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  label="Giá Trị"
                  name={`giaTri_${index}`}
                  rules={[
                    { required: true, message: "Vui lòng chọn giá trị!" },
                  ]}
                >
                  <Select
                    mode="multiple"
                    value={attribute.giaTri}
                    onChange={(value) =>
                      handleAttributeChange(
                        index,
                        attribute.thuocTinhSKU,
                        value
                      )
                    }
                    disabled={!attribute.thuocTinhSKU}
                  >
                    {thuocTinhGiaTri.map((item) => (
                      <Option key={item._id} value={item._id}>
                        {item.GiaTri}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal>
    </>
  );
};

export default memo(BienThePage);
