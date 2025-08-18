import * as yup from "yup";

export const quizFormSchema = yup.object().shape({
  title: yup.string().required("Vui lòng nhập tiêu đề"),
  grade: yup
    .string()
    .matches(/^[0-9]{1,2}$/, "Khối lớp phải là số (vd: 10, 11...)")
    .required("Vui lòng nhập khối lớp"),
  subject: yup.string().required("Vui lòng chọn môn học"),
  time: yup
    .number()
    .typeError("Thời gian phải là số")
    .positive("Thời gian phải lớn hơn 0")
    .integer("Thời gian phải là số nguyên")
    .required("Vui lòng nhập thời gian làm bài"),
  startDate: yup
    .date()
    .typeError("Ngày bắt đầu không hợp lệ")
    .required("Vui lòng chọn ngày bắt đầu"),
  endDate: yup
    .date()
    .typeError("Ngày kết thúc không hợp lệ")
    .min(yup.ref("startDate"), "Ngày kết thúc phải sau ngày bắt đầu")
    .required("Vui lòng chọn ngày kết thúc"),
  description: yup.string().required("Vui lòng nhập mô tả"),
  files: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .test("is-docx", "Chỉ chấp nhận tệp .docx", (file) =>
          file ? file.name.endsWith(".docx") : false
        )
    )
    .min(1, "Vui lòng tải lên ít nhất 1 tệp .docx"),
  classId: yup.number().required(), // ẩn trong form, nhưng cần validate nếu bạn submit
  createdBy: yup.number().required(), // giống classId
});
