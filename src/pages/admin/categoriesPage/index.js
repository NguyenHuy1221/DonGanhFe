import React, { useState, useEffect, memo } from "react";
import {
  Table,
  message,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Upload,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  getDanhMucList,
  deleteDanhMucCha,
  deleteDanhMucCon,
  updateDanhMucCha,
  createDanhMucCha,
  updateDanhMucCon,
  createDanhMucCon,
} from "../../../api/danhMucService";
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for editing
  const [currentCategoryId, setCurrentCategoryId] = useState(null); // To hold current category ID
  const [imagePreview, setImagePreview] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [isSubCategoryModalVisible, setIsSubCategoryModalVisible] =
    useState(false);
  const [isEditingSubCategory, setIsEditingSubCategory] = useState(false);
  const [currentSubCategoryId, setCurrentSubCategoryId] = useState(null);

  const [subCategoryForm] = Form.useForm();
  const [form] = Form.useForm();

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      // const response = await axios.get("/api/danhmuc/getlistDanhMuc");
      // setCategories(response.data);
      const data = await getDanhMucList();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
      message.error("Lấy danh mục thất bại");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle delete category
  const handleDelete = async (id) => {
    try {
      // await axios.delete(`/api/danhmuc/deleteDanhMucCha/${id}`);
      await deleteDanhMucCha(id);
      message.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      message.error("Xóa danh mục thất bại");
    }
  };

  // Handle subcategory deletion
  const deleteSubCategoryHandler = async (parentRecord, subCategoryId) => {
    try {
      // const response = await axios.delete(
      //   `/api/danhmuc/deleteDanhMucCon/${parentRecord._id}/${subCategoryId}`
      // );
      await deleteDanhMucCon(parentRecord._id, subCategoryId);
      message.success("Xóa danh mục con thành công");

      // Fetch updated categories after deletion
      fetchCategories();
    } catch (error) {
      message.error("Xóa danh mục con thất bại");
      console.error("Lỗi khi xóa danh mục con:", error);
    }
  };

  const showModal = (category = null) => {
    if (category) {
      setIsEditing(true);
      setCurrentCategoryId(category._id); // Set the current category ID
      setEditRecord(category); // Cập nhật editRecord với dữ liệu danh mục hiện tại
      form.setFieldsValue({
        IDDanhMuc: category.IDDanhMuc,
        TenDanhMuc: category.TenDanhMuc,
      });

      // Set the current image URL as preview when editing
      setImagePreview(category.AnhDanhMuc);
    } else {
      setIsEditing(false);
      setEditRecord(null); // Đặt lại editRecord để đảm bảo không giữ lại dữ liệu cũ
      form.resetFields();
      setImagePreview(null); // Clear the image preview when adding new category
    }
    setIsModalVisible(true);
  };

  // Handle submit form
  // const handleOk = async () => {
  //   let isDuplicateId = false;
  //   try {
  //     const values = await form.validateFields();
  //     console.log("Giá trị form:", values);
  //     isDuplicateId = categories.some(
  //       (category) =>
  //         category.IDDanhMuc === values.IDDanhMuc &&
  //         (!isEditing || category._id !== editRecord._id)
  //     );

  //     if (!isEditing && isDuplicateId) {
  //       message.error("ID danh mục đã tồn tại. Vui lòng nhập ID khác!");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("IDDanhMuc", values.IDDanhMuc);
  //     formData.append("TenDanhMuc", values.TenDanhMuc);
  //     console.log("Form data sau khi thêm giá trị:", formData); // Log form data

  //     // formData.append("IDDanhMuc", values.IDDanhMuc);
  //     // formData.append("TenDanhMuc", values.TenDanhMuc);

  //     // Include file if exists
  //     if (
  //       values.file &&
  //       values.file.fileList &&
  //       values.file.fileList.length > 0
  //     ) {
  //       formData.append("file", values.file.fileList[0].originFileObj);
  //       console.log("File đính kèm:", values.file.fileList[0].originFileObj);
  //     }

  //     if (isEditing) {
  //       console.log("Cập nhật danh mục với ID:", currentCategoryId);
  //       // await axios.put(
  //       //   `/api/danhmuc/updateDanhMucCha/${currentCategoryId}`,
  //       //   formData,
  //       //   {
  //       //     headers: {
  //       //       "Content-Type": "multipart/form-data",
  //       //     },
  //       //   }
  //       // );
  //       const headers = {
  //         "Content-Type": "multipart/form-data",
  //       };
        
  //       console.log("Dữ liệu gửi đi:", formData); // Log trước khi gửi request
        
  //       await axios.put(`/api/danhmuc/updateDanhMucCha/${currentCategoryId}`, formData, { headers });
        
  //       // await updateDanhMucCha(currentCategoryId, formData);
  //       message.success("Cập nhật danh mục thành công");
  //     } else {
  //       // await axios.post("/api/danhmuc/createDanhMucCha", formData, {
  //       //   headers: {
  //       //     "Content-Type": "multipart/form-data",
  //       //   },
  //       // });
  //       await createDanhMucCha(formData);
  //       message.success("Thêm danh mục thành công");
  //     }

  //     fetchCategories(); // Refresh the list of categories
  //     form.resetFields(); // Clear form fields after successful submission
  //     setImagePreview(null); // Clear image preview after form submission
  //     setIsModalVisible(false);
  //   } catch (error) {
  //     console.error("Lỗi khi lưu danh mục:", error);
  //     message.error("Lưu danh mục thất bại");
  //   }
  // };

  const handleOk = async () => {
    let isDuplicateId = false;
    try {
      const values = await form.validateFields();
      console.log("Giá trị form:", values);
  
      // Kiểm tra trùng lặp ID
      isDuplicateId = categories.some(
        (category) =>
          category.IDDanhMuc === values.IDDanhMuc &&
          (!isEditing || category._id !== editRecord._id)
      );
  
      if (!isEditing && isDuplicateId) {
        message.error("ID danh mục đã tồn tại. Vui lòng nhập ID khác!");
        return;
      }
  
      const formData = new FormData();
  
      // Append dữ liệu vào formData
      formData.append("IDDanhMuc", values.IDDanhMuc);
      formData.append("TenDanhMuc", values.TenDanhMuc);
  
      // Include file if exists
      if (values.file && values.file.fileList && values.file.fileList.length > 0) {
        formData.append("file", values.file.fileList[0].originFileObj);
        console.log("File đính kèm:", values.file.fileList[0].originFileObj);
      }
  
      // Log dữ liệu trong formData
      formData.forEach((value, key) => {
        console.log("CÁI LONE " , key, value);
      });
  
      if (isEditing) {
        console.log("Cập nhật danh mục với ID:", currentCategoryId);
        const headers = {
          "Content-Type": "multipart/form-data",
        };
        await axios.put(`/api/danhmuc/updateDanhMucCha/${currentCategoryId}`, formData, { headers });
        message.success("Cập nhật danh mục thành công");
      } else {
        await createDanhMucCha(formData);
        message.success("Thêm danh mục thành công");
      }
  
      fetchCategories(); // Refresh the list of categories
      form.resetFields(); // Clear form fields after successful submission
      setImagePreview(null); // Clear image preview after form submission
      setIsModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
      message.error("Lưu danh mục thất bại");
    }
  };
  

  
  const showSubCategoryModal = (categoryId) => {
    setCurrentCategoryId(categoryId);
    setIsEditingSubCategory(false); // Đảm bảo modal ở trạng thái thêm mới
    setIsSubCategoryModalVisible(true);
    subCategoryForm.resetFields(); // Reset form khi mở modal thêm danh mục con
  };

  // Hiển thị modal chỉnh sửa danh mục con
  const showEditSubCategoryModal = (categoryId, subCategory) => {
    setCurrentCategoryId(categoryId);
    setIsEditingSubCategory(true);
    setCurrentSubCategoryId(subCategory._id); // Ensure this is the right value
    subCategoryForm.setFieldsValue({
      IDDanhMucCon: subCategory.IDDanhMucCon, // This must not be undefined
      TenDanhMucCon: subCategory.TenDanhMucCon,
      MieuTa: subCategory.MieuTa,
    });
    setIsSubCategoryModalVisible(true);
  };

  // Xử lý gửi danh mục con đã chỉnh sửa
  const handleEditSubCategory = async () => {
    try {
      const values = await subCategoryForm.validateFields();
      const { IDDanhMucCon, TenDanhMucCon, MieuTa } = values;

      console.log("Editing subcategory with values:", values); // Log the values to check
      console.log("Current Subcategory ID:", currentSubCategoryId); // Log the ID
      console.log("Current category ID:", currentCategoryId); // Log the ID

      // await axios.put(
      //   `/api/danhmuc/updateDanhMucCon/${currentCategoryId}/${currentSubCategoryId}`,
      //   { IDDanhMucCon, TenDanhMucCon, MieuTa }
      // );

      await updateDanhMucCon(currentCategoryId, currentSubCategoryId, {
        IDDanhMucCon,
        TenDanhMucCon,
        MieuTa,
      });
      message.success("Cập nhật danh mục con thành công");
      setIsSubCategoryModalVisible(false);
      subCategoryForm.resetFields();
      fetchCategories();
    } catch (error) {
      message.error("Cập nhật danh mục con thất bại");
      console.error("Error updating subcategory:", error);
    }
  };

  // Handle subcategory creation
  const handleCreateSubCategory = async () => {
    try {
      const values = await subCategoryForm.validateFields(); // Ensure using the correct form
      const { IDDanhMucCon, TenDanhMucCon, MieuTa } = values;

      // Debugging log
      console.log("Creating subcategory with values:", {
        IDDanhMucCon,
        TenDanhMucCon,
        MieuTa,
      });

      // const response = await axios.post(
      //   `/api/danhmuc/createDanhMucCon/${currentCategoryId}`,
      //   { IDDanhMucCon, TenDanhMucCon, MieuTa }
      // );
      await createDanhMucCon(currentCategoryId, {
        IDDanhMucCon,
        TenDanhMucCon,
        MieuTa,
      });

      // console.log("Subcategory response:", response);
      message.success("Thêm danh mục con thành công");
      setIsSubCategoryModalVisible(false);
      subCategoryForm.resetFields();
      fetchCategories(); // Refresh categories
    } catch (error) {
      message.error("Thêm danh mục con thất bại");
      console.error("Error adding subcategory:", error);
    }
  };

  const columns = [
    {
      title: "ID Danh Mục",
      dataIndex: "IDDanhMuc",
    },
    {
      title: "Ảnh Danh Mục",
      dataIndex: "AnhDanhMuc",
      render: (text) => (
        <img
          src={text}
          alt="Danh Mục"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên Danh Mục",
      dataIndex: "TenDanhMuc",
    },
    {
      title: "Danh mục con",
      dataIndex: "DanhMucCon",
      key: "DanhMucCon",
      render: (subCategories, parentRecord) => (
        <>
          {subCategories.map((subCategory) => (
            <div
              key={subCategory.IDDanhMucCon}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span>{subCategory.TenDanhMucCon}</span>
              <div>
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  style={{ color: "#1890ff" }}
                  onClick={() =>
                    showEditSubCategoryModal(parentRecord._id, subCategory)
                  }
                />
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa danh mục con này không?"
                  onConfirm={() =>
                    deleteSubCategoryHandler(parentRecord, subCategory._id)
                  }
                >
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    style={{ color: "#ff4d4f" }}
                  />
                </Popconfirm>
              </div>
            </div>
          ))}
          <Button
            type="link"
            onClick={() => showSubCategoryModal(parentRecord._id)}
          >
            + Thêm danh mục con
          </Button>
        </>
      ),
    },
    {
      title: "Hành Động",
      render: (text, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)} // Show modal with current record data
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này không?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
      >
        Thêm Danh Mục
      </Button>
      <Table columns={columns} dataSource={categories} rowKey="_id" />

      <Modal
        title={isEditing ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục"} // Change title based on editing state
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="IDDanhMuc"
            label="ID Danh Mục"
            rules={[{ required: true, message: "Vui lòng nhập ID Danh Mục!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="TenDanhMuc"
            label="Tên Danh Mục"
            rules={[{ required: true, message: "Vui lòng nhập Tên Danh Mục!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="file"
            label="Ảnh Danh Mục"
            rules={[{ required: !isEditing, message: "Vui lòng chọn ảnh!" }]} // If editing, it's not required
          >
            <Upload
              beforeUpload={() => false} // Prevent auto upload
              accept="image/*"
              onChange={({ fileList }) => {
                form.setFieldsValue({ file: { fileList } });
                if (fileList.length > 0) {
                  const file = fileList[0].originFileObj;
                  const imageUrl = URL.createObjectURL(file);
                  setImagePreview(imageUrl); // Save the image URL to state
                } else {
                  setImagePreview(null); // Clear preview if no file selected
                }
              }}
            >
              <Button>Chọn Ảnh</Button>
            </Upload>

            {/* Display the image preview */}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Ảnh xem trước"
                style={{
                  marginTop: 10,
                  maxWidth: "100px",
                  maxHeight: "100px",
                  objectFit: "cover",
                }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          isEditingSubCategory ? "Cập nhật danh mục con" : "Thêm danh mục con"
        }
        visible={isSubCategoryModalVisible}
        onOk={
          isEditingSubCategory ? handleEditSubCategory : handleCreateSubCategory
        }
        onCancel={() => setIsSubCategoryModalVisible(false)}
      >
        <Form form={subCategoryForm} layout="vertical" name="sub_category_form">
          <Form.Item
            name="IDDanhMucCon"
            label="ID Danh Mục Con"
            rules={[
              { required: true, message: "Vui lòng nhập ID danh mục con!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="TenDanhMucCon"
            label="Tên danh mục con"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục con!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="MieuTa" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(CategoriesPage);
