import React, { useState, useEffect, memo } from "react";
import { Table, message, Button, DatePicker, Select, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDoanhThu } from "../../../api/doanhThuService";
const { RangePicker } = DatePicker;

const DoanhThuPage = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null,
    transactionType: "tatca",
  });

  const [form] = Form.useForm();

  // Fetch data khi bộ lọc thay đổi
  useEffect(() => {
    fetchRevenueData();
  }, [filter]); // Fetch data khi filter thay đổi

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      
      // Tạo payload bộ lọc
      const filterPayload = { ...filter };
      if (filter.transactionType === "tatca") {
        // Bỏ qua ngày nếu chọn "Hiển thị tất cả"
        delete filterPayload.startDate;
        delete filterPayload.endDate;
      }
  
      const revenueData = await getDoanhThu(userId, filterPayload);
  
      // Kiểm tra nếu dữ liệu hợp lệ
      if (Array.isArray(revenueData) && revenueData.length > 0) {
        setRevenueData(revenueData);
      } else {
        console.error("Dữ liệu không phải là mảng doanh thu");
      }
    } catch (error) {
      message.error("Không thể tải dữ liệu doanh thu");
      console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Cập nhật bộ lọc khi người dùng thay đổi một trường
  const handleFilterChange = (value, type) => {
    setFilter((prevFilter) => {
      const newFilter = { ...prevFilter };
      newFilter[type] = value; // Cập nhật trường tương ứng trong bộ lọc
      return newFilter;
    });
  };

  // Xử lý thay đổi ngày tháng
  const handleDateRangeChange = (dates) => {
    if (dates) {
      setFilter({
        ...filter,
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
      });
    }
  };

  // Biểu đồ doanh thu với màu sắc tùy chỉnh
  // Sắp xếp dữ liệu theo ngày
  const chartData = revenueData
    .sort((a, b) => new Date(a.ngay) - new Date(b.ngay)) // Sắp xếp theo ngày tăng dần
    .map((item) => {
      let label;
      if (filter.transactionType === "ngay") {
        label = moment(item.ngay).format("DD-MM-YYYY");
      } else if (filter.transactionType === "tuan") {
        const startOfWeek = moment(item.ngay).startOf("isoWeek");
        label = `Tuần ${startOfWeek.format("DD-MM-YYYY")}`;
      } else if (filter.transactionType === "thang") {
        label = moment(item.ngay).format("MM-YYYY");
      }

      return {
        name: label,
        doanhThu: item.doanhThu,
        chuaThanhToan: item.soLuongChuaThanhToan,
      };
    });

  // Cột bảng doanh thu với màu sắc tùy chỉnh
  const columns = [
    // {
    //   title: "Thời Gian",
    //   dataIndex: "ngay",
    //   render: (text) => {
    //     if (filter.transactionType === "ngay") {
    //       return moment(text).format("DD-MM-YYYY");
    //     } else if (filter.transactionType === "tuan") {
    //       const startOfWeek = moment(text).startOf("isoWeek");
    //       return `Tuần ${startOfWeek.format("DD-MM-YYYY")}`;
    //     } else if (filter.transactionType === "thang") {
    //       return moment(text).format("MM-YYYY");
    //     }
    //     return text;
    //   },
    // },
    {
      title: "Ngày",
      dataIndex: "ngay",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Doanh Thu",
      dataIndex: "doanhThu",
      render: (text) => {
        const color = text > 5000000 ? "green" : "blue"; // Doanh thu > 5 triệu sẽ có màu xanh lá cây
        return (
          <span style={{ color: color }}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(text)}
          </span>
        );
      },
    },
    {
      title: "Chưa Thanh Toán",
      dataIndex: "soLuongChuaThanhToan", // Tên trường mới
      render: (text) => {
        const color = "orange"; // Số lượng chưa thanh toán luôn có màu vàng
        return (
          <span style={{ color: color }}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(text)}
          </span>
        );
      },
    },
    {
      title: "Đã Hủy",
      dataIndex: "soLuongDaHuy", // Tên trường mới
      render: (text) => {
        const color = "red"; // Số lượng đã hủy sẽ có màu đỏ
        return (
          <span style={{ color: color }}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(text)}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Form form={form} layout="inline">
          <Form.Item
            label="Chọn ngày"
            name="dateRange"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày bắt đầu và kết thúc!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value[0].isBefore(value[1])) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Ngày bắt đầu phải trước ngày kết thúc!")
                  );
                },
              }),
              {
                validator(_, value) {
                  const today = moment().endOf("day");
                  if (
                    value &&
                    (value[0].isAfter(today) || value[1].isAfter(today))
                  ) {
                    return Promise.reject(
                      new Error("Ngày không được vượt quá hôm nay!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <RangePicker format="DD-MM-YYYY" onChange={handleDateRangeChange} />
          </Form.Item>
          <Form.Item label="Bộ lọc">
            <Select
              placeholder="Chọn bộ lọc"
              style={{ width: 200 }}
              value={filter.transactionType} // Gắn giá trị mặc định
              onChange={(value) => handleFilterChange(value, "transactionType")}
              allowClear
            >
              <Select.Option value="tatca">Hiển thị tất cả</Select.Option>
              <Select.Option value="ngay">Theo Ngày</Select.Option>
              <Select.Option value="tuan">Theo Tuần</Select.Option>
              <Select.Option value="thang">Theo Tháng</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="doanhThu"
            stroke="#8884d8"
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="chuaThanhToan" // Dữ liệu cho "Chưa Thanh Toán"
            stroke="#ff7300" // Màu đường cho "Chưa Thanh Toán"
            strokeWidth={3}
            name="Chưa Thanh Toán"
          />
        </LineChart>
      </ResponsiveContainer>

      <Table
        columns={columns}
        dataSource={revenueData}
        rowKey="ngay"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default memo(DoanhThuPage);
