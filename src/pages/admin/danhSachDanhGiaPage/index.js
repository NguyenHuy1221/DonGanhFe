import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Popconfirm, Modal, Pagination } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./style.scss";
import {
  getDanhGiaForAdmin,
  addPhanHoi,
  updatePhanHoi,
  deletePhanHoi,
} from "../../../api/danhGiaService";
const DanhSachDanhGiaPage = () => {
  const [danhGia, setDanhGia] = useState([]);
  const [locDanhGia, setLocDanhGia] = useState("");
  const [timKiem, setTimKiem] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentDanhGiaId, setCurrentDanhGiaId] = useState("");
  const [currentPhanHoiId, setCurrentPhanHoiId] = useState("");
  const [binhLuan, setBinhLuan] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [fullText, setFullText] = useState("");

  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [pageSize, setPageSize] = useState(5);

  // const fetchDanhGia = async () => {
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     // const response = await axios.get(`/api/danhgia/getListDanhGiaAdmin/${userId}`);
  //     // setDanhGia(response.data);
  //     const danhGiaData = await getDanhGiaForAdmin(userId);

  //     // Lưu danh sách đánh giá vào state
  //     setDanhGia(danhGiaData);
  //   } catch (error) {
  //     console.error("Lỗi khi lấy dữ liệu đánh giá:", error);
  //   }
  // };

  const fetchDanhGia = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const danhGiaData = await getDanhGiaForAdmin(userId);
  
      // Lọc ra những đánh giá có `sanphamId` đầy đủ
      const filteredDanhGia = danhGiaData.filter(
        (item) => item.sanphamId && item.sanphamId.HinhSanPham
      );
  
      setDanhGia(filteredDanhGia);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu đánh giá:", error);
    }
  };
  

  useEffect(() => {
    fetchDanhGia();
  }, []);

  const danhSachLoc = danhGia.filter((danhGia) => {
    return (
      (locDanhGia === "" || danhGia.XepHang === parseInt(locDanhGia)) &&
      (timKiem === "" ||
        danhGia.sanphamId.TenSanPham.toLowerCase().includes(
          timKiem.toLowerCase()
        ))
    );
  });

  const paginatedDanhGia = danhSachLoc.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // const handleAddPhanHoi = async () => {
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     if (!userId) {
  //       alert("Vui lòng đăng nhập trước khi thêm phản hồi");
  //       return;
  //     }

  //     if (isEdit) {
  //       await axios.post(
  //         `/api/danhgia/updatePhanHoi/${currentDanhGiaId}/${currentPhanHoiId}`,
  //         {
  //           BinhLuan: binhLuan,
  //         }
  //       );
  //     } else {
  //       await axios.post(`/api/danhgia/addPhanHoi/${currentDanhGiaId}`, {
  //         userId,
  //         BinhLuan: binhLuan,
  //       });
  //     }

  //     const updatedDanhGia = danhGia.map((item) =>
  //       item._id === currentDanhGiaId
  //         ? {
  //             ...item,
  //             PhanHoi: isEdit
  //               ? item.PhanHoi.map((ph) =>
  //                   ph._id === currentPhanHoiId
  //                     ? { ...ph, BinhLuan: binhLuan }
  //                     : ph
  //                 )
  //               : [
  //                   ...item.PhanHoi,
  //                   { userId, BinhLuan: binhLuan, NgayTao: new Date() },
  //                 ],
  //           }
  //         : item
  //     );

  //     // setDanhGia(updatedDanhGia);
  //     setIsModalOpen(false);
  //     setBinhLuan("");
  //     setIsEdit(false);
  //     fetchDanhGia();
  //   } catch (error) {
  //     console.error("Lỗi khi thêm hoặc sửa phản hồi:", error);
  //     alert("Đã xảy ra lỗi khi xử lý phản hồi");
  //   }
  // };

  const handleAddPhanHoi = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Vui lòng đăng nhập trước khi thêm phản hồi");
        return;
      }

      let response;

      // Kiểm tra xem có đang chỉnh sửa phản hồi hay không
      if (isEdit) {
        // Cập nhật phản hồi
        response = await updatePhanHoi(
          currentDanhGiaId,
          currentPhanHoiId,
          binhLuan
        );
      } else {
        // Thêm mới phản hồi
        response = await addPhanHoi(currentDanhGiaId, userId, binhLuan);
      }

      // Cập nhật lại danh sách phản hồi
      const updatedDanhGia = danhGia.map((item) =>
        item._id === currentDanhGiaId
          ? {
              ...item,
              PhanHoi: isEdit
                ? item.PhanHoi.map((ph) =>
                    ph._id === currentPhanHoiId
                      ? { ...ph, BinhLuan: binhLuan }
                      : ph
                  )
                : [
                    ...item.PhanHoi,
                    { userId, BinhLuan: binhLuan, NgayTao: new Date() },
                  ],
            }
          : item
      );

      // setDanhGia(updatedDanhGia); // Cập nhật lại state nếu cần thiết
      setIsModalOpen(false);
      setBinhLuan("");
      setIsEdit(false);

      // Gọi lại hàm fetchDanhGia để lấy danh sách mới
      fetchDanhGia();
    } catch (error) {
      console.error("Lỗi khi thêm hoặc sửa phản hồi:", error);
      alert("Đã xảy ra lỗi khi xử lý phản hồi");
    }
  };

  const handleDeletePhanHoi = async (danhGiaId, phanHoiId) => {
    try {
      // await axios.delete(
      //   `/api/danhgia/deletePhanHoi/${danhGiaId}/${phanHoiId}`
      // );
      await deletePhanHoi(danhGiaId, phanHoiId);
      const updatedDanhGia = danhGia.map((item) =>
        item._id === danhGiaId
          ? {
              ...item,
              PhanHoi: item.PhanHoi.filter((ph) => ph._id !== phanHoiId),
            }
          : item
      );
      setDanhGia(updatedDanhGia);
      alert("Đã xóa phản hồi thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa phản hồi:", error);
      alert("Đã xảy ra lỗi khi xóa phản hồi");
    }
  };

  const openDialog = (text) => {
    setFullText(text);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  return (
    <div className="danh-sach-danh-gia">
      <div className="filter-section">
        <select
          value={locDanhGia}
          onChange={(e) => setLocDanhGia(e.target.value)}
        >
          <option value="">Tất cả đánh giá</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={timKiem}
          onChange={(e) => setTimKiem(e.target.value)}
        />
      </div>

      <table className="review-table">
        <thead>
          <tr>
            <th>Ảnh sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Mã đơn hàng</th>
            <th>Người mua</th>
            <th>Khách hàng đánh giá</th>
            <th>Phản hồi</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDanhGia.map((danhGia, index) => (
            <tr key={index}>
              <td>
                {danhGia.sanphamId?.HinhSanPham ? (
                  <img
                    src={danhGia.sanphamId.HinhSanPham}
                    alt={danhGia.sanphamId.TenSanPham || "Sản phẩm"}
                    className="product-image"
                  />
                ) : (
                  "Không có ảnh"
                )}
              </td>
              <td>
                {danhGia.sanphamId?.TenSanPham || "Không có tên sản phẩm"}
              </td>
              <td>{danhGia.sanphamId?.IDSanPham || "Không có mã đơn hàng"}</td>
              <td>{"⭐".repeat(danhGia.XepHang)}</td>
              <td>
                <span
                  className="truncated-text"
                  onClick={() => openDialog(danhGia.BinhLuan)}
                >
                  {danhGia.BinhLuan.length > 100
                    ? `${danhGia.BinhLuan.slice(0, 100)}...`
                    : danhGia.BinhLuan}
                </span>
              </td>
              <td>
                {danhGia.PhanHoi.map((phanHoi, phIndex) => (
                  <div key={phIndex} className="feedback-item">
                    <div
                      className="feedback-user"
                      onClick={() =>
                        setSelectedReviewId(
                          selectedReviewId === phanHoi._id ? null : phanHoi._id
                        )
                      }
                    >
                      <strong>{phanHoi.userId.tenNguoiDung}</strong>
                    </div>
                    <div className="feedback-comment">
                      <span
                        className="truncated-text"
                        onClick={() => openDialog(phanHoi.BinhLuan)}
                      >
                        {phanHoi.BinhLuan.length > 100
                          ? `${phanHoi.BinhLuan.slice(0, 100)}...`
                          : phanHoi.BinhLuan}
                      </span>
                      {selectedReviewId === phanHoi._id && (
                        <div className="feedback-actions">
                          <Button
                            size="small"
                            style={{ color: "#1890ff" }}
                            icon={<EditOutlined />}
                            onClick={() => {
                              setIsModalOpen(true);
                              setIsEdit(true);
                              setCurrentDanhGiaId(danhGia._id);
                              setCurrentPhanHoiId(phanHoi._id);
                              setBinhLuan(phanHoi.BinhLuan);
                            }}
                          />
                          <Popconfirm
                            title="Bạn có chắc chắn muốn xóa phản hồi này không?"
                            onConfirm={() =>
                              handleDeletePhanHoi(danhGia._id, phanHoi._id)
                            }
                          >
                            <Button
                              icon={<DeleteOutlined />}
                              size="small"
                              style={{ color: "#ff4d4f" }}
                            />
                          </Popconfirm>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </td>
              <td>
                <button
                  onClick={() => {
                    setCurrentDanhGiaId(danhGia._id);
                    setIsModalOpen(true);
                    setIsEdit(false);
                    setBinhLuan("");
                  }}
                >
                  Phản hồi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog to show full feedback */}
      <Modal
        title="Chi tiết"
        visible={dialogVisible}
        onCancel={closeDialog}
        footer={[
          <Button key="close" onClick={closeDialog}>
            Đóng
          </Button>,
        ]}
      >
        <p>{fullText}</p>
      </Modal>

      {isModalOpen && (
        <div className="modal-phan-hoi">
          <div className="modal-content-phan-hoi">
            <h2>{isEdit ? "Sửa phản hồi" : "Nhập phản hồi"}</h2>
            <textarea
              value={binhLuan}
              onChange={(e) => setBinhLuan(e.target.value)}
              placeholder="Nhập phản hồi..."
              required
            />
            <button onClick={handleAddPhanHoi}>
              {isEdit ? "Cập nhật" : "Gửi Phản Hồi"}
            </button>
            <button onClick={() => setIsModalOpen(false)}>Đóng</button>
          </div>
        </div>
      )}

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={danhSachLoc.length}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default DanhSachDanhGiaPage;
