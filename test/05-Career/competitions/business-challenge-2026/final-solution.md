---
type: solution
date: 2026-10-02
tags: [competition, business-challenge-2026, solution, source-of-truth, v2]
status: SOURCE OF TRUTH for the competition — supersedes all earlier drafts
---

> **Đây là bản chốt (V2), nguồn chân lý duy nhất cho toàn bộ cuộc thi**, thay thế các bản trước. Import từ `PayFlow_Line_V2.docx` (02/10/2026).
>
> **Các file cũ đã archive, không dùng nữa:** [[final-solution-v1-2026-09-30]] (bản tiếng Việt V1), `payflow-line-pitch-en-v1-2026-10-01` (bản tiếng Anh V1) — cả hai còn trong `test/Archive/` chỉ để tham khảo lịch sử, số liệu trong đó đã lỗi thời (xem mâu thuẫn đã sửa ở các đoạn đánh dấu ⚠️ SỬA bên dưới).
> **Vẫn còn giá trị tham khảo (chưa archive):** [[underwriting-process-analysis]] (nguồn cho breakdown 5 bước ở §1.1), [[solution-usp-research]] (nghiên cứu USP ban đầu, một phần đã được tinh gọn thành USP duy nhất trong bản này).
> Nền tảng case: [[business-challenge-2026]] · Nhật ký liên quan: [[2026-09-30]] · [[2026-10-01]]
>
> **Còn thiếu để nộp bài:** bản này là tiếng Việt; đề yêu cầu nộp **tiếng Anh** — cần dịch trước khi lên infographic (xem việc cần làm ở mục 10 gốc + mục "Còn thiếu" cuối file này).

---

# PayFlow Line — Business Challenge 2026 (AI in Finance & Banking)

### Hong Leong Bank Vietnam — Point-of-Purchase Lending Case

> Bản trích xuất Markdown, khớp 1:1 với nội dung trong `PayFlow_Line_V2.docx`.

---

**BUSINESS CHALLENGE 2026 · AI IN FINANCE & BANKING · BẢN V2**

**PayFlow Line**

*Hạn mức tín dụng dựa trên dòng tiền cho vay tại điểm mua hàng — Case: Hong Leong Bank Vietnam*

> ℹ️ *Bản V2: áp toàn bộ feedback về (1) phạm vi kỹ thuật prototype — chốt rõ cái gì chạy thật/cái gì mock, và (2) các điểm chốt nội dung từ review của Luna và Ý — sửa mâu thuẫn số liệu, gốc rễ vấn đề, pháp lý, và bổ sung kiến trúc hạn mức dùng lại. Các đoạn có nhãn SỬA đánh dấu thay đổi so với bản V1 để tiện đối chiếu khi họp.*

# 0. Tóm tắt một trang

HLBVN hiện chỉ dùng một cách để kiểm tra khách có đáng cho vay không: đọc giấy tờ bằng tay rồi tra lịch sử CIC, và ra quyết định riêng cho từng hồ sơ mỗi lần khách mua hàng. Cách này tốn 380.000 VND và 1,8–4,6 ngày cho mọi hồ sơ, bất kể vay 1,6 triệu hay 90 triệu, và hoàn toàn mù với 64,5% khách hàng (gig worker, người bán hàng online, người vay lần đầu) không có hồ sơ CIC dù họ có thu nhập thật.

PayFlow Line thay đổi hai thứ cùng lúc: (1) tính sẵn một hạn mức dùng lại được nhiều lần thay vì duyệt mới mỗi lần mua, và (2) chấm điểm hạn mức đó bằng dữ liệu dòng tiền thật thay vì chỉ CIC. Hệ thống xếp mỗi hồ sơ vào một trong bốn làn xử lý, thu nợ ưu tiên qua chính hạ tầng ngân hàng đã có, và cho người vay lần đầu một con đường xây dựng lịch sử tín dụng từ khoản vay rất nhỏ — khoản vay này có lãi, không lỗ, miễn giữ đúng nguyên tắc thiết kế (xem mục 5.3).

| Chỉ số | Hiện tại | Mục tiêu PayFlow Line |
|---|---|---|
| Thời gian ra quyết định | 1,8 – 4,6 ngày, mỗi lần mua một hồ sơ mới | Dưới 10 giây khi đã có hạn mức (làn Xanh/Vàng); SLA 4 giờ nếu vào làn Cam |
| Chi phí mỗi quyết định (bình quân) | 380.000 VND | [Giả định] ~71.000 VND bình quân; ~25.000 VND cho hồ sơ tự động hoàn toàn |
| Tỷ lệ duyệt ở cùng mức rủi ro | ~44% | [Giả định] ~60% |
| Lãi/lỗ trên 1.000 hồ sơ | [Giả định] khoảng −0,17 tỷ VND | [Giả định] khoảng +0,37 tỷ VND; kịch bản xấu nhất vẫn +0,08 tỷ |

> ℹ️ *Mọi con số có nhãn [Giả định] dùng chung một bộ tham số kinh tế thống nhất (mục 5.1), không phải số liệu HLBVN xác nhận. Cần đội tự chạy lại một lần cuối trên Excel trước khi khóa số lên infographic (xem ô cảnh báo ở mục 5).*

# 1. Problem Diagnosis — Chẩn đoán vấn đề (20%)

## 1.1. Quy trình hiện tại: bóc tách 5 bước

Case chỉ cho hai tổng số: 1,8–4,6 ngày và 380.000 VND. Để hiểu chi phí và thời gian này nằm ở đâu, nhóm phân tách thành 5 bước, dựng ngược sao cho khớp đúng hai tổng số case cho:

| # | Bước | Ai làm | Thời gian (ngày) | Chi phí (VND) |
|---|---|---|---|---|
| 1 | Nộp/bổ sung giấy tờ | Khách + chi nhánh/merchant | 0,4–1,2 | 60.000 |
| 2 | Xếp hàng chờ xử lý trung tâm | Bộ phận vận hành | 0,5–1,3 | (quỹ lương chung) |
| 3 | Xác minh danh tính/SĐT/việc làm | Nhân viên xác minh | 0,4–1,0 | 90.000 |
| 4 | Đối chiếu CIC + hồ sơ thu nhập | Cán bộ tín dụng | 0,3–0,5 | 130.000 |
| 5 | Duyệt/ký/thiết lập giải ngân | Người duyệt + vận hành | 0,2–0,6 | 100.000 |
|  | Tổng |  | 1,8–4,6 (= case) | 380.000 (= case) |

> ℹ️ *Bảng phân tách là ước lượng minh họa của nhóm, tham chiếu cấu trúc quy trình vay tín chấp VN điển hình (SeABank — vay tín chấp, hồ sơ vay tín chấp). Cần xác thực với HLBVN nếu có breakdown thật.*

## 1.2. Nguyên nhân gốc: quyết định đặt ở cấp từng hồ sơ, không có phân luồng

> ⚠️ **SỬA:** Bản V1 nêu hai gốc rễ khác nhau ở cùng một mục ("một cổng duyệt cho mọi hồ sơ" và "thiếu lớp phiên dịch dữ liệu"). Lý do phải sửa: "thiếu phiên dịch" chỉ giải thích được vì sao 64,5% khách bị bỏ sót — nó không giải thích được vì sao 35,5% khách có lương và có CIC, dữ liệu đã chuẩn, vẫn tốn 380.000đ và chờ vài ngày. Gốc rễ đúng phải giải thích được cả hai nhóm.

**HLBVN ra quyết định ở cấp từng hồ sơ, không có bước phân luồng theo độ khó. Mọi hồ sơ — dễ hay khó, dữ liệu chuẩn hay không, vay 2 triệu hay 80 triệu — đều đi qua đúng một quy trình thủ công giống hệt nhau, được thiết kế cho khoản vay tại chi nhánh. Đây là nguyên nhân gốc duy nhất.**

- Chậm và đắt cho TẤT CẢ mọi hồ sơ, kể cả hồ sơ dễ — vì không có bước phân luồng: nhóm salaried có CIC (35,5%), dữ liệu chuẩn sẵn, vẫn phải xếp hàng qua đúng quy trình như hồ sơ khó nhất. Đây chính là nhóm đáng lẽ tự động hóa được ngay từ ngày đầu và dễ có lãi nhất — không phải nhóm "đã được quy trình cũ xử lý tốt" như cách hiểu sai trước đây.
- Mù với 64,5% khách hàng — vì quy trình chỉ đọc được CIC và giấy tờ. Đây là hệ quả của việc thiếu một lớp "phiên dịch" dữ liệu dòng tiền thô thành dữ liệu có cấu trúc — nhưng đây là lý do riêng cho NHÓM NÀY, không phải gốc rễ chung cho toàn bộ vấn đề.
- Mỗi lần mua là một hồ sơ mới — ngay cả khách đã từng được duyệt vay trước đó vẫn phải làm lại toàn bộ quy trình ở lần mua tiếp theo, vì không có cơ chế hạn mức dùng lại (xem 3.1).

Tóm lại: gốc rễ là thiết kế quyết định ở cấp từng hồ sơ thay vì cấp chính sách/phân luồng. "Thiếu phiên dịch dữ liệu" và "không có hạn mức dùng lại" là hai cơ chế cụ thể sinh ra từ gốc rễ này, không phải hai gốc rễ riêng.

## 1.3. Khoảng trống thông tin trong case: kênh nộp hồ sơ

Case không nói rõ khách bị "redirect" đi đâu. Nhóm không đoán chi tiết kênh, mà dùng đúng từ "redirected into a separate process" trong case làm bằng chứng cho hệ quả: bất kỳ sự gián đoạn nào kéo khách ra khỏi hành trình mua hàng đều tạo ra một khoảnh khắc để khách bỏ cuộc.

# 2. Intervention Justification — Vì sao giải pháp này đúng (30%)

## 2.1. Triết lý: can thiệp đúng chỗ, không đập đi xây lại

- Giữ nguyên hệ thống luật/chính sách rủi ro (rule-based policy engine) hiện có của HLBVN — đã kiểm chứng, dễ giải thích.
- Chỉ chèn AI vào đúng chỗ cần: đọc và chuẩn hóa dữ liệu dòng tiền thô, và tính điểm rủi ro bằng mô hình học từ dữ liệu.
- Quyết định cuối cùng vẫn do bộ luật/chính sách đã được hội đồng rủi ro duyệt trước đưa ra, không giao hoàn toàn cho một mô hình AI tự quyết.

## 2.2. Vì sao thực sự cần AI — không chỉ là "logistic regression thay if-else"

> ⚠️ **SỬA:** Bản V1 chỉ so sánh luật cứng tay với logistic regression để lập luận "vì sao AI" — giám khảo có thể không coi logistic regression là AI. Cần chỉ rõ việc AI làm được mà công thức tay không làm được.

Việc thực sự cần AI, không thể làm bằng luật cứng tay, là: đọc nội dung chuyển khoản tiếng Việt (ví dụ "CHUYEN KHOAN NGUYEN VAN A 15/03", "TRA GOP THE GIOI DI DONG") để tự động tách ra đâu là thu nhập thật, đâu là chi tiêu, và đâu là khoản đang trả góp ở nơi khác. Đây là bài toán xử lý ngôn ngữ tự nhiên (NLP) trên văn bản tự do, không phải việc có thể viết bằng if-else.

Lợi ích kép của việc này: (1) tách được thu nhập thật để tính Risk Score chính xác hơn, và (2) phát hiện vay chồng (loan stacking) NGAY TỪ BÂY GIỜ bằng cách đọc ra các khoản trả góp định kỳ khác đang chạy trên chính tài khoản HLB của khách — không cần chờ đến khi Open API toàn ngành có hiệu lực đầy đủ (3/2027) mới làm được, như cách hiểu chưa đúng ở bản trước (xem cập nhật ở mục 3.6).

Một lưu ý quan trọng về nguồn dữ liệu: ảnh chụp màn hình doanh thu app (Grab, Shopee...) rất dễ bị chỉnh sửa/làm giả, nên không nên dùng làm nguồn chính để chấm điểm. Luồng chính nên lấy dữ liệu trực tiếp từ tài khoản CASA tại HLB và doanh thu QR qua Sổ Bán Hàng — cả hai đều khó giả mạo hơn vì dữ liệu nằm sẵn trong hệ thống ngân hàng, không qua tay khách. Ảnh chụp màn hình chỉ nên dùng làm nguồn bổ sung/thứ cấp khi không có dữ liệu trực tiếp.

Risk Score sau khi có dữ liệu đã chuẩn hóa vẫn được tính bằng mô hình học có giám sát (logistic regression) — phương pháp ngành tín dụng dùng phổ biến hàng chục năm, không phải công nghệ thử nghiệm, và giải thích được cho credit committee: mọi quyết định diễn giải được trong một câu, ví dụ "Thu nhập 3 tuần gần đây không ổn định, nên hạn mức thấp hơn".

## 2.3. Tận dụng hạ tầng HLBVN đã có

| Tài sản đã có | Dùng vào PayFlow Line thế nào | Gỡ được |
|---|---|---|
| Hợp tác Sổ Bán Hàng (ký 10/2025) | Tiền khách quét QR trả cho shop chảy thẳng vào tài khoản HLB — ngân hàng thấy doanh thu thật hằng ngày; đồng thời là kênh thu nợ tự động (trích % doanh thu QR mỗi ngày), không cần Shopee/Grab đồng ý hợp tác | Chấm điểm + thu nợ cho MSME |
| Embedded Finance SDK (đang chạy với Sổ Bán Hàng) | Gắn nút "Trả góp qua HLB" vào bước thanh toán có sẵn | Tích hợp tại checkout |
| Dữ liệu CASA (tài khoản thanh toán tại HLB) | Khách có tài khoản HLB: xem lịch sử dòng tiền trực tiếp; khách bị từ chối: mời mở CASA, quan sát 2–3 tháng rồi duyệt lại | Chấm điểm nhóm salaried không CIC |
| eKYC 80 giây + đối chiếu CCCD gắn chip/C06 | Xác minh danh tính và chống gian lận trong vài chục giây | Xác minh danh tính |
| Kinh nghiệm HLB x DCAP Digital (Malaysia) | Tái sử dụng playbook quản trị mô hình thin-file, không copy model/dữ liệu xuyên biên giới | Quản trị mô hình thin-file |

> ℹ️ *Điểm yếu cần thừa nhận: Sổ Bán Hàng không độc quyền (ABBank đã ký hợp tác tương tự 12/2025), HLBVN chủ yếu hoạt động ở TP.HCM/Hà Nội. Lợi thế phải đến từ chất lượng quyết định tín dụng, không phải độc quyền kênh phân phối.*

## 2.4. Cơ sở pháp lý — đã chốt, không còn để ngỏ

> ⚠️ **SỬA:** Nghị định 13/2023 đã hết hiệu lực từ 1/1/2026, thay bằng Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025 (xác nhận qua LuatVietnam, ThuVienPhapLuat — xem phụ lục). Đã bỏ câu "NHNN kiểm duyệt mô hình 12–24 tháng" vì không có nguồn xác nhận. Thêm Luật Trí tuệ nhân tạo 134/2025/QH15.

| Văn bản | Vì sao liên quan |
|---|---|
| Thông tư 12/2024 (sửa TT 39/2016) | Khoản vay ≤100 triệu không cần "phương án sử dụng vốn" — toàn bộ dải vay trong case (1,6–90,1tr) được miễn loại giấy tờ này |
| Thông tư 06/2023 | Cho phép cho vay qua phương tiện điện tử toàn trình, dư nợ vay tiêu dùng online tối đa 100tr/khách — khớp trần 90,1tr của case |
| Thông tư 39/2016, Điều 27 | Cho phép phương thức "cho vay theo hạn mức" — cơ sở pháp lý trực tiếp cho kiến trúc "duyệt trước, dùng sau" (mục 3.1) |
| Nghị định 94/2025 (sandbox, hiệu lực 01/07/2025) | Cho thử nghiệm có giám sát mô hình chấm điểm tín dụng bằng dữ liệu thay thế và chia sẻ dữ liệu qua Open API, tối đa 2 năm |
| Thông tư 64/2024 (Open API) | Chuẩn kết nối đọc dữ liệu tài khoản ở ngân hàng khác khi khách đồng ý; tuân thủ đầy đủ từ 1/3/2027 — con đường nâng cấp giai đoạn sau, không phải điều kiện để bắt đầu |
| Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 + Nghị định 356/2025 (hiệu lực 01/01/2026) | Thay thế Nghị định 13/2023. Yêu cầu đồng ý rõ ràng theo từng mục đích sử dụng, công khai rằng dữ liệu dùng để "chấm điểm, xếp hạng tín dụng" |
| Luật Trí tuệ nhân tạo 134/2025/QH15 (hiệu lực 01/03/2026) + Nghị định 142/2026 | Hệ thống AI ngành tài chính thuộc nhóm có thể bị xếp "rủi ro cao", bắt buộc giải thích được lý do quyết định; thời gian chuyển tiếp 18 tháng kể từ hiệu lực → hạn tuân thủ 01/09/2027. Đây chính là lý do kỹ thuật, không chỉ lý do sản phẩm, để giữ scorecard logistic regression + rule engine thay vì mô hình hộp đen |

> ℹ️ *Thông tư 16/2020/TT-NHNN về eKYC: có khả năng đã được thay bằng Thông tư 17/2024 — cần đội tự kiểm tra lại văn bản gốc trước khi trích dẫn chính thức, chưa xác nhận trong phiên bản này.*

# 3. Solution Concept — Kiến trúc giải pháp (35%)

## 3.1. Hạn mức duyệt trước, dùng lại nhiều lần

> ⚠️ **SỬA:** Tên gọi "Line" (hạn mức) chưa thể hiện trong kiến trúc V1 — mỗi hồ sơ vẫn được mô tả như duyệt riêng lúc thanh toán. Đây là mục mới, đặt lên đầu phần 3 vì là nền tảng cho mọi phần sau.

Thay vì duyệt từng hồ sơ tại đúng thời điểm thanh toán, hệ thống tính sẵn một hạn mức, gắn với khách hàng chứ không gắn với một lần mua cụ thể:

- Khách đã có hạn mức: tại trang thanh toán chỉ cần xác nhận dùng hạn mức có sẵn — dưới 10 giây, không cần làm lại hồ sơ.
- Khách hoàn toàn mới: đi qua luồng 3 màn hình (xác minh danh tính → kết nối dữ liệu → nhận hạn mức khởi điểm) — khoảng 2–3 phút, chỉ một lần duy nhất.
- Hạn mức được làm mới (refresh) mỗi 30 ngày dựa trên dữ liệu dòng tiền cập nhật — tăng nếu thu nhập ổn định/tăng, giảm hoặc đóng băng nếu thu nhập giảm bất thường.

Đây chính là câu trả lời trực tiếp cho vấn đề "mỗi lần mua là một hồ sơ mới" đã nêu ở mục 1.2, và không cần phát hành thẻ tín dụng — cơ sở pháp lý là Thông tư 39/2016 Điều 27 (cho vay theo hạn mức).

## 3.2. Bốn làn quyết định

| Làn | Điều kiện | Hành động |
|---|---|---|
| 🟢 Xanh — Tự động duyệt | Risk thấp + Confidence cao | Duyệt trong vài giây, giữ nguyên điều kiện vay hiện có |
| 🟡 Vàng — Duyệt có điều kiện | Thin-file nhưng có dữ liệu dòng tiền; hoặc dữ liệu vùng biên | Cấp hạn mức khởi điểm nhỏ ngay; khách chia sẻ thêm một nguồn dữ liệu (Data Passport, 3.9) để mở thêm hạn mức |
| 🟠 Cam — Chuyển người xem | Confidence thấp VÀ khoản vay đủ lớn để đáng bỏ chi phí review | Hệ thống điền sẵn hồ sơ; cán bộ cam kết trả lời trong 4 giờ. Khoản nhỏ ở vùng xám KHÔNG chuyển người — nhận phương án thay thế tự động (giảm số tiền, rút ngắn kỳ hạn) |
| 🔴 Đỏ — Từ chối nhưng giữ chân | Dữ liệu không đủ, hoặc có dấu hiệu gian lận/nợ xấu | Từ chối kèm lý do rõ ràng, mời mở CASA miễn phí — giao dịch 2–3 tháng để xây hồ sơ, quay lại vay lần sau |

> ℹ️ *Nguyên tắc cốt lõi giữ xuyên suốt tài liệu: khoản vay nhỏ KHÔNG BAO GIỜ đi qua người duyệt tay — đây là điều kiện bắt buộc để kinh tế học của credit ladder (mục 3.7, 5.3) thành lập.*

## 3.3. Logic chấm điểm: Risk Score và Confidence Score

- Risk Score — khả năng khách trả được khoản vay, tính từ các yếu tố dòng tiền (thu nhập, độ đều đặn, tỷ lệ chi/thu, lịch sử trễ hạn nếu có).
- Confidence Score — hệ thống có đủ dữ liệu để tin vào Risk Score đó không.

> ⚠️ **SỬA:** Công thức Confidence Score (prototype logic — xem thêm bản kỹ thuật ở mục 7.2, đây KHÔNG phải trọng số production của HLB):

Confidence = 0,5 × Data Coverage + 0,3 × Source Agreement + 0,2 × Recency, trong đó: Data Coverage = min(số tháng dữ liệu ÷ 6, 1); Source Agreement = số nguồn độc lập xác nhận cùng một mẫu hình thu nhập ÷ 3 (tối đa 1); Recency = 1 nếu dữ liệu mới trong 30 ngày gần nhất, giảm tuyến tính về 0 khi dữ liệu cũ hơn 90 ngày. Confidence nằm trong khoảng 0–1; ngưỡng minh họa: ≥0,7 = cao, <0,4 = thấp, ở giữa là trung bình.

### Fix: không trừ hao hai lần (P25 + haircut)

> ⚠️ **SỬA:** V1 vừa lấy thu nhập P25 (đã bảo thủ) vừa áp thêm haircut 30–40% — hạn mức sẽ thấp quá tay. Chọn một, không dùng cả hai cùng lúc.

- Khách có ≥6 tháng dữ liệu liên tục: dùng P25 (phân vị 25) của chuỗi thu nhập, KHÔNG áp thêm haircut. Ví dụ tài xế có thu nhập 6 tháng 8/9/12/14/15/15 triệu → P25 ≈9 triệu, dùng thẳng con số này.
- Khách có <6 tháng dữ liệu: không đủ để tính P25 đáng tin, dùng trung bình đơn giản rồi áp haircut để bù rủi ro thiếu dữ liệu — 30–40% cho nguồn biến động (thu nhập tài xế), 10–15% cho nguồn ổn định (lương chuyển khoản).

## 3.4. Input theo từng nhóm khách và nguồn dữ liệu

| Nhóm khách | Dữ liệu dùng để chấm điểm | Kênh thu nợ chính |
|---|---|---|
| Salaried, có CIC (35,5%) | Hồ sơ CIC hiện có — nhóm nên tự động hóa ĐẦU TIÊN vì dữ liệu đã chuẩn, dễ có lãi nhất | Trả góp cố định qua tài khoản hiện có |
| Salaried, không CIC (20,5%) | Lịch sử lương chuyển khoản (CASA nếu có, hoặc Open API khi khách đồng ý) | Trả góp cố định, ưu tiên ủy quyền ghi nợ tự động từ CASA HLB |
| Gig/Platform workers (15%) | Thu nhập nền tảng (tần suất, độ ổn định, cờ phạt nếu có) | Xem 3.4a — cần khách chọn HLB làm tài khoản nhận payout |
| Online merchants/MSME (14,5%) | Doanh thu QR qua Sổ Bán Hàng, hóa đơn điện tử (bắt buộc từ 2026) | Trích % doanh thu QR mỗi ngày, ngay trong hạ tầng HLB |
| First-time borrowers (14,5%) | Dữ liệu ví điện tử, thanh toán hóa đơn đúng hạn (nếu có) | Khởi điểm 1,6 triệu VND; xem Credit Ladder, 3.7 |

### 3.4a. Lỗ hổng đã vá: thu nợ gig worker cần điều kiện cụ thể

> ⚠️ **SỬA:** V1 giả định trích nợ tự động từ "CASA/ví HLB theo nhịp tuần" cho gig worker, nhưng tiền của tài xế thường về ví Grab hoặc ngân hàng khác, không về HLB — chưa có gì để trích.

Cách gỡ: trong Data Passport (3.9), đặt điều kiện cụ thể — khách chọn tài khoản HLB làm tài khoản nhận thanh toán (payout destination) từ nền tảng (Grab/Be/...) để mở bậc hạn mức cao hơn. Nếu khách không đổi payout destination, hồ sơ rơi về Tier 1 tiêu chuẩn (xem 3.5 ngay dưới), với hạn mức thấp hơn. Đây là giả định cần ghi rõ: phụ thuộc việc khách đồng ý đổi điểm nhận tiền, không phải điều chắc chắn xảy ra.

## 3.5. Repayment Tiers — hai tầng thu nợ, không đặt cược vào đối thủ

> ⚠️ **SỬA:** Mục này bị thất lạc khi hợp nhất với bản sửa 3.4a ở một bản nháp trung gian — thêm lại thành mục riêng vì đây là một trong các cơ chế cốt lõi của giải pháp, không phải chi tiết phụ.

Nguyên tắc: không thiết kế hệ thống phụ thuộc vào việc một nền tảng cạnh tranh (Shopee, Grab — đều đã có sản phẩm cho vay riêng, không có động lực hợp tác) đồng ý chia sẻ payout. Thu nợ được chia thành 2 tầng rõ ràng theo mức độ HLB tự chủ được:

| Tầng | Cơ chế | Áp dụng |
|---|---|---|
| Tier 1 — Tự chủ, khả thi ngay | Trích tự động từ hạ tầng HLB đang kiểm soát trực tiếp: ủy quyền ghi nợ CASA (salaried), trích % doanh thu QR qua Sổ Bán Hàng (merchant). Không cần bất kỳ đối tác bên ngoài nào đồng ý. | Mặc định cho mọi nhóm khách, kể cả gig worker nếu chưa đổi payout destination (3.4a) |
| Tier 2 — Hợp tác nâng cấp, phụ thuộc đối tác | Trích trực tiếp tại nguồn khi nền tảng (Grab/Be...) đồng ý tách một phần payout trả thẳng cho HLB trước khi chuyển phần còn lại cho khách. | Chỉ khả thi với gig worker đã đổi payout destination sang HLB (3.4a); coi là nâng cấp, không phải nền móng — vì phụ thuộc thiện chí hợp tác của một nền tảng có sản phẩm cho vay cạnh tranh |

Vì sao chia tầng thay vì chọn một cơ chế duy nhất: Tier 2 (trích tại nguồn qua đối tác) là cách thu nợ "đẹp" nhất về lý thuyết, nhưng không thể là nền móng của toàn hệ thống vì không nằm trong tay HLB. Tier 1 kém lý tưởng hơn (khách vẫn có thể rút hết tiền trước ngày ủy quyền ghi nợ chạy) nhưng hoàn toàn khả thi trong 6–12 tháng vì không cần ai khác đồng ý. Thiết kế 2 tầng cho phép sản phẩm chạy được ngay bằng Tier 1, trong khi vẫn để ngỏ đường nâng cấp lên Tier 2 khi có đối tác phù hợp (ưu tiên nền tảng không có sản phẩm cho vay riêng, thay vì Shopee/Grab).

## 3.6. Kiểm soát khả năng chi trả và chống vay chồng

> ⚠️ **SỬA:** Affordability cap trước đây để trống. Đã chốt số cụ thể, neo theo chính sách hiện có của HLBVN.

- Nhóm salaried (có/không CIC): khoản trả nợ mỗi kỳ không vượt quá 60% thu nhập — neo theo đúng mức trần đã áp dụng trong chính sách vay tín chấp hiện có của HLBVN.
- Nhóm thu nhập biến động (gig/merchant/first-time): mức trần thấp hơn, đề xuất 30% thu nhập P25 mỗi kỳ — [Giả định, cần đội chốt lại số cuối].

> ⚠️ **SỬA:** Chống vay chồng: V1 nói phải chờ Open API 2027 mới phát hiện được. Đã sửa — AI đọc nội dung chuyển khoản (2.2) phát hiện được một phần ngay từ bây giờ.

- Phát hiện được ngay: đọc nội dung chuyển khoản trên chính tài khoản CASA của khách tại HLB để nhận diện các khoản trả góp/vay định kỳ khác đang chạy — không cần chờ Open API toàn ngành.
- Giới hạn còn lại (thành thật): chỉ thấy được giao dịch chảy qua tài khoản khách đã kết nối với HLB. Vay chồng qua tài khoản ở ngân hàng/BNPL khác mà khách chưa kết nối vẫn là điểm mù — cần hạ tầng chia sẻ dữ liệu liên ngân hàng (Open API, đầy đủ từ 3/2027) để giải quyết triệt để. Đây vẫn là giới hạn đã biết, chỉ là mức độ nghiêm trọng giảm so với mô tả V1.

## 3.7. Credit Ladder và vòng lặp học cho người vay lần đầu

Người vay lần đầu bắt đầu ở hạn mức rất nhỏ (1,6 triệu VND). Trả đúng hạn → hạn mức tăng dần → đồng thời được báo cáo lên CIC, giúp khách xây dựng lịch sử tín dụng đầu tiên trong đời.

> ⚠️ **SỬA:** V1 có mâu thuẫn: hạn mức khởi điểm 1,6 triệu nhỏ hơn điểm hòa vốn đã nêu (4,7 triệu), nên khoản vay đầu tiên luôn lỗ theo đúng số của chính tài liệu. Đã tính lại (mục 5.3): với nguyên tắc "khoản nhỏ không bao giờ qua người duyệt tay" được giữ nghiêm, điểm hòa vốn của làn tự động nhỏ chỉ còn khoảng 1,4 triệu — THẤP HƠN 1,6 triệu. Khoản khởi điểm của credit ladder vì vậy CÓ LÃI, không lỗ, miễn nguyên tắc này được tuân thủ tuyệt đối. Đây là luận điểm quan trọng nên đưa lên trang.

Giới hạn kỹ thuật cần thừa nhận: mô hình chỉ huấn luyện trên dữ liệu khách đã được duyệt sẽ học lệch, vì ngân hàng không có dữ liệu thật về khả năng trả nợ của nhóm trước đây luôn bị từ chối (reject inference). Nghiên cứu gần đây cho thấy kỹ thuật thống kê để "đoán" nhãn cho người bị từ chối thường không cải thiện được mô hình thật, và đề xuất controlled exploration: chủ động duyệt một tỷ lệ nhỏ, có giới hạn, để quan sát kết quả thật. Áp dụng: dành khoảng 5% hồ sơ thin-file ở ngưỡng biên, cho vay thử tối đa 3 triệu VND — chi phí ước tính khoảng 9 triệu VND trên 1.000 hồ sơ, một ngân sách có giới hạn rõ ràng.

## 3.8. Chống gian lận cả hai phía

- Phía khách vay: đọc chip CCCD, kiểm tra người thật trước camera (liveness), đối chiếu khuôn mặt với dữ liệu dân cư (C06), nhận diện thiết bị dùng cho nhiều hồ sơ khác nhau, tra hệ thống cảnh báo gian lận (SIMO).
- Phía người bán: chấm điểm rủi ro cho từng merchant — phát hiện shop có quá nhiều đơn trả góp bất thường, nhiều khách của cùng một shop trễ hạn ngay kỳ đầu, hoặc tỷ lệ hoàn hàng cao bất thường (rủi ro cấu kết tạo đơn hàng ảo).

## 3.9. Chào mời đúng người và Data Passport

Hệ thống chấm 3 điểm riêng trước khi hiện lời mời vay: khách có cần không (đang mua món giá trị lớn so với thu nhập), có xu hướng chấp nhận không, và có đang dùng có trách nhiệm không (không vay chồng, khoản trả góp không quá nặng). Chỉ khi cả ba đều đạt mới hiện lời mời.

Data Passport: khách thấy rõ những nguồn dữ liệu có thể chia sẻ (tài khoản HLB, doanh thu Sổ Bán Hàng, hóa đơn điện tử, thu nhập nền tảng, và lựa chọn đổi payout destination sang HLB cho nhóm gig — 3.4a), mỗi nguồn có nút đồng ý riêng, chia sẻ thêm một nguồn mở thêm một bậc hạn mức cụ thể.

## 3.10. Giá và phí — đã sửa mâu thuẫn

> ⚠️ **SỬA:** V1 vừa nói khách trả 0% ở kỳ ngắn, vừa tính phí người bán cộng dồn lên trên — hai điều này không thể cùng đúng. Đã sửa: phí người bán THAY THẾ lãi suất khách phải trả, không cộng dồn.

- Kỳ hạn ngắn (3–6 tháng): khách trả lãi suất 0% hoặc rất thấp; doanh thu ngân hàng đến từ phí người bán (mô hình giống MDR), KHÔNG thu thêm từ khách. Người bán chấp nhận trả phí vì BNPL giúp họ bán được nhiều hơn.
- Kỳ hạn dài hơn (từ 9 tháng): khách trả lãi suất cố định (2–3 mức, công bố trước), không có phí người bán hoặc phí giảm dần theo kỳ hạn.
- Trước khi khách xác nhận, luôn hiện tổng số tiền phải trả bằng VND, không chỉ ghi lãi suất phần trăm.

## 3.11. Tác động cộng đồng và tài chính toàn diện

> ⚠️ **SỬA:** Số liệu lao động phi chính thức ở V1 (33 triệu, ~65%) là số liệu năm 2023. Đã thay bằng số liệu 2025 của Tổng cục Thống kê.

64,5% khách hàng hiện khó được duyệt không phải vì bản chất rủi ro, mà vì vô hình với một hệ thống chưa từng được xây để nhìn thấy họ. Theo số liệu năm 2025 của Tổng cục Thống kê, khoảng 63% lao động Việt Nam làm việc phi chính thức, thu nhập bình quân khoảng 8,4 triệu VND/tháng — tạo thu nhập đều đặn nhưng không có hợp đồng lao động hay sao kê chuẩn. Đọc đúng dòng tiền thay vì đòi giấy tờ họ chưa từng có cơ hội xây dựng biến nhóm khách hiện khó phục vụ thành nhóm phục vụ được có trách nhiệm và có lợi nhuận.

# 4. Giả định và dữ liệu (10%)

> ⚠️ **SỬA:** V1 viết "rubric đã gộp mục này vào Solution Concept, không cần phần riêng" — nhưng tab Overview của đề ghi Data & Assumptions là tiêu chí riêng, 10%. Cần đội tự kiểm tra lại đề gốc. Dù đề ghi thế nào, một dải giả định đánh số ở chân infographic là cách rẻ để giữ chắc 10% này.

Dải giả định A1–A6 đề xuất cho infographic (mỗi con số giả định trong phần 3 và 5 nên trỏ về một mã dưới đây):

- A1 — Bảng phân tách 5 bước (1.1) là ước lượng minh họa, dựng ngược từ 2 tổng số case cho; cần xác thực với HLBVN nếu có breakdown thật.
- A2 — Case không nói rõ kênh nộp hồ sơ hiện tại; nhóm chỉ dùng từ "redirected" trong case làm bằng chứng gián đoạn hành trình mua hàng, không đoán kênh cụ thể.
- A3 — Bộ tham số kinh tế (lãi suất, chi phí vốn, chi phí rủi ro, tỷ lệ tự động hóa) ở mục 5.1 là giả định minh họa, neo vào benchmark thị trường VN công khai.
- A4 — Giả định HLBVN có thể thiết lập hợp tác chia sẻ dữ liệu với ví điện tử/nền tảng giao hàng, có đồng ý rõ ràng của khách, theo khung Open API và sandbox hiện hành.
- A5 — Giả định khách gig worker đồng ý đổi payout destination sang HLB để mở bậc hạn mức cao hơn (3.4a) — không phải điều chắc chắn xảy ra.
- A6 — Trần affordability 30% cho nhóm thu nhập biến động là đề xuất minh họa, cần đội chốt số cuối.

# 5. KPI và hiệu quả kinh tế

## 5.1. Bộ tham số kinh tế thống nhất

> ⚠️ **SỬA:** Đây là thiếu sót lớn nhất ở V1: hai thành viên tính điểm hòa vốn bằng hai bộ tham số khác nhau, ra hai con số không khớp. Từ bản này, TOÀN BỘ phép tính trong tài liệu dùng chung đúng một bộ số sau.

| Tham số | Giá trị | Căn cứ |
|---|---|---|
| Lãi suất cho vay tham khảo (sản phẩm điểm bán mới) | 22%/năm | [Giả định] Áp dụng cho sản phẩm mới phục vụ rủi ro trung bình cao hơn danh mục tín chấp hiện có |
| Lãi suất vay tín chấp hiện có của HLBVN (tham chiếu riêng, không dùng cho sản phẩm mới) | từ 15%/năm | Website HLBVN (UPL) — dùng làm mốc so sánh cạnh tranh với Home Credit/FE Credit ở 2.3, không lẫn với lãi suất 22% của sản phẩm điểm bán mới |
| Chi phí vốn | 8%/năm | [Giả định] Neo gần dải lãi suất huy động kỳ hạn 12 tháng thực tế 8,8–9,5% (Tuổi Trẻ, 11/9) — cần đội kiểm tra lại vì chi phí vốn thường cao hơn một chút so với lãi huy động thuần |
| Chi phí rủi ro (expected credit loss) | 4%/năm | [Giả định minh họa] |
| Tỷ lệ xử lý thẳng (STP — không qua người) | ≥85% | [Giả định], dựa trên tỷ trọng hồ sơ làn Xanh + Vàng trong cơ cấu đơn case |
| Tỷ lệ duyệt ở cùng mức rủi ro | 44% → 60% | [Giả định] |

## 5.2. So sánh trước/sau (toàn danh mục, trên 1.000 hồ sơ)

| Chỉ số | Hiện tại | PayFlow Line |
|---|---|---|
| Chi phí mỗi quyết định (bình quân) | 380.000 VND | [Giả định] ~71.000 VND |
| Tỷ lệ duyệt (cùng mức rủi ro) | ~44% | [Giả định] ~60% |
| Lãi/lỗ trên 1.000 hồ sơ | [Giả định] ≈ −0,17 tỷ VND | [Giả định] ≈ +0,37 tỷ VND |
| Kịch bản xấu nhất (chi phí vốn 10%, nợ xấu ×1,5, duyệt chỉ tăng một nửa) | — | [Giả định] vẫn lãi ≈ +0,08 tỷ VND |

> ℹ️ *Các con số portfolio P&L ở trên gốc tính với lãi suất 20%; cần đội chạy lại một lần cuối bằng Excel ở đúng 22% theo bộ tham số thống nhất (5.1) trước khi khóa số lên infographic — đây là việc còn lại duy nhất trong phần kiểm tra kinh tế.*

## 5.3. Điểm hòa vốn theo từng làn (kỳ hạn 6 tháng) — đã tính lại

| Làn xử lý | Chi phí/quyết định | Khoản vay tối thiểu để hòa vốn |
|---|---|---|
| Duyệt tay (làn Cam, chi phí đầy đủ) | 380.000 VND | [Giả định] ≈29,6 triệu VND |
| Tự động hoàn toàn (làn Xanh/Vàng) | [Giả định] ~25.000 VND | [Giả định] ≈1,4 triệu VND |
| Bình quân toàn danh mục (có trọng số theo tỷ lệ qua người/tự động và tỷ lệ duyệt) | [Giả định] ~71.000 VND | [Giả định] ≈4,5 triệu VND |

Kết luận quan trọng: hạn mức khởi điểm 1,6 triệu VND của credit ladder (3.7) CÓ LÃI so với điểm hòa vốn làn tự động (≈1,4 triệu), với điều kiện bắt buộc: khoản vay nhỏ không bao giờ đi qua người duyệt tay. Đây là lý do nguyên tắc phân luồng ở mục 3.2 không chỉ là thiết kế vận hành gọn, mà là điều kiện sống còn về mặt kinh tế của toàn bộ sản phẩm.

> ℹ️ *Kiểm tra sức chịu đựng với bộ tham số xấu hơn cho hai kết quả cần đối chiếu lại: 65,8 triệu và 3,7 triệu VND — đội cần xác nhận lại kịch bản cụ thể tạo ra hai con số này trước khi đưa vào infographic, vì cách suy ra từ ghi chú gốc chưa đủ rõ ràng để trình bày chắc chắn.*

## 5.4. KPI vận hành và rủi ro

> ⚠️ **SỬA:** V1 chỉ ghi "tăng đáng kể" cho các chỉ số, và hoàn toàn thiếu KPI rủi ro — trong khi banker thật sẽ hỏi rủi ro trước tiên.

| KPI | Mục tiêu |
|---|---|
| Tỷ lệ xử lý thẳng (STP, không qua người) | ≥85% |
| Chi phí mỗi quyết định | ~25.000 VND cho hồ sơ tự động; ~71.000 VND bình quân toàn danh mục |
| Tỷ lệ duyệt ở cùng mức rủi ro | 44% → 60% |
| Trễ hạn ngay kỳ đầu (First Payment Default), theo nhóm khách và theo người bán | Theo dõi riêng từng nhóm; không cao hơn danh mục hiện có |
| Tỷ lệ trễ hạn 30+ ngày tại tháng thứ 3 (30+ DPD tại MOB3) | Không cao hơn danh mục tín chấp hiện có của HLBVN |
| Tỷ lệ cán bộ ghi đè quyết định của máy (override rate) | Theo dõi để phát hiện model lệch sớm |
| Tỷ lệ quyết định có lý do giải thích được | 100% |
| Nút dừng khẩn cấp (kill-switch) | Tự động siết điều kiện duyệt khi bất kỳ chỉ số rủi ro nào vượt ngưỡng cảnh báo |

# 6. Lộ trình 6–12 tháng

> ⚠️ **SỬA:** V1 hoàn toàn thiếu lộ trình triển khai theo thời gian, trong khi thư ngỏ HLBVN nhấn mạnh yêu cầu "triển khai được trong 6–12 tháng". Lộ trình dưới đây gộp đề xuất của cả hai phương án đã có trong nhóm, giữ lại ý "chạy song song để kiểm chứng" (shadow mode) làm bước bắt buộc trước khi mở rộng sang nhóm rủi ro cao hơn.

| Giai đoạn | Việc chính |
|---|---|
| Tháng 0–2 | Áp luật tự động duyệt (làn Xanh) cho nhóm salaried có CIC và nhóm nhận lương qua HLB — nhóm dễ nhất, ít rủi ro mô hình nhất. Nộp hồ sơ tham gia sandbox (Nghị định 94/2025) song song. |
| Tháng 2–5 | Chạy mô hình ở chế độ song song (shadow mode) cho các nhóm thin-file — mô hình tự tính điểm nhưng KHÔNG ra quyết định sống, so sánh với quyết định của cán bộ để kiểm chứng độ chính xác trước khi cho máy tự quyết thật. Bắt đầu tích hợp kỹ thuật với Sổ Bán Hàng. |
| Tháng 5–8 | Pilot sống (live) với các shop trên Sổ Bán Hàng (làn Vàng cho MSME); triển khai Data Passport. |
| Tháng 8–12 | Hội đồng tín dụng duyệt chính thức ngưỡng điểm cho nhóm gig worker và first-time borrower dựa trên dữ liệu shadow mode đã tích lũy; mở làn Vàng cho hai nhóm này kèm ngân sách "cho vay để học" (3.7); chuẩn bị sẵn sàng kỹ thuật cho Open API trước hạn 3/2027. |

# 7. Kỹ thuật Prototype — Phạm vi Demo

Mục tiêu demo: chạy được một pipeline thật từ input → đọc/chuẩn hóa dữ liệu → Risk Score + Confidence Score → decision lane → giải thích kết quả — không cần kết nối bất kỳ hệ thống ngân hàng thật nào. Nguyên tắc quan trọng nhất: chốt trước cái gì chạy thật, cái gì mock, trước khi code.

## 7.1. LLM API — chạy thật, nhưng chỉ ở đúng 2 lớp

- Lớp đọc/chuẩn hóa dữ liệu đầu vào: đọc cash-flow từ PDF, ảnh, hoặc dữ liệu mô phỏng, tách thu nhập/chi tiêu/khoản trả góp khác (2.2).
- Lớp giải thích kết quả cho người dùng/nhân viên: dịch điểm số và lý do thành câu dễ hiểu.

> ⚠️ **SỬA:** LLM KHÔNG được dùng để tính Risk Score hoặc tự quyết định tín dụng. Risk Score phải do mô hình scoring riêng (logistic regression) tính — cần thể hiện rõ ranh giới này trong architecture diagram để không vi phạm yêu cầu ban đầu của dự án (AI lõi phải gọi LLM API thật) lẫn yêu cầu giải thích được của ngành ngân hàng.

## 7.2. Confidence Score — công thức cụ thể để implement

Dùng đúng công thức đã chốt ở mục 3.3: Confidence = 0,5 × Data Coverage + 0,3 × Source Agreement + 0,2 × Recency. Trọng số 0,5/0,3/0,2 là prototype logic để demo pipeline chạy được, không phải trọng số production của HLB — cần nói rõ điều này nếu bị hỏi trong demo.

## 7.3. Risk Score — train thật trên dữ liệu synthetic

- Chốt phương án: train thật một Logistic Regression trên synthetic data, không dùng scorecard gán trọng số bằng tay.
- Synthetic data có thể do BTC cung cấp (chưa xác nhận). Nếu không, team tự sinh dữ liệu trước khi train.

> ℹ️ *Câu trả lời thống nhất nếu bị hỏi trong demo/thuyết trình: "For the prototype, we trained a logistic regression model on synthetic data representing the five customer groups and their cash-flow patterns. In production, the model would need to be trained and validated using HLB's real historical repayment data." Synthetic data chỉ dùng để chứng minh pipeline kỹ thuật, không đại diện cho dữ liệu khách hàng thật của HLB.*

## 7.4. Yêu cầu dữ liệu synthetic

- Ít nhất 6 tháng dữ liệu cho mỗi khách mẫu.
- Đại diện đủ 5 nhóm khách: Salaried có CIC, Salaried không CIC, Gig/Platform workers, Online merchants/MSME, First-time borrowers.
- Có đủ biến cần thiết cho cash-flow/risk scoring và kết quả trả nợ (repayment outcome).

Dataset không cần trở thành một tính năng riêng của sản phẩm — chỉ cần đủ để train/test Logistic Regression.

## 7.5. Phạm vi live demo

- Chỉ chọn 1 nhóm khách + 1 decision lane để chạy end-to-end trực tiếp (gợi ý: gig worker hoặc first-time borrower, đi qua làn Vàng — đây là phần khác biệt rõ nhất của giải pháp).
- Các nhóm khách và lane còn lại chỉ trình bày trên slide, không cố build giao diện tương tác đầy đủ.
- Kiến trúc/code nên thiết kế để các lane khác có thể mở rộng sau, nhưng không cần demo toàn bộ trong 5 ngày.

## 7.6. Mock integrations — chốt dứt khoát

| Hệ thống | Trạng thái trong prototype |
|---|---|
| CIC | Mock |
| C06 / chip CCCD | Mock |
| HLB CASA | Mock |
| QR / Sổ Bán Hàng | Mock |

Không xây integration thật, không yêu cầu credentials/API access thật với bất kỳ hệ thống nào ở trên. Nếu cần minh họa API flow, chỉ tạo mock endpoint/mock response có format gần với hệ thống thật. Trong code/README phải ghi rõ các integration này là mock/simulated để không thành viên nào hiểu nhầm là cần tích hợp hệ thống thật trước demo.

## 7.7. Bảng tổng hợp phạm vi demo

| Thành phần | Demo |
|---|---|
| LLM API (chuẩn hóa dữ liệu + giải thích kết quả) | Chạy thật |
| Logistic Regression (Risk Score) | Chạy thật — train trên synthetic data |
| Confidence Score | Chạy thật — theo công thức 3.3/7.2 |
| Dữ liệu khách hàng | Synthetic/mock |
| CIC / C06 / CASA / QR Sổ Bán Hàng | Mock |
| HLB risk/policy engine (bốn làn) | Mock/giả lập rule nếu cần |
| Human review (làn Cam) | Giả lập nếu không nằm trong live flow demo |

# 8. Giới hạn đã biết

- Reject inference / cold start: giảm nhẹ bằng credit ladder và ngân sách "cho vay để học" có giới hạn, không giải quyết dứt điểm ngay từ ngày đầu.
- Thu nợ gig worker phụ thuộc việc khách đồng ý đổi payout destination sang HLB (3.4a) — không chắc đạt tỷ lệ cao ngay từ đầu.
- Vay chồng ngoài hệ sinh thái HLB (ngân hàng/BNPL khác mà khách chưa kết nối) vẫn là điểm mù cho đến khi Open API toàn ngành đầy đủ (3/2027) — đã giảm nhẹ một phần nhờ đọc giao dịch trên CASA (3.6), nhưng chưa giải quyết triệt để.
- Kênh nộp hồ sơ hiện tại không được case nêu rõ — giải pháp dựa trên bằng chứng gián tiếp ("redirected").
- Thông tư 16/2020 về eKYC cần xác nhận lại có còn hiệu lực hay đã được thay bằng Thông tư 17/2024.
- Điểm hòa vốn kịch bản xấu nhất (65,8 triệu và 3,7 triệu, mục 5.3) cần đội tự xác nhận lại phương pháp tính trước khi đưa vào bản nộp chính thức.

# 9. Điểm khác biệt so với các đội khác

- Hạn mức duyệt trước, dùng lại nhiều lần — không duyệt mới mỗi lần mua, trả lời trực tiếp "mỗi lần mua là một hồ sơ mới" mà hầu hết đội khác sẽ bỏ qua.
- AI đặt đúng chỗ: đọc dữ liệu tiếng Việt lộn xộn và phát hiện vay chồng ngay bây giờ, không chỉ là "logistic regression thay if-else".
- Thu nợ dùng chính hạ tầng tiền của HLB (CASA, Sổ Bán Hàng) làm nền tảng — không đặt cược vào việc Shopee/Grab đồng ý hợp tác.
- Chỉ dùng người khi khoản vay đủ lớn để đáng — và chứng minh bằng số rằng đây là điều kiện kinh tế bắt buộc để credit ladder có lãi, không chỉ là lựa chọn vận hành.
- Có lộ trình triển khai theo tháng với bước kiểm chứng song song (shadow mode) trước khi cho máy tự quyết thật — không chỉ nói "khả thi trong 6–12 tháng" suông.
- Chủ động nêu giới hạn kỹ thuật thật kèm cách giảm nhẹ cụ thể, thay vì ngụ ý mô hình hoàn hảo.

# 10. Việc cần làm trước khi hoàn thiện infographic

- Chạy lại portfolio P&L (5.2) ở đúng lãi suất 22% theo bộ tham số thống nhất (5.1) — hiện vẫn đang mang số cũ tính ở 20%.
- Xác nhận lại phương pháp tính hai con số kiểm tra sức chịu đựng (65,8tr và 3,7tr, mục 5.3).
- Chốt số cuối cho affordability cap nhóm thu nhập biến động (đề xuất 30%, mục 3.6/A6).
- Kiểm tra lại Thông tư 16/2020 có còn hiệu lực không (8).
- Tìm lại/bổ sung link thật cho các nguồn: Thông tư 12/2024, 06/2023, 39/2016 Điều 27, Nghị định 94/2025, Thông tư 64/2024, số liệu GSO 2025, trang lãi suất HLBVN — bắt buộc vì đề yêu cầu trích dẫn APA 7th Edition.
- Kiểm tra lại đề gốc xem Data & Assumptions có phải tiêu chí 10% riêng không (mục 4).
- Chuẩn bị synthetic dataset (6+ tháng/khách, 5 nhóm) trước khi code phần Risk Score (7.3–7.4).
- Thiết kế infographic 1920×1080, PDF, font Noto Sans — ưu tiên diện tích cho mục 1, 3.1–3.6, và bảng 5.2/5.3; mục 6–10 chỉ cần 1–2 dòng tóm tắt hoặc để lại cho phần thuyết trình.

# Phụ lục — Nguồn tham khảo

> ⚠️ **SỬA:** Đã bỏ các nguồn không thực sự được trích dẫn trong nội dung bài (PwC, McKinsey, Kredivo, GCash, e-Conomy SEA, Global Findex) vì không có link và đề bắt buộc trích dẫn APA 7th Edition. Danh sách dưới đây chỉ còn nguồn thực sự dùng trong văn bản ở trên.

- SeABank — Vay tín chấp (quy trình, 3–5 ngày làm việc) [cần nhóm dán lại link gốc]
- SeABank — Hồ sơ vay tín chấp [cần nhóm dán lại link gốc]
- ClearStaq — The Hidden Cost of Manual Bank Statement Review (benchmark Mỹ, chỉ tham khảo hướng) — https://clearstaq.com/blog/hidden-cost-manual-bank-statement-review
- LuatVietnam — Điểm mới của Nghị định 356/2025 so với Nghị định 13/2023 về bảo vệ dữ liệu cá nhân — https://luatvietnam.vn/dan-su/diem-moi-cua-nghi-dinh-356-2025-so-voi-nghi-dinh-13-2023-ve-bao-ve-du-lieu-ca-nhan-568-106269-article.html
- ThuVienPhapLuat — Toàn văn Nghị định 356/2025/NĐ-CP hướng dẫn Luật Bảo vệ dữ liệu cá nhân — https://thuvienphapluat.vn/phap-luat-nha-dat/toan-van-nghi-dinh-3562025ndcp-huong-dan-luat-bao-ve-du-lieu-ca-nhan-13670.html
- ApolatLegal — Luật Trí tuệ nhân tạo 2025 số 134/2025/QH15 — https://apolatlegal.com/vi/laws/luat-tri-tue-nhan-tao-2025-so-134-2025-qh15/
- Tạp chí Ngân hàng (NHNN) — Luật Trí tuệ nhân tạo năm 2025 và những tác động đến lĩnh vực ngân hàng tại Việt Nam — https://tapchinganhang.gov.vn/luat-tri-tue-nhan-tao-nam-2025-va-nhung-tac-dong-den-linh-vuc-ngan-hang-tai-viet-nam-17169.html
- LuatVietnam — Sẽ có 1 Nghị định, 2 Quyết định, 1 Thông tư hướng dẫn Luật Trí tuệ nhân tạo (Nghị định 142/2026) — https://luatvietnam.vn/tin-van-ban-moi/se-co-1-nghi-dinh-2-quyet-dinh-1-thong-tu-huong-dan-luat-tri-tue-nhan-tao-duoc-ban-hanh-186-106883-article.html
- Thông tư 12/2024 (sửa Thông tư 39/2016); Thông tư 06/2023; Thông tư 39/2016 Điều 27; Nghị định 94/2025 (sandbox); Thông tư 64/2024 (Open API) [cần nhóm dán lại link gốc từ nghiên cứu trước]
- Hong Leong Bank Vietnam — Digital CX Awards 2026, hợp tác Sổ Bán Hàng (10/2025) [cần nhóm dán lại link gốc]
- HLBVN — trang vay tín chấp cá nhân, lãi suất "từ 15%/năm" [cần nhóm dán lại link gốc]
- Tuổi Trẻ, 11/9 — lãi suất huy động kỳ hạn 12 tháng 8,8–9,5% [cần nhóm dán lại link gốc]
- Tổng cục Thống kê (GSO) 2025 — lao động phi chính thức 63%, thu nhập bình quân 8,4 triệu [cần dán lại link từ tài liệu gốc của Ý]
- FinRegLab — Cash-flow data underwriting research [cần nhóm dán lại link gốc]
- Berg et al. — Digital Footprints (chấm điểm bằng dấu vết số) [cần nhóm dán lại link gốc]
- Coelho et al. — Brazilian Payroll Lending (trừ nợ tại nguồn) [cần nhóm dán lại link gốc]
- CFPB — BNPL loan stacking (Mỹ) [cần nhóm dán lại link gốc]
- Stripe — Business Cash Flow Loans (revenue-based financing, trích nợ tại nguồn) — https://stripe.com/resources/more/business-cash-flow-loans
- "Invisible Primes: Fintech Lending with Alternative Data", Management Science — https://pubsonline.informs.org/doi/10.1287/mnsc.2024.07854
- "The Illusion of Improvement: Reject Inference Strategies in Credit Scoring" (2026) — https://arxiv.org/html/2606.18479v1
- SAS — Reject Inference Techniques Implemented in Credit Scoring — https://support.sas.com/resources/papers/proceedings09/305-2009.pdf
