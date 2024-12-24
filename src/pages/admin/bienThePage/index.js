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
  Checkbox,
  Card,
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
import { Text } from "recharts";
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
  const [isToHopBienThe, setToHopBienThe] = useState(false);

  const [attributeForm] = Form.useForm();
  const [toHopBienTheForm] = Form.useForm();

  const [recordIdEditing, setRecordIdEditing] = useState(null);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    if (!isModalVisible) {
      fetchThuocTinh(); // Làm mới danh sách thuộc tính khi đóng modal biến thể
    }
  }, [isModalVisible]);

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
      const filteredData = data.filter((item) => !item.isDeleted);

      setDuLieu(filteredData);  // Sử dụng filteredData để set dữ liệu đã lọc
      // setDuLieu(data);
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
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      const response = await axios.get(
        `/api/thuoctinhgiatri/findThuocTinhGiaTri/${id}` , {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào headers
          },
        }
      );
      setThuocTinhGiaTri(response.data); // Không lọc, lấy tất cả giá trị
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
      const token = localStorage.getItem("token");
      await xoaBienThe(id,token);
      fetchData();
      message.success("Xóa biến thể thành công");
    } catch (error) {
      message.error("Xóa biến thể thất bại");
    }
  };
  const xacNhanHandler = async () => {
    try {
      const values = await form.validateFields();

      console.log("Giá trị form trước khi xử lý:", values);

      const ketHopThuocTinh = duLieuSanPham.DanhSachThuocTinh.map(
        (thuocTinh, index) => {
          const giaTri = values[`giaTriThuocTinh${index}`];
          return {
            IDGiaTriThuocTinh: Array.isArray(giaTri)
              ? giaTri.filter((id) =>
                  thuocTinh.giaTriThuocTinh.some((gt) => gt._id === id)
                )
              : thuocTinh.giaTriThuocTinh.some((gt) => gt._id === giaTri)
              ? giaTri
              : null,
          };
        }
      ).filter((item) => item.IDGiaTriThuocTinh);

      if (!ketHopThuocTinh.length) {
        message.error("Vui lòng chọn giá trị hợp lệ!");
        return;
      }

      const dataToSend = {
        sku: values.sku,
        gia: values.gia,
        soLuong: values.soLuong,
        KetHopThuocTinh: ketHopThuocTinh,
      };

      console.log("Dữ liệu gửi lên server:", dataToSend);
      const token = localStorage.getItem("token");
      if (isEditing) {
        // Gọi API sửa biến thể
        // const response = await suaBienThe({
        //   ...dataToSend,
        //   id: editRecord._id,
        // });
        const response = await suaBienThe(
          {
            ...dataToSend,
            id: editRecord._id, // Dữ liệu biến thể cần sửa
          },
          token // Truyền token vào hàm
        );
        console.log("Phản hồi từ API khi sửa:", response);
        message.success("Cập nhật biến thể thành công");
      } else {
        // Gọi API thêm biến thể
        // const response = await themBienThe(
        //   localStorage.getItem("productId"),
        //   dataToSend
        // );
        const response = await themBienThe(
          localStorage.getItem("productId"), // Lấy productId từ localStorage
          dataToSend, // Dữ liệu biến thể
          token // Truyền token vào hàm
        );
        console.log("Phản hồi từ API khi thêm:", response);
        message.success("Thêm biến thể thành công");
      }

      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật biến thể:", error);
      message.error("Lỗi khi thêm/cập nhật biến thể!");
    }
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

  const huyHandler = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    form.resetFields();
  };

  const xoaThuocTinhHandler = async (record) => {
    try {
      const parentId = record.key.split("-")[0];
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      await axios.delete(
        `/api/sanpham/deleteThuocTinhForSanPham/${duLieuSanPham._id}/${parentId}/${record._id}` , {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào headers
          },
        }
      ); // Gọi API xóa thuộc tính
      message.success("Xóa thuộc tính thành công");
      fetchData(); // Lấy lại dữ liệu sau khi xóa
      console.log("xóa này ", record);
    } catch (error) {
      message.error("Xóa thuộc tính thất bại");
      console.log("xóa này ", record);
    }
  };

  const handleToHopBienThe = async () => {
    try {
      // Lấy dữ liệu từ form
      const values = await toHopBienTheForm.validateFields();
  
      // Thêm ID sản phẩm vào dữ liệu gửi
      const idsp = duLieuSanPham._id;
      console.log("id sản phẩm " , idsp);
      const payload = {
        IDSanPham: idsp, 
        sku: values.sku,
        gia: values.gia,
        soLuong: values.soLuong,
      };
  
      // Gửi dữ liệu qua API
      const token = localStorage.getItem("token");
      // const response = await axios.post(
      //   "/api/sanpham/ToHopBienThePhienBanBangTay",
      //   payload
      // );
      const response = await axios.post(
        "/api/sanpham/ToHopBienThePhienBanBangTay",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
  
      // Xử lý khi gọi API thành công
      if (response.status === 200) {
        setToHopBienThe(false); // Đóng modal
        toHopBienTheForm.resetFields(); // Reset form
        fetchData();
        message.success("Tổ hợp biến thể thành công");

      } else {
        message.error("Tổ hợp biến thể thất bại.");
      }
    } catch (error) {
      message.error("Tổ hợp biến thể thất bại.");
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
        style={{margin : 10}}
      >
        Thêm thuộc tính
      </Button>
      <Button
        icon={<PlusOutlined />}
        onClick={() => setToHopBienThe(true)}
        style={{ backgroundColor: "#4CAF50", color: "white" ,margin : 5}}
      >
        Tổ hợp biến thể
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
        onCancel={() => {
          huyHandler(); // Xử lý đóng modal
          form.resetFields(); // Reset dữ liệu form khi tắt modal
        }}
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
          {isEditing ? (
            // Trường hợp sửa
            editRecord &&
            editRecord.KetHopThuocTinh &&
            editRecord.KetHopThuocTinh.length > 0 ? (
              editRecord.KetHopThuocTinh.map((thuocTinh, index) => {
                const thuocTinhID =
                  thuocTinh?.IDGiaTriThuocTinh?.ThuocTinhID?._id;

                // Lấy danh sách giá trị có trong thuộc tính từ `duLieuSanPham`
                const giaTriThuocTinhSanPham =
                  duLieuSanPham?.DanhSachThuocTinh?.find(
                    (item) => item.thuocTinh._id === thuocTinhID
                  )?.giaTriThuocTinh || [];

                return (
                  <Row key={thuocTinhID} gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Thuộc tính">
                        <Input
                          value={
                            thuocTinh?.IDGiaTriThuocTinh?.ThuocTinhID
                              ?.TenThuocTinh
                          }
                          readOnly
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Giá trị"
                        name={`giaTriThuocTinh${index}`}
                        initialValue={thuocTinh?.IDGiaTriThuocTinh?._id}
                      >
                        <Select>
                          {giaTriThuocTinhSanPham.map((giaTri) => (
                            <Select.Option key={giaTri._id} value={giaTri._id}>
                              {giaTri.GiaTri}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                );
              })
            ) : (
              <span>Không có thuộc tính</span>
            )
          ) : (
            // Trường hợp thêm
            duLieuSanPham?.DanhSachThuocTinh?.map((thuocTinh, index) => (
              <Form.Item key={thuocTinh.thuocTinh._id}>
                <Row gutter={16} justify="center" align="middle">
                  <Col span={12}>
                    <Form.Item label="Thuộc tính">
                      <Input
                        value={thuocTinh.thuocTinh.TenThuocTinh}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={`giaTriThuocTinh${index}`}
                      label={`Giá trị của ${thuocTinh.thuocTinh.TenThuocTinh}`}
                    >
                      <Select
                        placeholder="Chọn giá trị"
                        onFocus={async () => {
                          // Lấy danh sách giá trị thuộc tính trong sản phẩm
                          const thuocTinhTrongSanPham =
                            duLieuSanPham.DanhSachThuocTinh.find(
                              (item) =>
                                item.thuocTinh._id === thuocTinh.thuocTinh._id
                            );
                          const giaTri =
                            thuocTinhTrongSanPham?.giaTriThuocTinh || [];
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
            ))
          )}
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

      <Modal
        title="Tổ hợp biến thể"
        visible={isToHopBienThe}
        onCancel={() => {
          setToHopBienThe(false); 
          toHopBienTheForm.resetFields(); 
        }}
        onOk={handleToHopBienThe}
        width={800}
      >
        <Form form={toHopBienTheForm}>
          <h1>Tổ hợp biến thể</h1>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[{ required: true, message: "Vui lòng nhập SKU!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
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
            </Col>
            <Col span={8}>
              <Form.Item
                name="soLuong"
                label="Số Lượng"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={numberFormatter}
                  parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

    </>
  );
};

export default memo(BienThePage);
