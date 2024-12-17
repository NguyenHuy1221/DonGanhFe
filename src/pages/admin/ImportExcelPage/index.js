import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button, Table, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ImportExcel = ({ onSuccess }) => {
  const [data, setData] = useState([]); // Dữ liệu sản phẩm
  const [columns, setColumns] = useState([]); // Cột bảng
  const [loading, setLoading] = useState(false); // Trạng thái tải

  // Hàm xử lý upload file và đọc dữ liệu Excel
  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const ab = event.target.result;
        const wb = XLSX.read(ab, { type: "array" });

        // Lấy dữ liệu từ sheet đầu tiên
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }); // header: 1 để lấy dữ liệu dưới dạng mảng

        // Kiểm tra nếu có dữ liệu
        if (jsonData.length) {
          const columnNames = jsonData[0];
          const generatedColumns = columnNames.map((col, index) => ({
            title: col || `Cột ${index + 1}`,
            dataIndex: `col_${index}`,
            key: `col_${index}`,
          }));

          // Lấy dữ liệu bắt đầu từ dòng 2
          const formattedData = jsonData.slice(1).map((row, rowIndex) => {
            const rowData = {};
            row.forEach((cell, cellIndex) => {
              rowData[`col_${cellIndex}`] = cell || null; // Giá trị từng ô
            });
            return { ...rowData, key: rowIndex };
          });

          setColumns(generatedColumns);
          setData(formattedData);

          message.success("Đọc file thành công!");
        } else {
          message.error("Không có dữ liệu trong file!");
        }
      } catch (error) {
        message.error("Lỗi khi đọc file Excel! Vui lòng kiểm tra định dạng file.");
      }
    };

    reader.readAsArrayBuffer(file);
    return false; // Chặn upload mặc định của Ant Design
  };

  // Hàm gửi dữ liệu lên API
  const handleSubmit = async () => {
    if (!data.length) {
      message.warning("Không có dữ liệu để thêm!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/sanpham/createSanPhamExcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: data }),
      });

      if (response.ok) {
        const result = await response.json();
        message.success(`${result.products.length} sản phẩm đã được thêm thành công!`);
        setData([]); // Reset dữ liệu sau khi thêm thành công
        setColumns([]);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const error = await response.json();
        message.error(error.message || "Lỗi khi thêm sản phẩm!");
      }
    } catch (err) {
      message.error("Không thể kết nối với server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Upload file */}
      <Upload
        accept=".xlsx,.xls"
        beforeUpload={handleFileUpload}
        showUploadList={false}
        maxCount={1}
      >
        <Button icon={<UploadOutlined />}>Tải file Excel lên</Button>
      </Upload>

      {/* Nút thêm sản phẩm */}
      <Button
        type="primary"
        style={{ marginTop: 10 }}
        onClick={handleSubmit}
        loading={loading}
        disabled={!data.length}
      >
        Thêm sản phẩm từ Excel
      </Button>

      {/* Hiển thị dữ liệu dưới dạng bảng */}
      {/* <Table
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.key}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: "100%" }}
      /> */}
    </div>
  );
};

export default ImportExcel;
