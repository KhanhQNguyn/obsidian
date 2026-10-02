---
type: solution
date: 2026-10-01
tags: [competition, business-challenge-2026, solution, usp-locked]
---

# Giải pháp đề xuất: "PayFlow Line" - hạn mức tính trước từ dòng tiền, trả nợ theo ngày nhận tiền

Bản cho Ideation Round (hạn 04/10/2026 20:00 GMT+7). USP đã chốt 01/10 — xem khung dưới. Cần cả nhóm duyệt lần cuối trước khi nộp.
Nền tảng: [[business-challenge-2026]] · [[solution-usp-research]] · [[underwriting-process-analysis]] · Nhật ký: [[2026-09-30]] · [[2026-10-01]]

> **Cách đọc các nhãn.** **[CASE]** = có trong đề HLBVN. **[NGUỒN]** = từ tài liệu công khai (link ở cuối). **[GIẢ ĐỊNH]** = mình tự đặt, phải ghi rõ trên infographic (đề bài yêu cầu nêu mọi giả định). Con số nào không có nhãn là phép tính từ số của case.

> **Quyết định chốt (01/10).** Có tham khảo ý kiến anh Phúc (founder Tuturuuu) — ảnh khuyên dùng hybrid ML + LLM reasoning để chấm điểm, lý do "LLM đang là xu hướng". Sau khi đối chiếu với đề: HLBVN muốn mô hình **giải thích được**, không muốn "hộp đen" dù kém flashy hơn [CASE §4.2] — nên quyết định **không** đưa LLM vào vòng quyết định duyệt/từ chối vay. Thay vào đó chốt **một USP duy nhất** làm trục chính của pitch (xem bên dưới); AI/LLM chỉ còn vai trò phụ, không chạm vào quyết định (xem §4.2). Chi tiết lý do: [[2026-10-01]].

---

## 1. Giải pháp trong 5 câu

1. Hôm nay ngân hàng chỉ kiểm tra khách **sau khi khách bấm mua**, bằng tay, chỉ nhìn sổ CIC, nên mất 1.8-4.6 ngày và 380,000 VND cho mỗi đơn.
2. Ta đảo ngược thứ tự: **kiểm tra khách trước khi họ mua**, khi khách cho phép, bằng dữ liệu tiền vào thật (lương, thu nhập từ app giao hàng/chở khách, doanh thu bán online, ví điện tử).
3. Mỗi tuần máy tự tính một **hạn mức an toàn** cho từng khách và giữ sẵn. Lúc thanh toán, ngân hàng chỉ **tra hạn mức** - vài giây, gần như 0 đồng.
4. Khách trả nợ **theo nhịp thu nhập**: người có lương trả cố định hằng tháng; người gig/bán online trả theo ngày nhận tiền, tiền trả được trừ ngay khi tiền về tài khoản HLBVN.
5. Khách mới hoàn toàn (chưa kết nối dữ liệu) vào **làn lạnh**: xác minh nhanh, hạn mức nhỏ, tăng dần khi trả đúng hạn. Nhờ đó ngân hàng vừa mở rộng khách vừa **có dữ liệu thật để học**, thay vì đoán.

**USP duy nhất (chốt 01/10): "Trả nợ tự lấy tại nguồn" (cash-flow-secured credit).** Hầu hết đội khác sẽ đề xuất "chấm điểm bằng dữ liệu thay thế + duyệt tự động" — đó là một bước cải tiến tốc độ. Điểm khác biệt của đội mình là đổi hẳn *loại giải pháp*: thay vì cố **đoán** khách có trả nợ hay không (dự đoán hành vi), hệ thống **kiểm soát trực tiếp** dòng tiền trả nợ bằng cách trích tiền tại nguồn, trước khi khách kịp tiêu. Rủi ro giảm nhờ *cách thiết kế*, không chỉ nhờ mô hình chấm điểm giỏi hơn — đây là lý do giải pháp *an toàn được trước credit committee*, không chỉ nhanh hơn.

Hai cơ chế còn lại (ngân sách thử nghiệm có trần ở §5, bậc thang tín dụng ở §4.4/§7) vẫn giữ trong thiết kế, nhưng đóng vai trò **hỗ trợ quản lý rủi ro**, không phải USP riêng — tránh pitch bị loãng, chỉ có một câu chuyện chính để team nhớ và trình bày.

---

## 2. Vấn đề (khớp tiêu chí Problem Diagnosis - 20%)

**Nguyên nhân gốc (chỉ một):** quy trình *thủ công, tập trung, chỉ dựa vào CIC, chạy sau khi khách đã ở checkout*.

Ba triệu chứng đều xuất phát từ đó:
| Triệu chứng | Số liệu [CASE] | Vì sao |
|---|---|---|
| Chậm | 1.8-4.6 ngày làm việc | Người làm từng hồ sơ, xếp hàng chung |
| Đắt | 380,000 VND/đơn, cố định | Cùng một quy trình cho khoản 1.6 triệu và 90.1 triệu |
| Mù | 64.5% đơn không phải nhóm "lương + có lịch sử tín dụng" | CIC không thấy thu nhập từ app/ví/bán hàng dù dữ liệu này tồn tại |

Tính từ số case: 380,000 = 23.75% khoản vay 1.6 triệu, nhưng chỉ 0.42% khoản 90.1 triệu. Với **[GIẢ ĐỊNH]** lãi 24%/năm, kỳ hạn 3 tháng (lãi khoảng 6% gốc), riêng chi phí xét duyệt chỉ hòa vốn khi khoản vay trên khoảng **6.3 triệu**. Đơn bị từ chối vẫn tốn 380,000. Vậy khoản vay nhỏ ở checkout *không thể có lãi* với quy trình hiện tại - đó là gốc của bài toán, và chỉ giải bằng cách thay đổi quy trình chứ không bằng cách tăng tốc nó.

**Bối cảnh thị trường [NGUỒN]:** đối thủ đã nhanh - Home Credit quảng bá duyệt trong khoảng 3 phút tại điểm bán; ví như MoMo cho "mua trước trả sau" đến 45 ngày; thị trường BNPL Việt Nam dự kiến ~2.7 tỷ USD năm 2026. Vì vậy chỉ "nhanh" thì không đủ khác biệt. Cái ta bán cho HLBVN là: **nhanh + rẻ + an toàn rủi ro + mở cho nhóm bị bỏ quên**, với một cơ chế trả nợ mà đối thủ chỉ dựa vào lãi suất cao để bù rủi ro thì không có.

---

## 3. Luồng từ đầu đến cuối (end-to-end)

### Làn nóng - khách đã kết nối dữ liệu (đa số khách dài hạn)

| Bước | Khách thấy gì | Hệ thống làm gì | Ai/máy |
|---|---|---|---|
| 1. Đồng ý | Trong app đối tác/ví/HLBVN, khách bấm "Kết nối thu nhập để nhận hạn mức", thấy rõ dữ liệu nào, dùng để làm gì | Lưu consent theo từng mục đích (Luật 91/2025 yêu cầu consent riêng cho chấm điểm) | Máy |
| 2. Xác minh danh tính | Quét CCCD + chụp mặt | eKYC; đối chiếu tên chủ tài khoản nhận tiền với tên trên CCCD | Máy |
| 3. Chấm điểm hằng tuần | (không thấy gì) | Lấy dòng tiền vào 12 tuần gần nhất, tính thu nhập *thận trọng*, cho điểm, tính hạn mức | Máy |
| 4. Nhận hạn mức | Thấy "Hạn mức của bạn: X triệu" kèm lý do bằng lời đơn giản | Lưu hạn mức + điều kiện | Máy |
| 5. Thanh toán | Chọn "trả góp", chọn số kỳ, bấm xác nhận - **vài giây** | Tra hạn mức, kiểm tra vay chồng chéo và giữ chỗ (reserve) số tiền, nếu hợp lệ thì duyệt | Máy |
| 6. Trả nợ | Nhận nhắc lịch; tiền trừ theo lịch phù hợp thu nhập | Tự trừ khi tiền về tài khoản HLBVN; theo dõi | Máy |
| 7. Cập nhật | Hạn mức tăng nếu trả đúng, giảm nếu thu nhập tụt | Chạy lại hằng tuần + kích hoạt ngay nếu có sự kiện bất thường | Máy |

**Ngoại lệ đưa cho người:** khoản vay trên ngưỡng lớn **[GIẢ ĐỊNH]** (ví dụ trên 30 triệu), dữ liệu mâu thuẫn, nghi gian lận, hoặc điểm nằm sát ranh giới. Đây là luồng thủ công hiện tại, giữ nguyên, chỉ còn khoảng **10% [GIẢ ĐỊNH]** số đơn.

### Làn lạnh - khách mới, chưa có gì
Kết nối dữ liệu ngay lúc checkout (khoảng 60 giây) + eKYC → chỉ được **hạn mức nhỏ** (ví dụ ≤ 3 triệu **[GIẢ ĐỊNH]**). Trả đúng hạn → lên bậc. Một phần rất nhỏ khách thuộc làn này được duyệt thêm "ngoài vùng thoải mái" của mô hình để thu dữ liệu (xem mục 5).

---

## 4. Cách hoạt động bên trong (khớp Solution Concept - 35%: dữ liệu → logic → kết quả → hành động)

### 4.1 Dữ liệu vào (input) - và ai sở hữu
| Nhóm khách | Nguồn dữ liệu (đã tồn tại) | Cách lấy |
|---|---|---|
| Lương chưa có tín dụng | Lịch sử nhận lương vào tài khoản | Tài khoản HLBVN hoặc sao kê được khách cho phép |
| Gig/platform | Tiền chi trả từ nền tảng (theo tuần/ngày), số tuần hoạt động | API/kết nối với nền tảng đối tác + consent |
| Chủ shop online (MSME) | Doanh thu, đơn hoàn, khách quay lại, dòng tiền vào tài khoản | Đối tác sàn/cổng thanh toán + tài khoản CASA |
| Vay lần đầu, có dấu vết số | Nạp ví đều, thanh toán hóa đơn đúng hạn, thông tin viễn thông | Ví/nhà mạng đối tác + consent |

**[GIẢ ĐỊNH QUAN TRỌNG NHẤT]:** HLBVN ký được thỏa thuận chia sẻ dữ liệu với 1-2 đối tác trong pha đầu. Case không xác nhận điều này, nên trên infographic phải ghi rõ. Nếu không có đối tác, phương án dự phòng là dùng chính tài khoản HLBVN khách mở (lương và tiền về đi qua đó) - kém rộng nhưng vẫn chạy.

### 4.2 Logic (mô hình giải thích được, không dùng "hộp đen")
- **Scorecard** kiểu logistic regression/điểm số bảng - loại mô hình ngân hàng đã quen duyệt.
- Đặc trưng ví dụ: thu nhập trung vị hằng tuần, **độ biến động** thu nhập, số tuần liên tục có tiền vào, tỷ lệ tuần thấp bất thường, tuổi tài khoản, đúng hạn hóa đơn.
- **Thu nhập thận trọng** = mức thu nhập tuần ở **phân vị thứ 20** của 12 tuần (không lấy trung bình). Người thu nhập thất thường bị hạn mức thấp hơn một cách tự nhiên.
- **Hạn mức** = min(khả năng trả, trần theo bậc):
  - Khả năng trả = phần thu nhập thận trọng được phép dùng để trả nợ (ví dụ ≤ 20% **[GIẢ ĐỊNH]**) × số kỳ.
  - Trần theo bậc: khách mới thấp, tăng dần khi trả đúng.
  - Ví dụ minh họa **[GIẢ ĐỊNH]**: tài xế gig có thu nhập thận trọng 8 triệu/tháng → trả tối đa 1.6 triệu/tháng → kỳ hạn 6 tháng cho hạn mức tối đa 9.6 triệu; nhưng khách mới bị chặn trần bậc 1, ví dụ 3 triệu.
- **Quy tắc duyệt tại checkout:** đủ hạn mức + không vay chồng chéo + danh tính khớp → duyệt; thiếu chút → đề nghị kỳ hạn dài hơn hoặc giảm số tiền; khả nghi → chuyển người.
- **Không dùng** dữ liệu nhạy cảm hoặc gián tiếp phân biệt đối xử (giới tính, vị trí chi tiết, mạng xã hội). Mỗi lần từ chối/giảm hạn mức đều có **lý do bằng lời** và cách cải thiện.
- **Quyết định 01/10 - không đưa LLM vào vòng duyệt/từ chối vay.** Lý do cân nhắc (gợi ý ban đầu từ anh Phúc, founder Tuturuuu): "hybrid ML + LLM reasoning" nghe hiện đại nhưng phá vỡ đúng yêu cầu HLBVN đặt ra - giải thích được, không hộp đen [CASE §4.2]. Nếu muốn nhắc AI cho pitch thêm sinh động, chỉ dùng ở lớp phụ **sau khi** scorecard đã ra quyết định - ví dụ dịch điểm số thành câu giải thích dễ hiểu cho khách ("bạn bị từ chối vì thu nhập 3 tuần gần đây không ổn định"). AI đóng vai trợ lý dịch thuật, không phải người ra quyết định.

### 4.3 Kết quả (output) và hành động tiếp theo
Output: hạn mức, bậc, lịch trả gợi ý. Hành động: mở/khóa hạn mức, gửi đề nghị cho khách, chuyển hồ sơ cho người, hoặc yêu cầu bổ sung dữ liệu.

### 4.4 Cách trả nợ theo dòng tiền (giảm rủi ro nhờ thiết kế)
- **Người có lương:** trả cố định hằng tháng, tự trừ ngày lương.
- **Gig/chủ shop:** kỳ trả ngắn theo tuần, gắn với ngày tiền về. Có **1 lần tạm hoãn** mỗi khoản vay khi tiền vào tụt dưới ngưỡng (lãi vẫn tính, gốc không bị xóa) - không đổi bản chất khoản vay nên credit committee dễ duyệt.
- **Cấp độ 1 (nhẹ, làm được ngay):** khách mở tài khoản HLBVN và cho phép tự động trừ vào ngày tiền về.
- **Cấp độ 2 (mạnh hơn):** nền tảng đối tác chia tiền chi trả ngay tại nguồn - phần trả nợ về HLBVN trước, phần còn lại về khách.
- Nếu chọn Cấp độ 2 phải có thỏa thuận với đối tác; nếu không có, giữ Cấp độ 1 và ghi rõ giới hạn.

---

## 5. Vì sao giải pháp này quản lý rủi ro được (điều HLBVN nhấn mạnh)

| Rủi ro | Cách xử lý |
|---|---|
| Mô hình chưa từng thấy người vỡ nợ ở nhóm mới | **Ngân sách thử nghiệm có trần**: một phần nhỏ (đề xuất 2-5% **[GIẢ ĐỊNH]**) khách làn lạnh được duyệt hạn mức rất nhỏ ngoài vùng thoải mái để thu nhãn trả nợ thật. Nghiên cứu cho thấy tỷ lệ thử nghiệm cỡ này đủ để phát hiện lệch dữ liệu với chi phí thấp [NGUỒN]. Mức lỗ tối đa = ngân sách đã duyệt trước |
| Hạn mức cũ khi khách thanh toán | Lúc checkout kiểm tra lại tổng dư nợ; hạn mức tự giảm khi thu nhập tụt; đóng băng khi trễ một kỳ |
| Vay chồng chéo nhiều nơi | Tra dư nợ CIC + ghi nhận hạn mức đã giữ chỗ tại chỗ |
| Gian lận danh tính/thu nhập | eKYC, khớp tên chủ tài khoản, chỉ nhận dữ liệu từ API đối tác chứ không nhận ảnh chụp màn hình |
| Đổi hướng nguồn tiền để né trả nợ | Cấp độ 1-2 ở mục 4.4; hạn mức giảm khi dòng tiền vào tụt |
| "Hộp đen" | Scorecard giải thích được; mỗi quyết định lưu lý do; người duyệt các ca ngoại lệ |
| Quy định dữ liệu | Consent riêng theo mục đích; từ 01/11/2026 chia sẻ thông tin tín dụng CIC cần đồng ý rõ ràng [NGUỒN] |
| Mô hình xuống cấp | Theo dõi tỷ lệ trễ hạn sớm theo từng nhóm hằng tuần; ngưỡng dừng tự động |

---

## 6. Hiệu quả kinh doanh đo được (khớp Intervention Justification - 30%)

Tính minh họa trên **1,000 đơn** (mọi số ở cột "Mới" là **[GIẢ ĐỊNH]**, chưa tính chi phí xây dựng một lần):

| | Hiện tại [CASE] | Với PayFlow Line |
|---|---|---|
| Thời gian ra quyết định | 1.8-4.6 ngày | Vài giây cho khoảng 90% đơn; ca ngoại lệ vẫn theo thời gian cũ |
| Chi phí mỗi quyết định tự động | - | 15,000 VND (dữ liệu, tính toán, eKYC) |
| Tổng chi phí xét duyệt | 380 triệu (1,000 × 380,000) | 15 triệu (tự động) + 38 triệu (10% ca ngoại lệ × 380,000) = **53 triệu** |
| Chi phí trung bình mỗi đơn | 380,000 | khoảng **53,000** (giảm khoảng 86%) |
| Khoản vay hòa vốn riêng chi phí xét duyệt (24%/3 tháng) | khoảng 6.3 triệu | 15,000 / 6% = khoảng **0.25 triệu** |
| Khoản 1.6 triệu, 3 tháng: lãi ước tính | 96,000 - 380,000 = **lỗ** | 96,000 - 15,000 = còn dương trước chi phí vốn và tổn thất |

Vì sao đo được: mỗi KPI trực tiếp đo nút thắt (không dùng số vĩ mô):
1. Thời gian ra quyết định (trung vị, phân vị 95).
2. Chi phí mỗi quyết định và **mỗi khoản vay giải ngân**.
3. Tỷ lệ duyệt theo nhóm (gig, lần đầu, MSME) - kỳ vọng tăng.
4. Tỷ lệ hoàn tất giao dịch ở checkout (bỏ giỏ giảm).
5. Tỷ lệ trễ hạn sớm (30 ngày) theo nhóm - kiểm soát chất lượng rủi ro.
6. Tỷ lệ đơn xử lý tự động, và tổn thất của nhóm thử nghiệm so với ngân sách.

Cần một **thử nghiệm bóng (shadow mode)** trước khi bật thật: mô hình chấm điểm song song với quyết định thủ công, so kết quả, rồi mới cho quyết định thật.

---

## 7. Xây trên cái đã có hay làm mới? (khả thi 6-12 tháng)

**Lai (hybrid):** giữ core banking, luồng STP hiện có cho khách lương có lịch sử tín dụng [CASE], CIC, và luồng thủ công (làm phương án dự phòng + khoản lớn). Thêm một lớp mỏng: kết nối dữ liệu + consent, scorecard, limit engine, API quyết định tại checkout, eKYC mua ngoài. Lý do và bảng so sánh ở [[underwriting-process-analysis]] §5.

Lộ trình **[GIẢ ĐỊNH]**:
| Thời gian | Việc |
|---|---|
| Tháng 0-2 | Pháp chế/consent; ký 1-2 đối tác; thiết kế scorecard trên dữ liệu thử |
| Tháng 3-4 | Shadow mode: chấm song song với thẩm định người |
| Tháng 5-7 | Thí điểm 1 nền tảng + 1 nhóm (gig), hạn mức nhỏ, có ngân sách thử nghiệm |
| Tháng 8-10 | Mở thêm nhóm (lương chưa có lịch sử, MSME), bật trả nợ theo dòng tiền |
| Tháng 11-12 | Bậc thang tín dụng, mở rộng đối tác, đánh giá kết quả |

---

## 8. Bảng đối chiếu với tiêu chí của ban tổ chức

| Tiêu chí (trọng số) [CASE §4.10] | Yêu cầu | Giải pháp đáp ứng ở đâu |
|---|---|---|
| **Solution Concept 35%** | Kiến trúc dữ liệu → quyết định rõ; tác động cộng đồng/bền vững; KPI đo trực tiếp; nêu giả định thực tế | Mục 3-4 (luồng, input, logic, output, hành động); tác động: mở tín dụng chính thức cho nhóm bị bỏ quên, giảm dịch vụ tín dụng ngoài hệ thống, bậc thang xây hồ sơ CIC; mục 6 KPI; nhãn [GIẢ ĐỊNH] xuyên suốt |
| **Intervention Justification 30%** | Cơ chế giải quyết trực tiếp nút thắt; lợi ích đo được; khả thi | Mục 2 (nút thắt), mục 6 (bảng tiết kiệm chi phí/thời gian), mục 7 (hybrid 6-12 tháng), mục 5 (rủi ro); chọn **AI đơn giản, giải thích được** và chứng minh giá trị tăng thêm so với cơ sở hiện tại |
| **Problem Diagnosis 20%** | Nút thắt cốt lõi, nguyên nhân gốc và cơ chế | Mục 2: một nguyên nhân gốc, ba triệu chứng, phép tính từ số case |
| **Data & Assumptions 10%** | Dữ liệu và giả định rõ, neo vào case/benchmark | Nhãn [CASE]/[NGUỒN]/[GIẢ ĐỊNH]; mục 4.1 nêu giả định dữ liệu quan trọng nhất; phần nguồn |
| **Visualization 5%** | 1 trang 16:9, PDF, Noto Sans, phân cấp rõ, APA 7 | Gợi ý bố cục ở mục 10 |

Đáp ứng thư ngỏ HLBVN [CASE §4.2]: (1) làm sạch/diễn giải dữ liệu nhiễu - dùng thu nhập thận trọng thay trung bình; (2) không chỉ tốc độ - mục 5 quản lý rủi ro và bảo vệ được trước credit committee; (3) khả thi thực tế - hybrid 6-12 tháng.

---

## 9. Bằng chứng nghiên cứu và giới hạn (nói thật)

| Ý | Bằng chứng | Mức chắc chắn |
|---|---|---|
| Dòng tiền dự đoán trả nợ tốt, không kém điểm tín dụng truyền thống, kết hợp cả hai là tốt nhất, hiệu quả rõ hơn với người trẻ | NBER working paper *From FICO to Cash Flow*; các tổng hợp ngành (Plaid, Open Banking Expo) | Trung bình: mình đọc được tóm tắt, không mở được toàn văn PDF; dữ liệu là Mỹ/quốc tế, không phải Việt Nam |
| Dữ liệu thay thế tăng tỷ lệ duyệt cho hồ sơ mỏng mà không làm tổn thất tăng đáng kể | Bài tổng hợp của các nhà cung cấp dữ liệu (Credolab, Gridlines) | Thấp-trung bình: nguồn có lợi ích thương mại |
| Trả nợ linh hoạt không làm tăng vỡ nợ, có thể giảm | Nghiên cứu ngẫu nhiên có đối chứng về vi tín dụng (Review of Economic Studies; VoxDev; Oxford Review of Economic Policy) | Trung bình: mình dựa trên tóm tắt kết quả tìm được, chưa mở toàn văn; bối cảnh vi tín dụng ở nước đang phát triển |
| Thiên lệch do chỉ học từ khách đã được duyệt; thử nghiệm nhỏ giúp phát hiện | arXiv 2606.18479; Experian | Trung bình |
| Quy định consent, CIC, eKYC | Luật 91/2025, Nghị định 356/2025; quy định consent CIC từ 01/11/2026; eKYC cho vay tiêu dùng lần đầu | Trung bình: nguồn thứ cấp, cần đối chiếu văn bản gốc |

**Giới hạn cần nói thẳng:**
- Không có dữ liệu vỡ nợ thật của HLBVN; mọi mức lỗ, tỷ lệ duyệt là giả định.
- Con số chi phí và thời gian theo từng bước là suy luận, không phải số của case.
- Bằng chứng về trả nợ linh hoạt đến từ vi tín dụng, không hoàn toàn giống vay tiêu dùng ở checkout.
- Cấp độ 2 của trả nợ (chia tiền tại nguồn) phụ thuộc thỏa thuận với đối tác.
- Hạn mức tính hằng tuần vẫn có độ trễ; đã giảm bằng kiểm tra lúc checkout và sự kiện kích hoạt, nhưng không loại bỏ hết.

---

## 10. Gợi ý bố cục infographic 1920×1080 (Visualization 5%)
Trái → phải, theo đúng thứ tự chấm điểm:
1. **Vấn đề** (20%): một nguyên nhân, ba triệu chứng, biểu đồ 380,000 VND so với khoản vay 1.6 triệu.
2. **Luồng giải pháp** (35%): sơ đồ 7 bước làn nóng + làn lạnh.
3. **Vì sao hiệu quả** (30%): bảng trước/sau (giây, 53,000 VND), KPI.
4. **Rủi ro & giả định** (10%): 5 kiểm soát chính + nhãn giả định.
5. Chân trang: lộ trình 12 tháng + nguồn APA 7. Font Noto Sans, tiếng Anh.

---

## 11. Việc còn lại / cần nhóm quyết
- [ ] Chốt USP chính và độ lớn ngân sách thử nghiệm.
- [ ] Hỏi BTC/HLBVN: phân tích chi phí theo bước, tỷ lệ duyệt, tỷ lệ bỏ giỏ, dataset mô phỏng.
- [ ] Đối chiếu văn bản pháp luật gốc; mở toàn văn NBER và các nghiên cứu vi tín dụng để trích số liệu chính xác.
- [ ] Dịch sang tiếng Anh ngắn gọn cho infographic; định dạng nguồn APA 7.

## Từ điển ngắn
- **Underwriting** = bước ngân hàng kiểm tra trước khi cho vay. **CIC** = sổ ghi ai đã vay, ai trả. **Alt-data** = bằng chứng khác ngoài sổ CIC (tiền về app, ví, bán hàng). **STP** = quy trình chạy tự động. **eKYC** = xác minh danh tính bằng camera + dữ liệu. **Scorecard** = bảng điểm đơn giản, giải thích được. **Shadow mode** = chạy thử song song, chưa dùng quyết định.

## Nguồn (chuyển sang APA 7 khi làm infographic)
- Law/data: [FPF (2026)](https://fpf.org/wp-content/uploads/2026/01/January-2026-FPF-Issue-Brief-Making-Sense-of-Vietnams-Latest-Data-Protection-and-Governance-Regime-1.pdf) · [Tilleke - PDPL](https://www.tilleke.com/insights/vietnams-new-personal-data-protection-law-a-closer-look/) · [VietnamPlus - consent CIC](https://en.vietnamplus.vn/explicit-consent-required-for-sharing-customers-credit-information-from-november-1-post351801.vnp) · [Tilleke - eKYC cho vay](https://www.tilleke.com/insights/new-regulations-on-onshore-loans-in-vietnam/6/)
- Cash-flow/alt-data: [NBER - From FICO to Cash Flow](https://www.nber.org/system/files/working_papers/w33367/revisions/w33367.rev0.pdf) · [Plaid](https://plaid.com/resources/lending/cash-flow-underwriting/) · [Open Banking Expo](https://www.openbankingexpo.com/canada/how-alternative-and-cash-flow-data-are-enhancing-consumer-underwriting-worldwide/) · [Credolab](https://www.credolab.com/blog/alternative-data-for-lending)
- Repayment flexibility: [Review of Economic Studies](https://academic.oup.com/restud/article/91/5/2635/7425423) · [VoxDev](https://voxdev.org/topic/finance/impacts-flexible-repayment-schedules-evidence-borrowers-and-lenders-india) · [Oxford Review of Economic Policy](https://academic.oup.com/oxrep/article/40/1/129/7630836)
- Reject inference: [arXiv 2606.18479](https://arxiv.org/html/2606.18479v1) · [Experian](https://www.experian.com/blogs/insights/reject-inference/)
- Thị trường VN: [GlobeNewswire - BNPL Vietnam 2026](https://www.globenewswire.com/news-release/2026/01/29/3228868/0/en/Vietnam-Buy-Now-Pay-Later-Business-and-Investment-Report-2026-A-7-12-Billion-Market-by-2031-Featuring-MoMo-Home-Credit-FE-Credit-Kredivo-and-Fundiin.html) · [Maison Hanoi - Home Credit](https://www.maison-hanoi.com/reviews/home-credit-vietnam) · [FPT IS - CIC](https://fpt-is.com/en/customers/data-management-system-vietnam-national-credit-information-center-cic/)
- Lưu ý bản quyền case: HLBVN không cho trích dẫn số liệu case ra ngoài cuộc thi ([[business-challenge-2026]] §4.1).
