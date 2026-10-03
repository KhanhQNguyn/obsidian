This is the newest knowledge base. Base on this only as the source of truth.
Day of update: 3th October, 2026
# PayFlow Line — Deep Project Knowledge Base

_Tài liệu này không phải bài thuyết trình. Đây là nguồn tham khảo đầy đủ để NotebookLM (hoặc bất kỳ ai đọc kỹ) có đủ ngữ cảnh trả lời các câu hỏi về nghiệp vụ, kỹ thuật, rủi ro, và triển khai — kể cả những câu hỏi xoáy sâu mà bản tóm tắt dành cho giám khảo không tiện đi vào._

## Cách đọc tài liệu này — hệ thống nhãn

Mỗi claim quan trọng trong tài liệu được gắn 1 trong 5 nhãn sau, để không ai nhầm lẫn giữa "sự thật", "ý tưởng của đội", và "giả định":

|Nhãn|Ý nghĩa|
|---|---|
|**[FACT — đề bài]**|Thông tin lấy trực tiếp từ case HLBVN, không chỉnh sửa|
|**[NGUỒN NGOÀI]**|Thông tin từ nguồn bên ngoài đã được tìm và xác minh thật trong quá trình làm bài (có URL)|
|**[GIẢI PHÁP — đội đề xuất]**|Thiết kế/cơ chế do đội tự nghĩ ra, không phải fact có sẵn|
|**[GIẢ ĐỊNH]**|Con số hoặc điều kiện đội tự đặt ra vì case không cung cấp, cần kiểm chứng lại|
|**[PROTOTYPE]**|Chi tiết chỉ áp dụng cho bản demo kỹ thuật của cuộc thi, không nhất thiết đúng khi làm thật|
|**[CÂN NHẮC PRODUCTION]**|Điều cần làm thêm nếu triển khai thật tại HLBVN, chưa có trong phạm vi bài thi|

**Kiến trúc hệ thống được giữ nguyên xuyên suốt tài liệu, không được thay đổi dưới bất kỳ hình thức nào:**

```
Dữ liệu thô → LLM đọc/chuẩn hóa → structured features →
Confidence Score + Logistic Regression Risk Score →
Rules/Policy → Lane decision → LLM explanation
```

LLM **không bao giờ** là người ra quyết định tín dụng cuối cùng. Việc này lặp lại nhiều lần trong tài liệu một cách cố ý, vì đây là ranh giới kiến trúc quan trọng nhất của toàn bộ giải pháp.

---

# 1. Problem Diagnosis — chẩn đoán vấn đề, đào sâu cơ chế

## 1.1. Quy trình hiện tại hoạt động thế nào, từng bước một

**[FACT — đề bài]** Case chỉ cho 2 tổng số: chi phí 380.000 VND và thời gian 1,8–4,6 ngày cho mỗi hồ sơ vay, không phân biệt vay 1,6 triệu hay 90,1 triệu.

**[GIẢ ĐỊNH]** Để hiểu con số đó nằm ở đâu, đội tự phân tách thành 5 bước, dựng ngược sao cho tổng khớp đúng 2 số case cho (không phải breakdown thật từ HLBVN):

|Bước|Ai làm|Input|Output|Bottleneck ở đây là gì|
|---|---|---|---|---|
|1. Nộp/bổ sung giấy tờ|Khách + chi nhánh/merchant|Giấy tờ tùy thân, giấy tờ thu nhập|Hồ sơ giấy đã nộp|Khách phải có đủ giấy tờ chuẩn mới nộp được — nhóm không có hợp đồng lao động/sao kê bị tắc ngay từ bước này|
|2. Xếp hàng chờ xử lý trung tâm|Bộ phận vận hành|Hồ sơ đã nộp|Hồ sơ trong hàng đợi|Đây là bottleneck thuần túy về **thời gian chờ**, không phải thời gian xử lý thật — hồ sơ không "được làm gì" ở bước này, chỉ nằm chờ tới lượt|
|3. Xác minh danh tính/SĐT/việc làm|Nhân viên xác minh|Hồ sơ + thông tin liên hệ|Xác nhận danh tính hợp lệ|Việc làm thủ công, mất thời gian cố định mỗi hồ sơ bất kể hồ sơ dễ hay khó|
|4. Đối chiếu CIC + hồ sơ thu nhập|Cán bộ tín dụng|Hồ sơ đã xác minh + tra cứu CIC|Đánh giá rủi ro sơ bộ|Đây là bước **chỉ đọc được 1 loại bằng chứng** (CIC + giấy tờ thu nhập chuẩn) — nếu khách không có loại bằng chứng này, cán bộ không có gì để đánh giá|
|5. Duyệt/ký/thiết lập giải ngân|Người duyệt + vận hành|Đánh giá rủi ro|Quyết định cuối + giải ngân|Bước hành chính, ít rủi ro nhưng vẫn cần thời gian xử lý|

**Vì sao cùng 1 bottleneck lại tạo ra CẢ chi phí VÀ cả độ trễ, không phải chỉ 1 trong 2:**

- **Chi phí** sinh ra vì mỗi bước (đặc biệt bước 3, 4) cần **thời gian làm việc của một con người có lương** — chi phí này là **chi phí cố định theo đầu hồ sơ**, không phụ thuộc số tiền vay.
- **Độ trễ** sinh ra vì các bước này chạy **tuần tự** (bước sau phải chờ bước trước xong), không chạy song song, và còn phải **xếp hàng** (bước 2) chờ tới lượt nếu có nhiều hồ sơ cùng lúc. Hai nguyên nhân chậm này — xử lý tuần tự và xếp hàng — là 2 cơ chế khác nhau, không phải cùng 1 nguyên nhân: xử lý tuần tự chậm vì các bước nối đuôi nhau; xếp hàng chậm thêm nữa vì công suất xử lý (bao nhiêu nhân viên cùng làm) không tăng theo số hồ sơ đến.

## 1.2. Vì sao chi phí không "scale" theo quy mô khoản vay

Chi phí ở bước 3 và 4 là **chi phí lao động theo thời gian** (nhân viên mất X phút để xác minh, Y phút để tra CIC), không phải chi phí tỷ lệ theo số tiền vay. Một hồ sơ vay 90 triệu và một hồ sơ vay 1,6 triệu đều cần **đúng lượng thời gian xác minh như nhau**, nên đều tốn **đúng 380.000 VND như nhau** (theo số case cho). Khi số tiền vay nhỏ, phần lãi thu được cũng nhỏ theo, trong khi chi phí xử lý không nhỏ theo — đây là cơ chế toán học đơn giản khiến khoản vay nhỏ **có thể lỗ ngay cả khi khách trả đủ, đúng hạn, không có gì sai**.

## 1.3. Vì sao chỉ dựa vào CIC tạo ra vấn đề với nhóm thin-file

**[FACT — đề bài]** 64,5% hồ sơ thuộc nhóm không có hồ sơ CIC: gig worker (15%), MSME (14,5%), first-time borrower (14,5%), salaried không CIC (20,5%).

Đây là chỗ cần phân biệt rõ 2 khái niệm hay bị gộp lẫn:

- **Thiếu khả năng trả nợ** — người này thực sự không có đủ tiền để trả, dù đánh giá bằng cách nào đi nữa.
- **Thiếu bằng chứng chứng minh khả năng trả nợ** — người này CÓ đủ tiền (có thu nhập thật, đều đặn), nhưng **không có loại giấy tờ mà quy trình hiện tại chấp nhận** (hợp đồng lao động, sao kê lương chuẩn, hồ sơ CIC).

Case mô tả rõ nhóm gig/MSME có "hoạt động giao dịch cao, doanh thu bán hàng số, dòng tiền kinh doanh định kỳ" **[FACT — đề bài]** — nghĩa là họ CÓ bằng chứng, chỉ là bằng chứng đó không nằm trong loại mà quy trình CIC-only chấp nhận. Hai vấn đề này đòi hỏi 2 cách giải quyết hoàn toàn khác nhau: nếu là "thiếu khả năng trả" thì giải pháp đúng là từ chối; nếu là "thiếu bằng chứng" thì giải pháp đúng là **mở rộng loại bằng chứng được chấp nhận**, không phải từ chối. Toàn bộ PayFlow Line được xây trên tiền đề rằng phần lớn 64,5% này rơi vào trường hợp thứ hai.

## 1.4. Nguyên nhân gốc rễ

**[GIẢI PHÁP — đội đề xuất]** Nguyên nhân gốc không phải "quy trình thủ công" đơn thuần, mà là: **quyết định được đưa ra ở cấp từng hồ sơ (application-level underwriting), không có cơ chế phân luồng theo độ rủi ro/độ dễ, và không có khái niệm "hạn mức dùng lại" (reusable credit line)**. Mọi hồ sơ — dễ hay khó, dữ liệu chuẩn hay không — đều đi qua đúng 1 quy trình giống hệt nhau, và mỗi lần mua hàng lại là một hồ sơ hoàn toàn mới, dù khách đã từng được duyệt trước đó.

Chính thiết kế này sinh ra cả 2 vấn đề đã nêu: thiếu phân luồng khiến ngay cả hồ sơ dễ (nhóm salaried có CIC) cũng tốn chi phí như hồ sơ khó; và việc chỉ chấp nhận 1 loại bằng chứng khiến 64,5% khách hàng bị loại dù có thể có khả năng trả nợ thật.

---

# 2. PayFlow Line — Reusable Credit Line, đào sâu cơ chế

## 2.1. Credit line là gì, khác gì với việc duyệt từng giao dịch

**[GIẢI PHÁP — đội đề xuất]** Một **credit line** (hạn mức tín dụng) là một **năng lực vay đã được tính sẵn trước**, gắn với khách hàng, có thể dùng nhiều lần, không phải gắn với 1 lần mua hàng cụ thể. Khác với việc "duyệt từng giao dịch" (point-in-time approval) — nơi mỗi lần mua hàng là một quyết định hoàn toàn mới, phải tính lại từ đầu — credit line tách rời 2 việc:

1. **Việc nặng (thẩm định):** chỉ làm **một lần** để tính ra một con số hạn mức.
2. **Việc nhẹ (xác nhận dùng):** làm **mỗi lần mua hàng**, chỉ là tra lại con số đã có sẵn.

Đây chính là lý do PayFlow Line được đặt tên "Line" — hạn mức, không phải "mỗi lần duyệt một khoản vay riêng".

## 2.2. Vòng đời đầy đủ của một credit line

**[GIẢI PHÁP — đội đề xuất]**

```
Customer onboarding → initial assessment → credit line được tạo →
checkout (xác nhận dùng) → loan drawdown (rút tiền/giải ngân khoản cụ thể) →
repayment (trả góp) → line refresh (làm mới mỗi 30 ngày) → quay lại checkout
```

- **Onboarding:** khách kết nối dữ liệu lần đầu (CASA, Sổ Bán Hàng, ví điện tử...) qua Data Passport.
- **Initial assessment:** hệ thống chạy pipeline đầy đủ (đọc dữ liệu → tính feature → Risk Score + Confidence Score → chọn làn) **một lần**, ra một hạn mức khởi điểm.
- **Credit line được tạo:** con số hạn mức này được lưu lại, gắn với khách, chưa gắn với bất kỳ giao dịch mua hàng cụ thể nào.
- **Checkout:** khi khách thực sự mua hàng, hệ thống chỉ cần tra lại hạn mức hiện có — đây là lúc "loan transaction" (giao dịch vay cụ thể) được tạo ra, gắn với 1 hạn mức tổng.
- **Loan drawdown:** số tiền thực tế được "rút" ra từ hạn mức cho đúng giao dịch này (ví dụ hạn mức 10 triệu, lần này mua đồ 3 triệu → rút 3 triệu, còn lại 7 triệu khả dụng).
- **Repayment:** khách trả góp theo lịch đã định cho khoản đã rút.
- **Line refresh:** sau 30 ngày, hệ thống chạy lại pipeline đánh giá với dữ liệu mới, điều chỉnh hạn mức tăng/giảm/đóng băng.

**Phân biệt 3 khái niệm hay bị nhầm:**

- **Credit line** = năng lực vay tổng, tồn tại liên tục, không gắn 1 lần mua cụ thể.
- **Loan transaction (drawdown)** = một khoản vay cụ thể, phát sinh tại 1 lần mua hàng, rút từ credit line.
- **Repayment** = hành động trả tiền lại cho từng loan transaction đã rút.

## 2.3. Khi nào line được tạo, khi nào refresh, vì sao 30 ngày

- Line được tạo **lần đầu** ngay sau khi hoàn tất initial assessment (onboarding).
- **[GIẢ ĐỊNH]** Line được refresh mỗi **30 ngày** — đây là con số đội tự chọn, không phải case cho. Lý do chọn 30 ngày: hầu hết chu kỳ thu nhập ở Việt Nam (lương, doanh thu bán hàng) tính theo tháng, nên 30 ngày là khoảng thời gian tự nhiên để có đủ dữ liệu mới mà không refresh quá thường xuyên (tốn chi phí tính toán) hay quá thưa (phản ứng chậm với thay đổi tài chính của khách).

## 2.4. Checkout thực sự kiểm tra những gì, vì sao có thể dưới 10 giây

**[GIẢI PHÁP — đội đề xuất]** Tại thời điểm checkout, hệ thống **không chạy lại toàn bộ pipeline thẩm định** (đã làm ở bước initial assessment/refresh trước đó rồi) — nó chỉ kiểm tra 3 việc nhẹ:

1. Hạn mức hiện tại còn đủ cho số tiền muốn mua không.
2. Có dấu hiệu bất thường tức thời nào không (ví dụ: nhiều giao dịch rút hạn mức liên tiếp trong thời gian ngắn — dấu hiệu khả nghi).
3. Xác nhận danh tính nhanh (ví dụ Face ID) để chắc chắn đúng là chủ hạn mức đang mua hàng, không phải người khác dùng trộm.

Vì **phần nặng (đọc dữ liệu, tính Risk Score/Confidence Score)** đã được làm xong **trước đó** (lúc initial assessment hoặc lần refresh gần nhất), nên tại checkout, hệ thống chỉ cần **tra bảng + vài kiểm tra nhẹ** — đây chính là lý do thời gian xuống dưới 10 giây, không phải vì hệ thống "nhanh hơn" theo nghĩa thẩm định nhanh hơn, mà vì **thẩm định không còn phải làm lúc đó nữa**.

## 2.5. Điều gì xảy ra nếu tình hình tài chính khách thay đổi sau khi đã có hạn mức

**[GIẢI PHÁP — đội đề xuất]** Cơ chế chính để bắt thay đổi này là **refresh mỗi 30 ngày** — nếu thu nhập giảm bất thường, lần refresh tiếp theo sẽ tự động hạ hoặc đóng băng hạn mức.

**[CÂN NHẮC PRODUCTION]** Đây là một giới hạn thật cần thừa nhận: nếu tình hình xấu đi **đột ngột giữa chu kỳ 30 ngày** (ví dụ khách vừa mất việc tuần trước), hệ thống **sẽ không bắt được ngay**, phải chờ tới lần refresh tiếp theo mới phát hiện. Một hệ thống production hoàn chỉnh hơn có thể cần thêm cơ chế "trigger event" — tức là một số dấu hiệu bất thường tức thời (ví dụ: không còn giao dịch lương/doanh thu nào trong 2 tuần liên tiếp) sẽ kích hoạt đánh giá lại ngay, không chờ đủ 30 ngày. Cơ chế trigger này **chưa được thiết kế chi tiết** trong phạm vi bài thi, chỉ được nêu ra như một hướng cải thiện cần làm thêm nếu triển khai thật.

---

# 3. AI Architecture — đào sâu nhất

## 3.1. LLM làm gì, và KHÔNG làm gì — ranh giới cứng, không đổi

**[GIẢI PHÁP — đội đề xuất] LLM làm:**

- Đọc nội dung giao dịch (transaction description) dạng văn bản tự do.
- Hiểu tiếng Việt tự nhiên, kể cả viết tắt/không dấu thường gặp trong sao kê ngân hàng.
- Phân loại (classify): đây là thu nhập, chi tiêu, hay khoản trả góp/vay khác.
- Trích xuất (extract): ngày, số tiền, nguồn/bên liên quan của giao dịch.
- Chuẩn hóa (normalize) dữ liệu thô thành định dạng có cấu trúc.
- Diễn giải (explain) quyết định cuối cùng thành câu ngôn ngữ tự nhiên cho khách/nhân viên.

**LLM KHÔNG làm:**

- Không tự tính Risk Score.
- Không tự đặt hạn mức tín dụng (credit limit).
- Không tự chọn làn Xanh/Vàng/Cam/Đỏ.
- Không tự ghi đè (override) bất kỳ luật/chính sách nào.

Đây là ranh giới **tuyệt đối**, lý do có 2 tầng:

1. **Tầng kỹ thuật:** LLM có thể trả lời khác nhau mỗi lần được hỏi cùng 1 câu — không phù hợp cho quyết định cần nhất quán tuyệt đối.
2. **Tầng pháp lý/nghiệp vụ:** quyết định tín dụng phải giải thích được chính xác từng yếu tố đóng góp — một con số do logistic regression tính ra giải thích được ("yếu tố A đóng góp +X điểm"), còn một quyết định do LLM "cảm nhận" ra thì không giải thích theo cách đó được.

## 3.2. Pipeline xử lý dữ liệu, từng bước

```
Raw transaction (văn bản thô) →
Normalized transaction (đã gắn nhãn: loại giao dịch, ngày, số tiền, nguồn) →
Aggregated features (các con số tổng hợp: số tháng dữ liệu, độ ổn định thu nhập, P25, tỷ lệ chi/thu...) →
ML model / fixed formula (Logistic Regression cho Risk Score, công thức cố định cho Confidence Score) →
Policy rules (luật cố định quyết định làn nào)
```

## 3.3. Ví dụ cụ thể — 3 dòng giao dịch tiếng Việt giả lập

Hãy xem hệ thống xử lý 3 dòng giao dịch mẫu sau như thế nào:

**Dòng 1: `SALARY NGUYEN VAN A 25,000,000`**

- LLM đọc: có chữ "SALARY" → gán nhãn **thu nhập**, loại nguồn **lương cố định**.
- Trích xuất: số tiền 25.000.000 VND, bên liên quan là người trả lương.
- Vào feature: đóng góp vào tính "thu nhập ổn định" — vì lương thường lặp lại đều đặn hàng tháng, đây là loại nguồn thu nhập **ít biến động** (haircut thấp nếu cần, hoặc dùng P25 không cần chiết khấu thêm nếu đủ 6 tháng dữ liệu).

**Dòng 2: `GRAB PAYOUT 1,200,000`**

- LLM đọc: có chữ "GRAB PAYOUT" → gán nhãn **thu nhập**, nhưng loại nguồn **thu nhập nền tảng (platform income)**, không phải lương cố định.
- Vào feature: đóng góp vào thu nhập, nhưng được xử lý theo nhánh "nguồn thu nhập biến động" — nếu khách có dưới 6 tháng dữ liệu, sẽ bị áp haircut 30–40% (theo mục 6 bên dưới), vì thu nhập từ app thường dao động mạnh theo tuần/tháng.

**Dòng 3: `THANH TOAN FE CREDIT 2,500,000`**

- LLM đọc: có chữ "THANH TOAN" (thanh toán) + "FE CREDIT" (tên một công ty tài chính tiêu dùng khác, không phải HLB) → đây **không phải thu nhập, cũng không phải chi tiêu sinh hoạt thông thường** — LLM gán nhãn **khoản trả góp/vay định kỳ ở nơi khác**.
- Đây chính xác là loại dòng giao dịch mà cơ chế **chống vay chồng (anti-stacking)** được thiết kế để bắt (xem mục 10) — nếu dòng này xuất hiện lặp lại hàng tháng với cùng số tiền, hệ thống nhận diện đây là một khoản vay đang chạy ở một tổ chức tín dụng khác, và đưa thông tin này vào việc đánh giá khả năng chi trả thêm của khách.

---

# 4. Risk Score — đào sâu

## 4.1. Risk Score đại diện cho cái gì

**[GIẢI PHÁP — đội đề xuất]** Risk Score là một con số đại diện cho **khả năng khách trả được khoản vay**, tính từ các yếu tố dòng tiền: mức thu nhập, độ ổn định của thu nhập, tỷ lệ chi tiêu trên thu nhập, và lịch sử trễ hạn nếu có. Đây không phải một lời "cam kết chắc chắn" khách sẽ trả hay không trả — nó là một **ước lượng xác suất**, dùng để xếp hạng khách hàng theo mức độ rủi ro tương đối.

## 4.2. Logistic Regression hoạt động thế nào, ở mức khái niệm

**[NGUỒN NGOÀI]** Logistic regression là một công thức toán học nhận vào nhiều yếu tố đầu vào (input features), gán cho mỗi yếu tố một **trọng số** (học được từ dữ liệu quá khứ), rồi cộng lại và chuyển thành một con số nằm trong khoảng 0 đến 1, đại diện cho xác suất xảy ra một sự kiện (ở đây là "trả nợ đúng hạn" hoặc ngược lại "vỡ nợ").

Cách dễ hình dung nhất: giống như một **phiếu chấm điểm** (scorecard) — mỗi yếu tố cộng hoặc trừ một số điểm nhất định ("thu nhập ổn định: +15 điểm", "có 1 lần trễ hạn gần đây: −10 điểm"), rồi tổng điểm được chuyển đổi thành một xác suất. Khác với "đoán mò", trọng số của từng yếu tố được **học từ dữ liệu quá khứ thật** (ai đã từng trả đúng hạn, ai không), không phải do con người tự gán tùy ý.

- **Input features:** mức thu nhập (đã tính theo P25, xem mục 6), độ ổn định thu nhập, tỷ lệ chi/thu, lịch sử trễ hạn nếu có dữ liệu.
- **Output:** một con số xác suất (hoặc điểm số tương đương), dùng để so sánh mức độ rủi ro giữa các khách hàng.

## 4.3. Vì sao Logistic Regression phù hợp với credit scoring

**[NGUỒN NGOÀI]** Nghiên cứu học thuật xác nhận: dù các mô hình học máy phức tạp hơn (gradient boosting, neural network) có độ chính xác dự đoán cao hơn, logistic regression vẫn là **tiêu chuẩn phổ biến nhất trong ngành tín dụng** vì cơ quan quản lý tài chính thường không chấp nhận các mô hình "hộp đen" thiếu minh bạch (Szepannek, 2019 — https://arxiv.org/pdf/2009.13384). Nói cách khác: chọn logistic regression **không phải vì đội không đủ năng lực làm mô hình phức tạp hơn**, mà vì đây là lựa chọn đúng đắn về mặt nghiệp vụ ngân hàng.

## 4.4. Vì sao explainability (giải thích được) quan trọng

**[NGUỒN NGOÀI]** Việt Nam có Luật Trí tuệ nhân tạo 134/2025/QH15 (hiệu lực 1/3/2026), xếp hệ thống AI ra quyết định tự động trong lĩnh vực tài chính vào nhóm có thể bị coi là "rủi ro cao", bắt buộc phải giải thích được lý do quyết định, với thời hạn tuân thủ đầy đủ là 1/9/2027 (nguồn: ApolatLegal — https://apolatlegal.com/vi/laws/luat-tri-tue-nhan-tao-2025-so-134-2025-qh15/ ; Tạp chí Ngân hàng NHNN — https://tapchinganhang.gov.vn/luat-tri-tue-nhan-tao-nam-2025-va-nhung-tac-dong-den-linh-vuc-ngan-hang-tai-viet-nam-17169.html). Với logistic regression, mỗi quyết định có thể diễn giải thành 1 câu cụ thể, ví dụ: _"Thu nhập 3 tuần gần đây không ổn định, nên hạn mức thấp hơn"_ — điều mà một mô hình hộp đen không làm được.

## 4.5. Risk Score khác Confidence Score như thế nào — ví dụ cụ thể

Đây là chỗ dễ nhầm nhất, cần ví dụ rõ ràng:

**Khách A:** Risk Score tốt (ví dụ 0,85 — rủi ro thấp), nhưng Confidence thấp (ví dụ 0,3 — vì chỉ mới có 1 tháng dữ liệu). **Khách B:** Risk Score tương tự (0,85), nhưng Confidence cao (0,8 — vì đã có 6 tháng dữ liệu từ 2 nguồn khác nhau, dữ liệu mới).

**Vì sao 2 khách này không nên đi cùng 1 làn, dù Risk Score giống hệt nhau:** Risk Score của Khách A **trông đẹp**, nhưng nó được tính từ **rất ít bằng chứng** — có thể 1 tháng đó khách A gặp may (ví dụ có một đơn hàng lớn bất thường), không đại diện cho xu hướng thật. Risk Score của Khách B dựa trên **nhiều bằng chứng ổn định hơn**, nên đáng tin hơn nhiều dù con số giống hệt Khách A. Nếu hệ thống chỉ nhìn Risk Score mà bỏ qua Confidence, nó sẽ đối xử với 2 khách này y hệt nhau — trong khi thực ra rủi ro "đoán sai" ở Khách A cao hơn nhiều. Đây chính là lý do hệ thống cần **2 trục đánh giá độc lập**, không phải 1.

---

# 5. Confidence Score — đào sâu công thức

**[PROTOTYPE]** Công thức: Confidence = 0,5 × Data Coverage + 0,3 × Source Agreement + 0,2 × Recency

## 5.1. Data Coverage là gì

Data Coverage = min(số tháng dữ liệu liên tục ÷ 6, 1). Ví dụ: khách có 3 tháng dữ liệu → Data Coverage = 3/6 = 0,5. Khách có 6 tháng trở lên → Data Coverage = 1 (tối đa).

**[GIẢ ĐỊNH]** Vì sao chọn 6 tháng làm mốc: đây là **con số đội tự chọn**, không phải kết quả tính toán thống kê. Lý do hợp lý để chọn: 6 tháng đủ để quan sát được ít nhất nửa năm biến động thu nhập (bao gồm cả mùa cao điểm/thấp điểm), nhưng không yêu cầu quá dài khiến nhiều khách mới không bao giờ đạt được Data Coverage tối đa.

## 5.2. Source Agreement nghĩa là gì

Source Agreement = số nguồn dữ liệu độc lập xác nhận cùng một mẫu hình thu nhập ÷ 3 (tối đa 1). Ví dụ: nếu cả dữ liệu CASA và dữ liệu doanh thu Sổ Bán Hàng của một người bán hàng đều cho thấy thu nhập khoảng 15 triệu/tháng, đây là **2 nguồn đồng thuận**. Nếu chỉ có 1 nguồn duy nhất, độ tin cậy thấp hơn.

## 5.3. Recency ảnh hưởng thế nào

Recency = 1 nếu dữ liệu mới nhất trong vòng 30 ngày gần đây, giảm tuyến tính về 0 khi dữ liệu cũ hơn 90 ngày. Lý do: tình hình tài chính của một người có thể thay đổi nhanh (mất việc, đổi nền tảng làm việc...), nên dữ liệu càng cũ càng kém phản ánh hiện tại.

## 5.4. Vì sao Confidence không phải là Risk

Risk trả lời câu hỏi: _"Người này có khả năng trả nợ cao hay thấp?"_ Confidence trả lời câu hỏi hoàn toàn khác: _"Chúng ta có đủ bằng chứng để tin vào câu trả lời ở trên không?"_ Một khách có thể **trông rất ít rủi ro** (Risk Score cao) nhưng **dữ liệu lại quá ít để tin chắc** (Confidence thấp) — ví dụ một gig worker mới làm 3 tuần, thu nhập 3 tuần đó rất tốt, nhưng 3 tuần chưa đủ để biết đây có phải xu hướng lâu dài hay chỉ là may mắn ngắn hạn.

## 5.5. Vì sao 0,5/0,3/0,2 CHỈ là trọng số khởi điểm của prototype

**[PROTOTYPE]** Đây là điểm cần nhấn mạnh rõ ràng, không được trình bày như một sự thật đã kiểm chứng: 3 con số trọng số này là **giả thuyết khởi điểm dựa trên trực giác nghiệp vụ** (đội cho rằng độ phủ dữ liệu và độ mới quan trọng hơn số lượng nguồn xác nhận), **không phải kết quả của bất kỳ phân tích thống kê hay nghiên cứu khoa học nào**. Không có cơ sở academic hay empirical nào đứng sau 3 con số cụ thể này.

**[CÂN NHẮC PRODUCTION]** Trong môi trường thật, các trọng số này cần được **hiệu chỉnh lại (recalibrate)** bằng cách huấn luyện một mô hình thứ hai trên dữ liệu outcome thật — ví dụ: xem lại những trường hợp cán bộ tín dụng đã ghi đè (override) quyết định của máy, và liệu override đó cuối cùng đúng hay sai trong thực tế. Từ dữ liệu này, có thể tính lại trọng số chính xác hơn, thay vì dùng con số do đội tự đặt.

---

# 6. Income Calculation và P25 — đào sâu

## 6.1. P25 là gì, giải thích đơn giản

P25 (phân vị thứ 25) là: nếu bạn xếp tất cả các tháng thu nhập từ thấp đến cao, P25 là giá trị mà **25% số tháng nằm ở mức đó hoặc thấp hơn, còn 75% số tháng còn lại cao hơn**. Nói cách khác, P25 đại diện cho "một tháng khá tệ", không phải "một tháng trung bình".

## 6.2. Ví dụ cụ thể: 6 tháng thu nhập [8tr, 10tr, 12tr, 7tr, 15tr, 20tr]

Sắp xếp lại từ thấp đến cao: **7, 8, 10, 12, 15, 20** (đơn vị triệu VND).

- **Trung bình (average):** (7+8+10+12+15+20) ÷ 6 = 72 ÷ 6 = **12 triệu**.
- **P25:** nằm ở khoảng vị trí thứ 1,5 trong dãy đã sắp xếp (giữa giá trị thứ 1 và thứ 2) → ước lượng khoảng **7,5–8 triệu**, tùy phương pháp nội suy cụ thể.

**So sánh:** Nếu dùng trung bình (12 triệu) để tính khả năng trả nợ, hệ thống đang giả định khách luôn kiếm được mức đó — nhưng thực tế có tháng khách chỉ kiếm 7 triệu. Nếu khoản trả góp được tính dựa trên 12 triệu, đến tháng khách chỉ kiếm 7 triệu, khoản trả góp đó có thể trở nên quá sức. Dùng P25 (~8 triệu) đảm bảo khoản vay vẫn trả được **ngay cả trong tháng tệ**, không chỉ trong tháng trung bình hay tháng tốt.

## 6.3. Vì sao P25 phù hợp hơn average cho thu nhập biến động

Logic cốt lõi: khả năng chi trả (affordability) nên được tính dựa trên **kịch bản xấu**, không phải kịch bản trung bình hay lạc quan — vì khoản trả góp vẫn phải trả **đều đặn mỗi tháng**, kể cả tháng khách kiếm ít hơn bình thường.

## 6.4. Phân biệt thu nhập ổn định và thu nhập biến động

- **Thu nhập ổn định (lương cố định):** chênh lệch giữa average và P25 **rất nhỏ** — vì lương gần như giống nhau mỗi tháng. Dùng average hay P25 cho kết quả gần giống nhau.
- **Thu nhập biến động (tài xế, bán hàng online):** chênh lệch giữa average và P25 **lớn** — như ví dụ trên, average 12 triệu nhưng P25 chỉ 8 triệu, chênh tới 4 triệu. Với nhóm này, việc chọn average hay P25 tạo ra khác biệt rất lớn trong kết quả tính hạn mức.

## 6.5. Haircut khi dưới 6 tháng dữ liệu hoạt động thế nào

**[GIẢI PHÁP — đội đề xuất]** Nếu khách có **dưới 6 tháng** dữ liệu, không đủ số lượng tháng để tính P25 một cách đáng tin cậy (ví dụ chỉ có 2 tháng dữ liệu thì "phân vị 25" gần như không có ý nghĩa thống kê). Trong trường hợp này, hệ thống chuyển sang cách tính đơn giản hơn: lấy **trung bình đơn giản**, rồi áp thêm một tỷ lệ chiết khấu (haircut) để bù đắp cho việc thiếu dữ liệu:

- 30–40% cho nguồn thu nhập biến động (ví dụ thu nhập tài xế).
- 10–15% cho nguồn thu nhập ổn định (ví dụ lương chuyển khoản).

**Lưu ý kỹ thuật quan trọng (đã sửa từ bản nháp trước):** **không bao giờ áp dụng cả P25 VÀ haircut cùng lúc** cho cùng một khách hàng — chỉ dùng P25 (khi đủ ≥6 tháng dữ liệu) HOẶC dùng trung bình + haircut (khi dưới 6 tháng), không trộn cả hai, vì làm vậy sẽ tính hạn mức thấp hơn mức cần thiết một cách không hợp lý.

---

# 7. Bốn làn quyết định — đào sâu logic

## 7.1. Bảng chi tiết từng làn

|Làn|Điều kiện Risk|Điều kiện Confidence|Điều kiện dữ liệu|Cân nhắc kinh tế (quy mô khoản vay)|Hành động hệ thống|Trải nghiệm khách|Có người tham gia không|
|---|---|---|---|---|---|---|---|
|🟢 Xanh|Thấp|Cao|Đầy đủ, nhất quán|Mọi quy mô|Tự động duyệt ngay|Dưới 10 giây, không cảm nhận gì|Không|
|🟡 Vàng|Chấp nhận được|Trung bình/thấp (thin-file)|Có dữ liệu nhưng chưa đủ dày|Khoản nhỏ/vừa|Cấp hạn mức khởi điểm nhỏ, mời chia sẻ thêm nguồn để mở thêm hạn mức|Nhanh, nhưng hạn mức giới hạn ban đầu|Không|
|🟠 Cam|Không chắc chắn (chưa đánh giá được rõ ràng)|Thấp|Thiếu/mơ hồ|**Đủ lớn để bõ công người xem**|Hồ sơ điền sẵn, chuyển cán bộ, cam kết trả lời trong 4 giờ|Chờ vài giờ|Có|
|🔴 Đỏ|Cao (đánh giá chắc chắn là rủi ro) HOẶC có dấu hiệu gian lận|—|—|—|Từ chối kèm lý do rõ, mời mở CASA để xây hồ sơ|Từ chối nhưng có đường quay lại|Không (trừ khi khách yêu cầu human review)|

## 7.2. Vì sao làn Cam KHÔNG đơn giản là "rủi ro cao"

Đây là điểm hay bị hiểu nhầm nhất. Làn Cam **không phải dành cho hồ sơ rủi ro cao** — nếu hệ thống **đã chắc chắn** một hồ sơ rủi ro cao (Confidence cao + Risk cao), hồ sơ đó đi thẳng vào **làn Đỏ** (từ chối), không cần người xem lại, vì không có gì "không chắc" để con người giải quyết thêm.

Làn Cam dành cho tình huống **"không chắc chắn" (uncertainty)** — tức là Confidence thấp, hệ thống **không đủ tự tin** để tự quyết theo bất kỳ hướng nào (duyệt hay từ chối) — **kết hợp với** việc khoản vay đủ lớn để việc bỏ công một người xem xét kỹ là **đáng giá về mặt kinh tế**. Nói cách khác: làn Cam = (không chắc chắn) + (đáng để trả chi phí cho người xem).

## 7.3. Vì sao "Confidence thấp + khoản vay nhỏ" KHÔNG tự động vào làn Cam

**[GIẢI PHÁP — đội đề xuất]** Việc một cán bộ xem xét hồ sơ thủ công **có chi phí thật** — theo đúng số liệu case cho, review thủ công tốn khoảng 380.000 VND/hồ sơ. Nếu một khoản vay chỉ 1,6 triệu VND (mức nhỏ nhất trong case) rơi vào tình huống "không chắc chắn", việc chuyển cho người xem sẽ tốn **nhiều hơn cả lợi nhuận** có thể thu được từ khoản vay đó — một quyết định kinh tế vô nghĩa. Vì vậy, các hồ sơ nhỏ ở vùng "không chắc chắn" **không được chuyển cho người**, mà nhận một phương án thay thế tự động (ví dụ: giảm số tiền vay, rút ngắn kỳ hạn) để vẫn phục vụ được khách mà không tốn chi phí review không tương xứng.

---

# 8. Năm nhóm khách hàng — đào sâu từng nhóm

**[FACT — đề bài]** Tỷ trọng từng nhóm giữ nguyên theo Exhibit 2 của case: Salaried có CIC 35,5%; Salaried không CIC 20,5%; Gig/Platform 15%; Online merchant/MSME 14,5%; First-time borrower 14,5%.

## 8.1. Salaried, có CIC (35,5%)

- **Vấn đề của khách:** không có vấn đề lớn — đây là nhóm dễ nhất.
- **Dữ liệu có sẵn:** hồ sơ CIC đầy đủ, lương chuyển khoản nếu có tài khoản HLB.
- **Dữ liệu còn thiếu:** gần như không thiếu gì.
- **Nguồn dữ liệu chính:** CIC + CASA (nếu có).
- **Cách chấm điểm:** dùng ngay dữ liệu chuẩn sẵn có, không cần xử lý đặc biệt.
- **Làn khả dĩ nhất:** 🟢 Xanh.
- **Cơ chế trả nợ:** trả góp cố định qua tài khoản hiện có.
- **Vì sao PayFlow Line vẫn hữu ích với nhóm này:** dù dữ liệu đã chuẩn, quy trình CŨ vẫn bắt họ đi qua đúng quy trình thủ công như mọi hồ sơ khác — PayFlow Line giúp nhóm này được **tự động hóa đầu tiên**, tiết kiệm chi phí/thời gian ngay lập tức, dễ triển khai nhất.

## 8.2. Salaried, không CIC (20,5%)

- **Vấn đề của khách:** có lương ổn định, nhưng chưa từng vay nên không có hồ sơ CIC.
- **Dữ liệu có sẵn:** lịch sử lương chuyển khoản (nếu có tài khoản ngân hàng).
- **Dữ liệu còn thiếu:** hồ sơ CIC.
- **Nguồn dữ liệu chính:** CASA (nếu là tài khoản HLB) hoặc Open API đọc tài khoản ngân hàng khác khi khách đồng ý.
- **Cách chấm điểm:** dùng lịch sử lương thay cho CIC.
- **Làn khả dĩ nhất:** 🟢 Xanh hoặc 🟡 Vàng tùy độ đầy đủ dữ liệu.
- **Cơ chế trả nợ:** trả góp cố định, ưu tiên ủy quyền ghi nợ tự động từ CASA.
- **Vì sao PayFlow Line hữu ích:** mở khóa khả năng vay cho người **có đủ khả năng trả nhưng bị chặn chỉ vì chưa từng vay trước đó**.

## 8.3. Gig/Platform workers (15%)

- **Vấn đề của khách:** thu nhập thật, đều đặn theo cách riêng, nhưng không có hợp đồng lao động/sao kê chuẩn.
- **Dữ liệu có sẵn:** thu nhập từ nền tảng (tần suất, độ ổn định, có bị phạt không).
- **Dữ liệu còn thiếu:** hồ sơ CIC, hợp đồng lao động.
- **Nguồn dữ liệu chính:** dữ liệu nền tảng (Grab, Be...) nếu khách đồng ý chia sẻ.
- **Cách chấm điểm:** thu nhập tính theo P25 (mục 6), vì thu nhập loại này thường biến động mạnh.
- **Làn khả dĩ nhất:** 🟡 Vàng.
- **Cơ chế trả nợ:** ưu tiên nếu khách đổi tài khoản nhận payout sang HLB (xem phần Repayment Tiers); nếu không, dùng ủy quyền ghi nợ tiêu chuẩn với hạn mức thấp hơn.
- **Vì sao PayFlow Line hữu ích:** đây là nhóm bị quy trình cũ "bỏ quên" nhiều nhất dù có thu nhập thật — PayFlow Line là cơ chế đầu tiên đọc được loại bằng chứng này.

## 8.4. Online merchants/MSME (14,5%)

- **Vấn đề của khách:** có doanh thu bán hàng thật, nhưng không có báo cáo tài chính chuẩn.
- **Dữ liệu có sẵn:** doanh thu QR qua Sổ Bán Hàng (nếu dùng), hóa đơn điện tử nếu có.
- **Dữ liệu còn thiếu:** báo cáo tài chính chính thức.
- **Nguồn dữ liệu chính:** Sổ Bán Hàng (hợp tác với HLB).
- **Cách chấm điểm:** doanh thu QR hằng ngày, tính theo cùng logic P25/haircut.
- **Làn khả dĩ nhất:** 🟡 Vàng.
- **Cơ chế trả nợ:** trích % doanh thu QR mỗi ngày, ngay trong hạ tầng HLB — không cần đối tác bên ngoài đồng ý.
- **Vì sao PayFlow Line hữu ích:** biến chính dòng tiền bán hàng hằng ngày thành bằng chứng trả nợ, đồng thời thành kênh thu nợ tự động.

## 8.5. First-time borrowers (14,5%)

- **Vấn đề của khách:** gần như không có bất kỳ dữ liệu tài chính nào ngân hàng có thể dùng.
- **Dữ liệu có sẵn:** ví điện tử, thanh toán hóa đơn đúng hạn (nếu có).
- **Dữ liệu còn thiếu:** gần như mọi loại bằng chứng thu nhập ổn định.
- **Nguồn dữ liệu chính:** ví điện tử, lịch sử thanh toán hóa đơn.
- **Cách chấm điểm:** nếu không đủ dữ liệu, Confidence Score sẽ thấp, giới hạn hạn mức tối đa dù Risk Score có cao.
- **Làn khả dĩ nhất:** 🟡 Vàng, khởi điểm với hạn mức rất nhỏ (1,6 triệu VND — mức nhỏ nhất trong case **[FACT — đề bài]**).
- **Cơ chế trả nợ:** trả góp cố định qua CASA.
- **Vì sao PayFlow Line hữu ích:** đây là nhóm khó nhất, giải quyết bằng cơ chế Credit Ladder (mục 12) — cho vay nhỏ, tăng dần theo lịch sử trả nợ.

---

# 9. Affordability — đào sâu

## 9.1. Affordability khác Risk Score thế nào

Risk Score trả lời: _"Nhìn chung, người này có khả năng trả nợ cao hay thấp?"_ — dựa trên lịch sử và mẫu hình hành vi. **Affordability** trả lời một câu hỏi khác hẳn: _"Ngay cả khi người này nhìn chung đáng tin, liệu KHOẢN VAY CỤ THỂ NÀY, với số tiền này, có vượt quá khả năng chi trả hiện tại của họ không?"_

**Ví dụ minh họa:** một khách hàng có lịch sử trả nợ xuất sắc (Risk Score rất tốt) nhưng lần này muốn vay một số tiền mà khoản trả góp hàng tháng sẽ chiếm tới 80% thu nhập của họ. Risk Score **không bắt được vấn đề này**, vì Risk Score nhìn vào lịch sử/hành vi chung, không nhìn vào **quy mô cụ thể của khoản vay mới** so với thu nhập hiện tại. Đây là lý do cần một bước kiểm tra **độc lập** — affordability — chạy riêng sau khi đã có Risk Score.

## 9.2. Debt-service ratio hoạt động thế nào, ở mức khái niệm

Công thức khái niệm: **tổng nghĩa vụ trả nợ hàng tháng (bao gồm khoản vay cũ nếu có + khoản vay mới) chia cho thu nhập hàng tháng**, rồi giới hạn tỷ lệ này dưới một ngưỡng nhất định.

## 9.3. Ngưỡng 60%/30% — cần nói rõ đây KHÔNG phải fact đã xác nhận

**[GIẢ ĐỊNH — quan trọng, không được trình bày như fact]** Đội đề xuất trần 60% thu nhập cho nhóm salaried, 30% thu nhập P25 cho nhóm thu nhập biến động. **Lưu ý quan trọng đã được kiểm chứng trong quá trình làm bài: con số 60% KHÔNG tìm thấy ở bất kỳ đâu trên website công khai của HLBVN** (đã kiểm tra trực tiếp trang Unsecured Personal Loan và Vay Tiêu Dùng — chỉ công bố thu nhập tối thiểu 10 triệu/tháng, hạn mức 30–500 triệu, lãi suất "từ 15%/năm", không công bố tỷ lệ trả nợ tối đa). Vì vậy, 60% và 30% **phải được trình bày như giả định/đề xuất của đội, không phải "chính sách hiện có của HLBVN đã xác nhận"** như một số bản nháp trước đây viết nhầm.

---

# 10. Anti-stacking — đào sâu

## 10.1. Vay chồng (loan stacking) là gì, vì sao nguy hiểm

Vay chồng là tình trạng một khách hàng đang có **nhiều khoản vay/trả góp cùng lúc ở nhiều tổ chức tín dụng khác nhau**, mà mỗi tổ chức cho vay riêng lẻ **không nhìn thấy** các khoản vay ở nơi khác. Nguy hiểm vì: dù mỗi khoản vay riêng lẻ trông "vừa sức trả" khi xét độc lập, **tổng cộng tất cả các khoản** có thể vượt quá khả năng trả thật của khách — một rủi ro đã được ghi nhận trong nghiên cứu về BNPL (mua trước trả sau) ở các thị trường khác.

## 10.2. AI phát hiện vay chồng bằng cách nào — dùng lại ví dụ dòng 3 ở mục 3.3

Như ví dụ `THANH TOAN FE CREDIT 2,500,000` ở mục 3.3: LLM đọc nội dung giao dịch trên tài khoản của khách, nhận diện đây là một khoản thanh toán định kỳ cho một tổ chức tín dụng khác (không phải HLB). Nếu dòng giao dịch tương tự lặp lại đều đặn hàng tháng, hệ thống suy ra đây là một **khoản vay/trả góp đang chạy ở nơi khác**, đưa thông tin này vào việc tính lại khả năng chi trả thêm (affordability) của khách cho khoản vay mới.

## 10.3. HLB CASA hiện nhìn thấy được gì, và giới hạn ở đâu

**HLB CASA chỉ nhìn thấy các giao dịch thực sự chảy qua tài khoản mà khách đã kết nối với HLB.** Nếu khoản trả góp FE Credit ở ví dụ trên được trích từ chính tài khoản HLB của khách, hệ thống thấy được. Nhưng nếu khách trả khoản đó từ **một tài khoản ở ngân hàng khác mà HLB không có quyền truy cập**, hệ thống **hoàn toàn không biết** về khoản vay đó — đây là **điểm mù thật, chưa giải quyết được trong phạm vi giải pháp hiện tại.**

## 10.4. False positive có thể xảy ra như thế nào

Việc dựa vào ngôn ngữ tự nhiên để đoán "đây có phải khoản trả góp không" không phải lúc nào cũng chính xác tuyệt đối. Ví dụ: một khách hàng chuyển một số tiền cố định cho bạn/người thân mỗi tháng (ví dụ để trả nợ cá nhân, hoặc gửi tiền phụ giúp gia đình) có thể bị hệ thống **nhầm thành một khoản trả góp định kỳ**, dù thực chất không phải. Đây là lý do một tín hiệu "nghi vay chồng" **không nên là bằng chứng chắc chắn tuyệt đối**, mà chỉ nên là một **cờ cảnh báo (flag)**.

## 10.5. Vì sao cờ cảnh báo vay chồng nên chuyển sang làn Cam, không tự động từ chối

Chính vì rủi ro false positive ở mục 10.4, một cờ cảnh báo vay chồng **không đủ chắc chắn để tự động từ chối** — làm vậy có thể từ chối oan một khách hàng hoàn toàn tốt. Thay vào đó, cờ cảnh báo này nên đẩy hồ sơ vào **làn Cam** để một con người xem xét kỹ hơn bối cảnh thật của giao dịch đó, trước khi đưa ra quyết định cuối cùng.

## 10.6. Phân biệt 2 loại vay chồng

- **Vay chồng nội bộ/tài khoản đã kết nối:** phát hiện được **ngay bây giờ**, bằng cách đọc giao dịch trên tài khoản khách đã kết nối với HLB.
- **Vay chồng liên ngân hàng (cross-bank):** chỉ được giải quyết triệt để khi có đủ ngân hàng kết nối qua Open API — **[NGUỒN NGOÀI]** Open API đã có hiệu lực pháp lý từ tháng 3/2025 (Thông tư 64/2024/TT-NHNN — https://sbv.gov.vn/en/w/open-api-tr%E1%BB%A5c-k%E1%BA%BFt-n%E1%BB%91i-m%E1%BB%9Bi-c%E1%BB%A7a-h%E1%BB%87-sinh-th%C3%A1i-t%C3%A0i-ch%C3%ADnh-s%E1%BB%91-vi%E1%BB%87t-nam), nhưng việc **bao nhiêu ngân hàng thực sự kết nối và chia sẻ dữ liệu đến mức nào** vẫn đang trong quá trình triển khai dần, không phải đã hoàn tất ngay khi luật có hiệu lực. **[CÂN NHẮC PRODUCTION]** Đây vẫn là một điểm mù cần theo dõi liên tục theo thời gian, không phải vấn đề giải quyết xong 1 lần.

---

# 11. Fraud Detection — hai lớp

## 11.1. Lớp khách hàng (customer-side fraud)

**[GIẢI PHÁP — đội đề xuất]**

- **Chip ID:** đọc dữ liệu sinh trắc học lưu trong chip của căn cước công dân.
- **Liveness check:** kiểm tra có đúng một người thật đang đứng trước camera, không phải ảnh chụp hay video giả.
- **Face matching:** đối chiếu khuôn mặt với dữ liệu dân cư quốc gia (C06).
- **Tín hiệu thiết bị/SIM:** nhận diện khi cùng 1 thiết bị được dùng để nộp nhiều hồ sơ khác nhau — dấu hiệu khả nghi.

**[NGUỒN NGOÀI]** Theo số liệu Ngân hàng Nhà nước Việt Nam (tính đến 30/7/2025), việc đối chiếu sinh trắc học qua CCCD gắn chip/VNeID đã giúp **giảm 59% số khách hàng cá nhân bị lừa đảo, mất tiền** so với trước khi áp dụng (nguồn: vnbusiness.vn — https://vnbusiness.vn/ngan-hang/100-tai-khoan-thanh-toan-ca-nhan-da-duoc-doi-chieu-sinh-trac-hoc-1108829.html). Đây là số liệu thật của toàn ngành ngân hàng Việt Nam, không phải số liệu riêng của HLBVN hay của giải pháp này.

## 11.2. Lớp người bán (merchant-side fraud)

**[GIẢI PHÁP — đội đề xuất]** Theo dõi: đơn hàng trả góp bất thường tập trung ở 1 shop, nhiều khách của cùng 1 shop trễ hạn ngay kỳ đầu tiên, tỷ lệ hoàn hàng cao bất thường ở 1 shop.

**Vì sao phần này quan trọng riêng cho cho vay tại điểm bán (POS lending):** khác với cho vay tiêu dùng thông thường (chỉ có ngân hàng và khách vay), cho vay tại điểm bán có thêm **một bên thứ ba — người bán** — người này có thể **cấu kết** với một "khách hàng" (hoặc tạo khách hàng giả) để: tạo một đơn hàng trả góp cho món đồ không tồn tại, ngân hàng giải ngân tiền cho người bán, rồi "khách hàng" đó để khoản vay vỡ nợ hoặc trả lại "hàng" (hoàn tiền) trong khi người bán đã giữ tiền giải ngân. Đây là rủi ro **đặc thù của mô hình cho vay tại điểm bán**, không xuất hiện trong cho vay tiêu dùng thông thường — nên cần một lớp giám sát riêng ở cấp độ người bán, không chỉ giám sát từng khách vay riêng lẻ.

**Lưu ý quan trọng:** tài liệu này **không tự thêm vào bất kỳ mô hình chấm điểm gian lận cụ thể hay ngưỡng số liệu cụ thể nào** cho phần merchant-side, vì nguồn gốc (case và các research đã làm) không cung cấp những con số đó — đây chỉ là mô tả **cơ chế/hướng kiểm soát**, chưa phải một mô hình đã lượng hóa.

---

# 12. Credit Ladder — đào sâu cơ chế

## 12.1. Cơ chế tổng quát

```
Không có/ít lịch sử tín dụng → exposure (rủi ro) ban đầu rất nhỏ →
quan sát hành vi trả nợ → tăng dần hạn mức →
lịch sử tín dụng ngày càng mạnh hơn, được báo cáo lên CIC
```

**[FACT — đề bài]** Mức khởi điểm là 1,6 triệu VND — chính là mức vay nhỏ nhất được phép trong case.

## 12.2. Vì sao đây không phải "cho vay bừa"

Điểm mấu chốt: **mức độ rủi ro (exposure) mà ngân hàng chấp nhận ở mỗi bước đều được giới hạn chặt chẽ.** Ngay cả trong trường hợp xấu nhất (khách không trả), ngân hàng cũng chỉ mất một khoản **đã biết trước, rất nhỏ** (1,6 triệu VND cho lần đầu). Hạn mức chỉ tăng lên khi khách **đã chứng minh được bằng hành vi thật** (trả đúng hạn), không phải tự động tăng theo thời gian hay theo lời hứa.

## 12.3. Vì sao hành vi trả nợ tạo ra thông tin mới

Đây là logic cốt lõi: với một khách hàng chưa từng vay, **không có cách nào khác để biết chắc họ có thực sự trả nợ đúng hạn hay không** ngoài việc **quan sát họ thực sự làm điều đó**. Mọi loại giấy tờ, dữ liệu dòng tiền, hay mô hình chấm điểm đều chỉ là **dự đoán gián tiếp** — còn việc quan sát hành vi trả nợ thật là **bằng chứng trực tiếp nhất có thể có**.

## 12.4. Mối quan hệ với CIC

Khi khách trả đúng hạn qua Credit Ladder, thông tin này được báo cáo lên hệ thống CIC — nghĩa là khách hàng, **lần đầu tiên trong đời**, có một hồ sơ tín dụng chính thức. Hồ sơ này không chỉ giúp họ vay thêm ở HLB, mà còn giúp họ với **bất kỳ tổ chức tín dụng nào khác trong tương lai** — vì CIC là hệ thống dùng chung toàn ngành.

## 12.5. Vấn đề Reject Inference

**[NGUỒN NGOÀI]** Đây là một vấn đề kinh điển trong ngành chấm điểm tín dụng: bất kỳ mô hình nào chỉ huấn luyện trên dữ liệu của những khách **đã được duyệt vay** sẽ **không bao giờ học được** liệu nhóm **thường xuyên bị từ chối trước đây** (gig worker, first-time borrower) có thực sự trả được nợ hay không — vì ngân hàng chưa từng quan sát họ trả nợ thật (họ chưa từng được vay). Đây gọi là vấn đề **reject inference** (SAS, 2009 — https://support.sas.com/resources/papers/proceedings09/305-2009.pdf). Một nghiên cứu phân tích một nền tảng fintech thật cho thấy: khi mở rộng duyệt vay cho nhóm trước đây bị từ chối dựa trên dữ liệu thay thế, có 15–30% trong số đó thực sự trả nợ tốt, chứng minh họ bị từ chối **oan** chứ không phải thực sự rủi ro cao (Björkegren & Grissen, Management Science, 2024 — https://pubsonline.informs.org/doi/10.1287/mnsc.2024.07854).

## 12.6. Khái niệm Controlled Exploration

**[NGUỒN NGOÀI]** Một nghiên cứu năm 2026 cho thấy các kỹ thuật thống kê truyền thống để "đoán" nhãn cho người bị từ chối (dựa trên suy luận gián tiếp) thường **không thực sự cải thiện mô hình** — hiệu quả chỉ là ảo giác thống kê. Thay vào đó, nghiên cứu đề xuất **controlled exploration**: chủ động duyệt một tỷ lệ nhỏ, có giới hạn, các hồ sơ thin-file ở ngưỡng biên, để **quan sát kết quả thật** thay vì đoán bằng công thức ("The Illusion of Improvement: Reject Inference Strategies in Credit Scoring", 2026 — https://arxiv.org/html/2606.18479v1). **[GIẢI PHÁP — đội đề xuất]** Áp dụng ý tưởng này: dành khoảng 5% hồ sơ thin-file ở ngưỡng biên, cho vay thử tối đa 3 triệu VND, chi phí ước tính khoảng 9 triệu VND trên 1.000 hồ sơ — một ngân sách có giới hạn rõ ràng (= mức lỗ tối đa chấp nhận được), để dần dần thu thập dữ liệu thật và sửa lỗi thiên lệch của mô hình theo thời gian.

---

# 13. Prototype Architecture — phần kỹ thuật nhất

## 13.1. Toàn bộ pipeline, từng bước, chi tiết

|Bước|Input|Xử lý|Output|Thật hay mock|Công nghệ|Vì sao tồn tại|
|---|---|---|---|---|---|---|
|1. Dữ liệu khách thô|Văn bản giao dịch, PDF, ảnh (synthetic)|—|Dữ liệu thô chưa xử lý|**Mock/synthetic**|—|Không có quyền truy cập dữ liệu thật của HLBVN|
|2. LLM đọc/chuẩn hóa|Dữ liệu thô|Phân loại thu nhập/chi tiêu/trả góp khác, trích xuất ngày/số tiền/nguồn|Danh sách giao dịch có cấu trúc|**Thật**|LLM API|Chỉ AI mới đọc được văn bản tự do tiếng Việt lộn xộn|
|3. Trích xuất feature|Giao dịch có cấu trúc|Tính: số tháng dữ liệu, số nguồn, độ mới, P25 thu nhập, tỷ lệ chi/thu|Bộ feature số|Code thường, không phải AI|Code Python/logic thường|Đây là phép tính xác định, không cần AI|
|4. Tính Confidence Score|Bộ feature số|Áp công thức cố định (mục 5)|1 con số 0–1|**Thật**|Công thức cố định|Minh bạch, tính lại được mọi lúc|
|5. Tính Risk Score|Bộ feature số|Chạy qua model Logistic Regression đã train|1 con số xác suất rủi ro|**Thật**|Logistic Regression (train trên synthetic data)|Chuẩn ngành, giải thích được|
|6. Policy/rule engine|Risk Score + Confidence Score|Áp luật cố định (nếu...thì...)|Chọn 1 trong 4 làn|Mock/giả lập rule đơn giản nếu cần|Code thường|Luật cố định, không cần AI, dễ giải thích|
|7. Quyết định làn|Làn đã chọn|—|Kết quả cuối (duyệt/từ chối/chuyển người/...)|Phụ thuộc làn|—|—|
|8. LLM giải thích|Kết quả cuối + lý do|Dịch thành câu dễ hiểu|Câu giải thích cho khách/nhân viên|**Thật**|LLM API|Cần ngôn ngữ tự nhiên, không phải code cứng|

## 13.2. Danh sách Real vs Mock, nhắc lại dứt khoát

**Real trong prototype:**

- LLM API (bước 2 và bước 8)
- Logistic Regression (bước 5)
- Công thức Confidence Score (bước 4)

**Mock trong prototype:**

- CIC
- C06 (xác minh chip CCCD)
- HLB CASA
- QR / Sổ Bán Hàng
- Policy engine (nếu cần giả lập rule đơn giản thay vì tích hợp hệ thống thật)

---

# 14. Synthetic Data — vì sao quan trọng, giải thích đầy đủ

## 14.1. Vì sao không dùng dữ liệu thật của HLBVN

**[GIẢ ĐỊNH/RÀNG BUỘC]** Đội thi **không có quyền truy cập** vào bất kỳ dữ liệu khách hàng thật nào của HLBVN — đây là ràng buộc cố định của việc tham gia một cuộc thi sinh viên, không phải lựa chọn kỹ thuật.

## 14.2. Synthetic data dùng để chứng minh điều gì — và KHÔNG chứng minh điều gì

Đây là điểm quan trọng nhất của toàn bộ phần prototype, cần phân biệt rõ ràng **2 câu khẳng định hoàn toàn khác nhau**:

1. **"Mô hình chạy đúng về mặt kỹ thuật"** — nghĩa là: pipeline từ đầu đến cuối hoạt động không lỗi, model học được đúng những gì nó được thiết kế để học.
2. **"Mô hình đã được chứng minh chính xác cho khách hàng thật của HLBVN"** — nghĩa là: đã kiểm chứng trên dữ liệu trả nợ thật, biết chắc nó dự đoán đúng trong thế giới thật.

**Synthetic data chỉ chứng minh được câu (1), TUYỆT ĐỐI KHÔNG chứng minh được câu (2).** Hai câu này không được phép đánh đồng với nhau trong bất kỳ hoàn cảnh nào khi trình bày hoặc trả lời Q&A.

## 14.3. Cách thiết kế synthetic data để chứng minh (1) một cách có giá trị, không chỉ "diễn trò"

**[PROTOTYPE]** Khi tạo dữ liệu giả, đội **tự đặt trước một quy luật nhân quả đã biết** giữa một feature và kết quả trả nợ — ví dụ: "mỗi điểm tăng thêm về độ bất ổn thu nhập làm tăng xác suất trễ hạn thêm một mức cố định do đội tự chọn". Sau khi train xong model, đội kiểm tra xem model có **tự tìm lại đúng quy luật đó** hay không. Đây là phương pháp kiểm định pipeline machine learning chuẩn (dùng ground truth đã biết trước để xác nhận mô hình học đúng), **không phải một thủ thuật để "diễn" cho có vẻ chuyên nghiệp.**

## 14.4. 5 nhóm khách được đại diện thế nào, cần field gì

**[PROTOTYPE]**

- Mỗi khách mẫu cần **ít nhất 6 tháng** dữ liệu giao dịch.
- Đại diện đủ cả 5 nhóm (mục 8).
- Mỗi khách cần: chuỗi giao dịch (ngày, số tiền, nội dung mô tả), nhãn phân loại thu nhập/chi tiêu, và **một kết quả trả nợ** (đã trả đúng hạn hay không) được tạo ra theo đúng quy luật nhân quả đã định trước ở mục 14.3.

---

# 15. Demo — kể như một câu chuyện hoàn chỉnh

**[PROTOTYPE]** Luồng demo trực tiếp (live) đi theo đúng trình tự sau, với **1 nhóm khách + 1 làn duy nhất** (gợi ý: gig worker hoặc first-time borrower, đi qua làn Vàng):

> Dữ liệu đầu vào (giao dịch giả lập của 1 khách mẫu) → LLM đọc và phân loại từng giao dịch → dữ liệu được chuẩn hóa thành danh sách có cấu trúc → tính ra bộ feature (P25 thu nhập, độ ổn định...) → tính Risk Score → tính Confidence Score → áp luật chọn làn → khách rơi vào làn Vàng → hệ thống cấp một hạn mức khởi điểm (credit line) → LLM viết câu giải thích lý do cho khách hiểu.

**Vì sao không cần build đủ cả 5 nhóm × 4 làn:** trong vài ngày có hạn, việc build và demo trực tiếp toàn bộ 20 tổ hợp (5 nhóm × 4 làn) là không khả thi và cũng không cần thiết để chứng minh ý tưởng. Chọn đúng **1 tổ hợp đại diện cho phần khác biệt rõ nhất của giải pháp** (nhóm thin-file đi qua làn Vàng — đây chính là phần quy trình cũ không làm được, còn PayFlow Line làm được) là đủ để chứng minh pipeline chạy thật. Kiến trúc được thiết kế để **mở rộng được** sang các nhóm/làn khác sau này mà không cần xây lại từ đầu — các nhóm/làn còn lại chỉ cần trình bày bằng slide.

---

# 16. Production vs Prototype — bảng so sánh rõ ràng

||Những gì bài thi chứng minh (Prototype)|Những gì cần thêm nếu triển khai thật (Production)|
|---|---|---|
|Dữ liệu|Pipeline chạy đúng trên synthetic data có quy luật đã biết|**[CÂN NHẮC PRODUCTION]** Cần dữ liệu lịch sử trả nợ thật của HLBVN để train/validate lại model|
|Model|Logistic Regression chạy đúng, học đúng quy luật đã cài sẵn|Cần hiệu chỉnh (calibration) và kiểm định (validation) trên dữ liệu thật, theo đúng quy trình quản trị mô hình rủi ro của ngân hàng|
|Confidence Score|Công thức cố định chạy được|Cần tái hiệu chỉnh trọng số bằng dữ liệu outcome thật (override rate, kết quả thật của các quyết định)|
|Giám sát|Không có, vì không chạy dài hạn trong phạm vi demo|Cần giám sát model drift (model lệch dần theo thời gian), giám sát tỷ lệ cán bộ ghi đè quyết định máy|
|Tích hợp hệ thống|Toàn bộ mock (CIC, C06, CASA, Sổ Bán Hàng)|Cần tích hợp thật với các hệ thống này, qua đúng quy trình bảo mật/pháp lý của ngân hàng|
|Quản trị|Không áp dụng trong phạm vi demo|Cần cơ chế phê duyệt chính sách bởi Credit Risk Committee, cơ chế kill-switch khi rủi ro vượt ngưỡng|
|Gian lận|Mô tả cơ chế, chưa có số liệu ngưỡng cụ thể|Cần xây dựng và hiệu chỉnh ngưỡng cảnh báo gian lận dựa trên dữ liệu thật, giám sát liên tục|

_Lưu ý: bảng trên chỉ liệt kê những điểm suy luận hợp lý từ chính kiến trúc đã mô tả, không tự bịa thêm chi tiết triển khai cụ thể của riêng HLBVN mà tài liệu nguồn không có._

---

# 17. Q&A Knowledge — ngữ cảnh để trả lời câu hỏi giám khảo

_Phần này không viết sẵn câu trả lời kiểu thuyết trình — chỉ cung cấp đủ ngữ cảnh/con số/mục tham chiếu để NotebookLM (hoặc người đọc) tự dựng câu trả lời phù hợp với cách hỏi cụ thể._

**Why LLM instead of traditional NLP/rules?** → Xem mục 3.1, 3.3. Ngữ cảnh chính: văn bản giao dịch tiếng Việt tự do, đa dạng cách viết, không thể liệt kê hết bằng luật if-else; LLM xử lý được ngữ cảnh linh hoạt hơn rule cứng.

**Why Logistic Regression?** → Xem mục 4.3. Ngữ cảnh chính: tiêu chuẩn ngành vì giải thích được, có nguồn học thuật xác nhận (Szepannek 2019), không phải vì thiếu năng lực làm model phức tạp hơn.

**Why not let AI make the final decision?** → Xem mục 3.1 (ranh giới cứng) và 4.4 (yêu cầu pháp lý Luật AI 134/2025). Ngữ cảnh: tính nhất quán, tính giải thích được, yêu cầu pháp lý sắp có hiệu lực.

**Why P25?** → Xem mục 6. Ngữ cảnh: phản ánh kịch bản thu nhập xấu thay vì trung bình, phù hợp hơn cho affordability với thu nhập biến động. Có ví dụ số cụ thể để minh họa.

**Why Confidence Score?** → Xem mục 4.5, 5. Ngữ cảnh: Risk Score và độ tin cậy vào Risk Score là 2 câu hỏi khác nhau; ví dụ Khách A/B minh họa rõ.

**What happens if Confidence is low?** → Xem mục 7 (4 làn). Ngữ cảnh: tùy kết hợp với Risk Score và quy mô khoản vay — có thể vào làn Vàng (hạn mức nhỏ), làn Cam (chuyển người, nếu khoản đủ lớn), hoặc nhận phương án thay thế tự động (nếu khoản nhỏ).

**What if customer has no CIC?** → Xem mục 8 (đặc biệt 8.2–8.5), mục 12 (Credit Ladder cho first-time). Ngữ cảnh: hệ thống dùng dữ liệu thay thế tùy nhóm, không coi "không có CIC" đồng nghĩa "không đáng tin".

**How do you detect loan stacking?** → Xem mục 10. Ngữ cảnh: đọc giao dịch trên tài khoản đã kết nối, dùng ví dụ "THANH TOAN FE CREDIT".

**What if the other loan is at another bank?** → Xem mục 10.3, 10.6. Ngữ cảnh: đây là điểm mù thật, chưa giải quyết được hoàn toàn, phụ thuộc mức độ kết nối Open API liên ngân hàng theo thời gian.

**How do you prevent fraud?** → Xem mục 11. Ngữ cảnh: 2 lớp — khách hàng (sinh trắc học, có số liệu 59% thật) và người bán (phát hiện mẫu hình bất thường, chưa có mô hình lượng hóa cụ thể).

**Why Yellow instead of Reject?** → Xem mục 7, mục 12. Ngữ cảnh: thin-file không đồng nghĩa rủi ro cao — chỉ là thiếu bằng chứng (xem phân biệt ở mục 1.3); làn Vàng cho cơ hội với hạn mức giới hạn, an toàn hơn từ chối thẳng.

**Why human review only for Orange?** → Xem mục 7.2, 7.3. Ngữ cảnh: Cam = không chắc chắn + đáng giá kinh tế; khoản nhỏ không chắc chắn không vào Cam vì chi phí người xem (380.000đ theo case) có thể vượt giá trị khoản vay.

**Why use synthetic data?** → Xem mục 14.1. Ngữ cảnh: ràng buộc không có quyền truy cập dữ liệu thật của HLBVN, không phải lựa chọn.

**How do you know the model works?** → Xem mục 14.3. Ngữ cảnh: kiểm định bằng quy luật nhân quả đã biết trước, xem model có tìm lại đúng quy luật đó không — phân biệt rõ với "đã chứng minh đúng cho khách thật" (mục 14.2).

**What would you need from HLB to productionize this?** → Xem mục 16. Ngữ cảnh: dữ liệu trả nợ thật, tích hợp hệ thống thật, quy trình quản trị model, giám sát liên tục.

**What is real vs mock in the prototype?** → Xem mục 13.2. Ngữ cảnh: LLM API + Logistic Regression + Confidence Score là thật; mọi hệ thống ngân hàng (CIC/C06/CASA/Sổ Bán Hàng) là mock.

**What happens when customer financial situation changes?** → Xem mục 2.5. Ngữ cảnh: refresh mỗi 30 ngày bắt được thay đổi dần; thay đổi đột ngột giữa chu kỳ là giới hạn thật chưa giải quyết (cần cơ chế trigger event, thuộc phạm vi production).