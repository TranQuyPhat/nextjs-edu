import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { role } = await req.json();
  // Lấy token hiện tại
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Cập nhật role vào token (ở đây chỉ là ví dụ, thực tế bạn cần custom adapter hoặc lưu vào DB)
  // Nếu dùng JWT, bạn cần custom callback jwt để nhận role từ request

  // Trả về thành công
  return NextResponse.json({ ok: true });
}
