import { memo } from "react";
import "./style.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <h2>UVA Website Development</h2>
          <p>
            CÔNG TY TNHH CÔNG NGHỆ <br />
            VÀ TRUYỀN THÔNG UVA
          </p>
          <p>
            MSDN/MST: 0315984702 | Cấp ngày 02/11/2019 tại Phòng ĐKKD - Sở KHĐT
            TP.HCM
          </p>
          <p>
            Địa chỉ: 1050/21 Quang Trung, Phường 8, Quận Gò Vấp, TP.HCM <br />
            Chi nhánh: 140 Y Ngông, Tân Tiến, TP. BMT, Đắk Lắk
          </p>
          <p>Số điện thoại: 0969.353.073 - Email: agency@uva.vn</p>
          <p>
            <a href="/">Chính sách & Quy định Chung</a> -{" "}
            <a href="/">Chính sách Bảo mật Thông tin</a>
          </p>
        </div>
        <div className="footer-maps">
          <div className="map">
            <p>Hồ Chí Minh</p>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.597507547554!2d106.6433530735317!3d10.842082157982357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529108658b70d%3A0x6c05f35ba6148ff1!2zMTA1MC8yMS8xIMSQLiBRdWFuZyBUcnVuZywgUGjGsOG7nW5nIDgsIEfDsiBW4bqlcCwgSOG7kyBDaMOtIE1pbmgsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1724393002315!5m2!1sen!2s"
              width="300"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <div className="map">
            <p>Buôn Ma Thuột, Đắk Lắk</p>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3892.637518446005!2d108.02460857356238!3d12.671755621384332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31721d9852bd0721%3A0xedd781ead4611f11!2zMTQwIFkgTmfDtG5nLCBUw6JuIHRp4bq_biwgVGjDoG5oIHBo4buRIEJ1w7RuIE1hIFRodeG7mXQsIMSQ4bqvayBM4bqvayA2MzExNSwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1724393178841!5m2!1sen!2s"
              width="300"
              height="200"
              style={{ border: 0 }}
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 UVA™ Website Development. All Rights Reserved.</p>
        <p>A member of UVA Agency, UVA Vietnam Network</p>
        <p>
          <a href="/">Hướng dẫn thanh toán</a> -{" "}
          <a href="/">Chính sách bảo hành</a> - <a href="#">Kiến thức</a>
        </p>
        <p className="footer-hotline">Hotline: 097 9894 942</p>
      </div>
    </footer>
  );
};

export default memo(Footer);
