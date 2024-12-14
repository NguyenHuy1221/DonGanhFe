import React, { useState, useEffect, memo } from "react";
import "./style.scss";
import axios from "axios";
import {
  fetchYeuCauDangKyByUserId,
  updateYeuCauDangKy,
} from "../../../api/yeuCauDangKyService";

const XacNhanKinhDoanhPage = ({ quayLaiUserXacNhan }) => {
  const [businessData, setBusinessData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userIdxn");

    if (!userId || userId === "null") {
      alert("Lỗi: Không tìm thấy ID người dùng.");
      return;
    }

    const loadBusinessData = async () => {
      try {
        const data = await fetchYeuCauDangKyByUserId(userId);

        if (data && data.length > 0) {
          const mappedData = {
            id: data[0]._id,
            tenNguoiDangKy: data[0].userId.tenNguoiDung,
            tenHoKinhDoanh: data[0].diaChi.Name,
            hinhthucgiaohang: data[0].hinhthucgiaohang,
            ghiChu: data[0].ghiChu,
            diaChi: `${data[0].diaChi.duongThon}, ${data[0].diaChi.phuongXa}, ${data[0].diaChi.quanHuyen}, ${data[0].diaChi.tinhThanhPho}`,
            ngayDangKy: new Date(data[0].createdAt).toLocaleDateString("vi-VN"),
            maSoThue: data[0].maSoThue || "Chưa cập nhật",
            anhGiayPhepHoKinhDoanh: data[0].anhGiayPhepHoKinhDoanh || null,
          };

          setBusinessData(mappedData);
        } else {
          console.warn("Không có dữ liệu yêu cầu đăng ký.");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    loadBusinessData();
  }, []);

  const updateTrangThai = async (trangThai) => {
    console.log(
      "Cập nhật trạng thái cho ID:",
      businessData.id,
      "với trạng thái:",
      trangThai
    ); // Log dữ liệu trước khi gửi yêu cầu
    try {
      // const response = await axios.put(
      //   `/api/yeucaudangky/updateYeuCauDangKy/${businessData.id}`,
      //   {
      //     TrangThai: trangThai, // Gửi trạng thái bạn muốn cập nhật
      //   }
      // );
      const response = await updateYeuCauDangKy(businessData.id, trangThai);

      if (response.status === 200) {
        alert("Cập nhật trạng thái thành công!");
        // Log phản hồi thành công
        quayLaiUserXacNhan();
      } else {
        throw new Error("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Không xác nhận trạng thái trùng.");
    }
  };

  const handleApprove = () => {
    console.log("Đang phê duyệt yêu cầu với trạng thái:", "xacnhan");
    updateTrangThai("xacnhan");
  };

  const handleReject = () => {
    console.log("Đang từ chối yêu cầu với trạng thái:", "huy");
    updateTrangThai("huy");
  };

  if (!businessData) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div className="xac-nhan-kinh-doanh">
      <div className="box_l_ct">
        <button className="btn-back" onClick={quayLaiUserXacNhan}>
          Quay Lại
        </button>
        <h1>Xác nhận hộ kinh doanh</h1>
      </div>
      <div className="business-info">
        <h2>Thông tin chi tiết</h2>
        <p>
          <strong>Mã số thuế:</strong> {businessData.maSoThue}
        </p>
        <p>
          <strong>Tên người đăng ký:</strong> {businessData.tenNguoiDangKy}
        </p>
        <p>
          <strong>Tên hộ kinh doanh:</strong> {businessData.tenHoKinhDoanh}
        </p>
        <p>
          <strong>Hình thức giao hàng:</strong> {businessData.hinhthucgiaohang}
        </p>
        <p>
          <strong>Ghi chú:</strong> {businessData.ghiChu}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {businessData.diaChi}
        </p>
        <p>
          <strong>Ngày đăng ký:</strong> {businessData.ngayDangKy}
        </p>
        {businessData.anhGiayPhepHoKinhDoanh && (
        <div className="business-image">
          <h2>Ảnh giấy phép hộ kinh doanh</h2>
          <img
            src={businessData.anhGiayPhepHoKinhDoanh}
            alt="Giấy phép hộ kinh doanh"
            className="license-image"
          />
        </div>
      )}
      </div>

      <div className="action-section">
        <h2>Hành động</h2>
        <div className="buttons">
          <button className="approve-btn" onClick={handleApprove}>
            ✔️ Phê duyệt
          </button>
          <button className="reject-btn" onClick={handleReject}>
            ✖️ Từ chối
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(XacNhanKinhDoanhPage);
